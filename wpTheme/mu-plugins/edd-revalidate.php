<?php
/**
 * Plugin Name: Every Day Digital — Next.js Revalidate
 * Description: Pings the Next.js front end when content is published, updated, unpublished, trashed or deleted so the live site updates immediately.
 * Version:     1.1.0
 * Author:      Every Day Digital
 *
 * INSTALL (Cloudways / production):
 *   1. Copy this file and edd-common.php to  wp-content/mu-plugins/
 *      (create the mu-plugins folder if it doesn't exist — "must-use" plugins
 *      load automatically and can't be deactivated by accident).
 *   2. Add to wp-config.php, above "That's all, stop editing":
 *        define( 'EDD_REVALIDATE_URL',    'https://everydaydigital.co.nz/api/revalidate' );
 *        define( 'EDD_REVALIDATE_SECRET', '<same value as REVALIDATE_SECRET in Vercel>' );
 *      Optional — also ping a preview deployment while testing:
 *        define( 'EDD_REVALIDATE_PREVIEW_URL', 'https://<branch>-everyday-digital.vercel.app/api/revalidate' );
 *   3. Publish or update any post. Tools → Site Health → Info → "EDD Revalidate"
 *      shows the last result for each target; failures are also written to the
 *      PHP error log.
 *
 * Generate a secret with:  openssl rand -hex 32
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/edd-common.php';

final class EDD_Revalidate {

	/** Option holding the last ping result for each target URL. */
	private const OPTION_RESULTS = 'edd_revalidate_results';

	/** Seconds to wait for each target. Kept short because the editor waits for it. */
	private const TIMEOUT = 3;

	public static function init(): void {
		// Publish, update, unpublish, trash and restore all change post status
		// (or re-save a published post), so this one hook covers them all.
		add_action( 'transition_post_status', array( __CLASS__, 'on_transition' ), 10, 3 );
		// Deleting a published post without going through the trash skips the status change.
		add_action( 'before_delete_post', array( __CLASS__, 'on_delete' ), 10, 2 );
		// Site Health panel for visibility.
		add_filter( 'debug_information', array( __CLASS__, 'site_health' ) );
		// Admin bar button: "Refresh live site" — purges everything.
		add_action( 'admin_bar_menu', array( __CLASS__, 'admin_bar' ), 100 );
		EDD_Common::on_admin_action( 'edd_revalidate_all', 'edit_others_posts', array( __CLASS__, 'ping_all' ) );
	}

	/**
	 * Pings when the published state of an item changes, or a published item is updated.
	 *
	 * Draft-only edits are ignored. Revisions and autosaves have their own post
	 * type ('revision'), so the content type check skips them too.
	 */
	public static function on_transition( string $new_status, string $old_status, WP_Post $post ): void {
		if ( 'publish' !== $new_status && 'publish' !== $old_status ) {
			return;
		}
		self::ping_post( $post );
	}

	/**
	 * Pings when a published item is deleted outright.
	 *
	 * Items deleted from the trash are skipped: they were already purged when
	 * they were trashed.
	 */
	public static function on_delete( int $post_id, WP_Post $post ): void {
		if ( 'publish' === $post->post_status ) {
			self::ping_post( $post );
		}
	}

	/** Purges everything on the website. */
	public static function ping_all(): void {
		self::send( array( 'all' => true ) );
	}

	/** Purges one item, if its post type drives the website. */
	private static function ping_post( WP_Post $post ): void {
		$type = EDD_Common::content_type( $post->post_type );
		if ( null === $type ) {
			return;
		}
		$body = array(
			'all'  => false,
			'type' => $type,
			'slug' => self::public_slug( $post ),
		);
		if ( 'page' === $type ) {
			$body['uri'] = self::public_uri( $post, $body['slug'] );
		}
		self::send( $body );
	}

	/**
	 * The slug the item is (or was) published under.
	 *
	 * Trashing renames the slug to "{slug}__trashed" and stores the original in
	 * the _wp_desired_post_slug meta. Next.js needs the original to purge the
	 * real URL.
	 */
	private static function public_slug( WP_Post $post ): string {
		if ( 'trash' === $post->post_status ) {
			$slug = get_post_meta( $post->ID, '_wp_desired_post_slug', true );
			if ( $slug ) {
				return $slug;
			}
		}
		return $post->post_name;
	}

	/**
	 * The site-relative URL the item is (or was) published at, e.g. "/about/".
	 *
	 * get_permalink() gives non-public items (drafts, trash) a "?page_id=" link,
	 * so this works it out from a published copy that has the public slug.
	 */
	private static function public_uri( WP_Post $post, string $slug ): string {
		$published              = clone $post;
		$published->post_status = 'publish';
		$published->post_name   = $slug;
		return wp_make_link_relative( get_permalink( $published ) );
	}

	/**
	 * POSTs the payload to every configured target and records each result for Site Health.
	 *
	 * Blocking, with a short timeout per target, so the result can be recorded.
	 * A slow or unreachable front end delays saving in the editor by at most
	 * TIMEOUT seconds per target.
	 */
	private static function send( array $body ): void {
		if ( ! EDD_Common::configured( 'EDD_REVALIDATE_URL', 'EDD_REVALIDATE_SECRET' ) ) {
			error_log( '[EDD Revalidate] EDD_REVALIDATE_URL / EDD_REVALIDATE_SECRET not defined in wp-config.php' );
			return;
		}

		$results = array();
		foreach ( self::targets() as $url ) {
			$response        = EDD_Common::post_json( $url, EDD_REVALIDATE_SECRET, $body, self::TIMEOUT );
			$results[ $url ] = self::result( $url, $body, $response );
		}
		// Every ping goes to every target, so this replaces stale entries too.
		update_option( self::OPTION_RESULTS, $results, false );
	}

	/**
	 * Target URLs, keyed by a label for Site Health.
	 *
	 * @return array<string, string>
	 */
	private static function targets(): array {
		$targets = array();
		foreach ( array( 'Production' => 'EDD_REVALIDATE_URL', 'Preview' => 'EDD_REVALIDATE_PREVIEW_URL' ) as $label => $constant ) {
			if ( EDD_Common::configured( $constant ) ) {
				$targets[ $label ] = constant( $constant );
			}
		}
		return $targets;
	}

	/**
	 * Summarises one target's response, logging failures.
	 *
	 * @param string         $url      Target URL.
	 * @param array          $body     Payload that was sent.
	 * @param array|WP_Error $response wp_remote_post() response.
	 * @return array{time: string, type: string, slug: string, status: string, detail: string}
	 */
	private static function result( string $url, array $body, $response ): array {
		$result = array(
			'time' => current_time( 'mysql' ),
			'type' => $body['type'] ?? 'all',
			'slug' => $body['slug'] ?? '',
		);

		if ( is_wp_error( $response ) ) {
			$result['status'] = 'error';
			$result['detail'] = $response->get_error_message();
			error_log( '[EDD Revalidate] ' . $url . ' failed: ' . $result['detail'] );
			return $result;
		}

		$code             = wp_remote_retrieve_response_code( $response );
		$ok               = $code >= 200 && $code < 300;
		$result['status'] = $ok ? 'ok' : 'http ' . $code;
		$result['detail'] = substr( wp_remote_retrieve_body( $response ), 0, 300 );
		if ( ! $ok ) {
			error_log( '[EDD Revalidate] ' . $url . ' returned HTTP ' . $code );
		}
		return $result;
	}

	public static function admin_bar( WP_Admin_Bar $bar ): void {
		// Refreshing the whole site is for editors, not every author
		if ( ! current_user_can( 'edit_others_posts' ) ) {
			return;
		}
		$bar->add_node(
			array(
				'id'    => 'edd-revalidate',
				'title' => '↻ Refresh live site',
				'href'  => EDD_Common::admin_action_url( 'edd_revalidate_all' ),
				'meta'  => array( 'title' => 'Push all published content to the live Next.js site now' ),
			)
		);
	}

	/** Adds an "EDD Revalidate" section to Tools → Site Health → Info, with one row per target. */
	public static function site_health( array $info ): array {
		$results = get_option( self::OPTION_RESULTS, array() );
		$fields  = array(
			'configured' => array(
				'label' => 'Configured',
				'value' => EDD_Common::configured( 'EDD_REVALIDATE_URL', 'EDD_REVALIDATE_SECRET' ) ? 'Yes' : 'No — add constants to wp-config.php',
			),
		);

		foreach ( self::targets() as $label => $url ) {
			$last = $results[ $url ] ?? null;

			$fields[ 'target_' . strtolower( $label ) ] = array(
				'label' => $label,
				'value' => $last
					? sprintf( '%s — last ping %s: %s (%s) %s', $url, $last['time'], $last['status'], trim( $last['type'] . ' ' . $last['slug'] ), $last['detail'] )
					: $url . ' — never pinged',
			);
		}

		$info['edd_revalidate'] = array(
			'label'  => 'EDD Revalidate',
			'fields' => $fields,
		);
		return $info;
	}
}

EDD_Revalidate::init();

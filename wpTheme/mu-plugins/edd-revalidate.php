<?php
/**
 * Plugin Name: Every Day Digital — Next.js Revalidate
 * Description: Pings the Next.js front end when content is published, updated, trashed or deleted so the live site updates immediately.
 * Version:     1.0.0
 * Author:      Every Day Digital
 *
 * INSTALL (Cloudways / production):
 *   1. Copy this file to  wp-content/mu-plugins/edd-revalidate.php
 *      (create the mu-plugins folder if it doesn't exist — "must-use" plugins
 *      load automatically and can't be deactivated by accident).
 *   2. Add to wp-config.php, above "That's all, stop editing":
 *        define( 'EDD_REVALIDATE_URL',    'https://everydaydigital.co.nz/api/revalidate' );
 *        define( 'EDD_REVALIDATE_SECRET', '<same value as REVALIDATE_SECRET in Vercel>' );
 *      Optional — also ping a preview deployment while testing:
 *        define( 'EDD_REVALIDATE_PREVIEW_URL', 'https://<branch>-everyday-digital.vercel.app/api/revalidate' );
 *   3. Publish or update any post. Tools → Site Health → Info → "EDD Revalidate"
 *      shows the last result; failures are also written to the PHP error log.
 *
 * Generate a secret with:  openssl rand -hex 32
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class EDD_Revalidate {

	/** Post types that drive the Next.js site. Anything else is ignored. */
	private const TYPES = array( 'post', 'page', 'project', 'service', 'team', 'testimonial' );

	private const OPTION_LAST = 'edd_revalidate_last';

	public static function init(): void {
		// Fires on publish, update, unpublish (status change) — covers the Gutenberg "Publish"/"Update" button.
		add_action( 'transition_post_status', array( __CLASS__, 'on_transition' ), 10, 3 );
		// Fires on trash/untrash/permanent delete.
		add_action( 'trashed_post', array( __CLASS__, 'on_trashed' ), 10, 1 );
		add_action( 'untrashed_post', array( __CLASS__, 'on_trashed' ), 10, 1 );
		add_action( 'before_delete_post', array( __CLASS__, 'on_trashed' ), 10, 1 );
		// Menu changes affect nav rendering.
		add_action( 'wp_update_nav_menu', array( __CLASS__, 'on_menu' ), 10, 1 );
		// Site Health panel for visibility.
		add_filter( 'debug_information', array( __CLASS__, 'site_health' ) );
		// Admin bar button: "Refresh live site" — purges everything.
		add_action( 'admin_bar_menu', array( __CLASS__, 'admin_bar' ), 100 );
		add_action( 'admin_post_edd_revalidate_all', array( __CLASS__, 'handle_manual' ) );
	}

	public static function on_transition( string $new, string $old, WP_Post $post ): void {
		if ( ! in_array( $post->post_type, self::TYPES, true ) ) {
			return;
		}
		// Ignore autosaves/revisions and draft→draft edits; only act when the public state changes or a published item is updated.
		if ( wp_is_post_autosave( $post ) || wp_is_post_revision( $post ) ) {
			return;
		}
		$was_public = 'publish' === $old;
		$is_public  = 'publish' === $new;
		if ( ! $was_public && ! $is_public ) {
			return;
		}
		self::ping( $post );
	}

	public static function on_trashed( int $post_id ): void {
		$post = get_post( $post_id );
		if ( $post && in_array( $post->post_type, self::TYPES, true ) ) {
			self::ping( $post );
		}
	}

	public static function on_menu(): void {
		self::ping( null, true );
	}

	/**
	 * POST to the Next.js revalidate route. Non-blocking so a slow front end can never
	 * slow down the WordPress editor; results are recorded on the next admin request.
	 */
	private static function ping( ?WP_Post $post, bool $all = false ): void {
		if ( ! defined( 'EDD_REVALIDATE_SECRET' ) || ! defined( 'EDD_REVALIDATE_URL' ) ) {
			error_log( '[EDD Revalidate] EDD_REVALIDATE_URL / EDD_REVALIDATE_SECRET not defined in wp-config.php' );
			return;
		}

		$body = array( 'all' => $all );
		if ( $post ) {
			$body['type'] = $post->post_type;
			$body['slug'] = $post->post_name;
			if ( 'page' === $post->post_type ) {
				$body['uri'] = wp_make_link_relative( get_permalink( $post ) );
			}
		}

		$targets = array( EDD_REVALIDATE_URL );
		if ( defined( 'EDD_REVALIDATE_PREVIEW_URL' ) && EDD_REVALIDATE_PREVIEW_URL ) {
			$targets[] = EDD_REVALIDATE_PREVIEW_URL;
		}

		foreach ( $targets as $url ) {
			$response = wp_remote_post(
				$url,
				array(
					'timeout'  => 5,
					'blocking' => true, // short timeout; keeps the result for Site Health
					'headers'  => array(
						'Content-Type'  => 'application/json',
						'Authorization' => 'Bearer ' . EDD_REVALIDATE_SECRET,
					),
					'body'     => wp_json_encode( $body ),
				)
			);

			$record = array(
				'time'   => current_time( 'mysql' ),
				'url'    => $url,
				'type'   => $body['type'] ?? 'all',
				'slug'   => $body['slug'] ?? '',
			);

			if ( is_wp_error( $response ) ) {
				$record['status'] = 'error';
				$record['detail'] = $response->get_error_message();
				error_log( '[EDD Revalidate] ' . $url . ' failed: ' . $response->get_error_message() );
			} else {
				$code             = wp_remote_retrieve_response_code( $response );
				$record['status'] = ( $code >= 200 && $code < 300 ) ? 'ok' : 'http ' . $code;
				$record['detail'] = substr( wp_remote_retrieve_body( $response ), 0, 300 );
				if ( $code < 200 || $code >= 300 ) {
					error_log( '[EDD Revalidate] ' . $url . ' returned HTTP ' . $code );
				}
			}
			update_option( self::OPTION_LAST, $record, false );
		}
	}

	public static function admin_bar( WP_Admin_Bar $bar ): void {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return;
		}
		$bar->add_node(
			array(
				'id'    => 'edd-revalidate',
				'title' => '↻ Refresh live site',
				'href'  => wp_nonce_url( admin_url( 'admin-post.php?action=edd_revalidate_all' ), 'edd_revalidate_all' ),
				'meta'  => array( 'title' => 'Push all published content to the live Next.js site now' ),
			)
		);
	}

	public static function handle_manual(): void {
		if ( ! current_user_can( 'edit_posts' ) || ! check_admin_referer( 'edd_revalidate_all' ) ) {
			wp_die( 'Not allowed' );
		}
		self::ping( null, true );
		wp_safe_redirect( wp_get_referer() ?: admin_url() );
		exit;
	}

	public static function site_health( array $info ): array {
		$last = get_option( self::OPTION_LAST );
		$info['edd_revalidate'] = array(
			'label'  => 'EDD Revalidate',
			'fields' => array(
				'configured' => array(
					'label' => 'Configured',
					'value' => ( defined( 'EDD_REVALIDATE_URL' ) && defined( 'EDD_REVALIDATE_SECRET' ) ) ? 'Yes' : 'No — add constants to wp-config.php',
				),
				'target'     => array(
					'label' => 'Target',
					'value' => defined( 'EDD_REVALIDATE_URL' ) ? EDD_REVALIDATE_URL : '—',
				),
				'last'       => array(
					'label' => 'Last ping',
					'value' => $last ? sprintf( '%s — %s (%s %s): %s', $last['time'], $last['status'], $last['type'], $last['slug'], $last['detail'] ) : 'Never',
				),
			),
		);
		return $info;
	}
}

EDD_Revalidate::init();

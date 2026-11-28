<?php
/**
 * Plugin Name: Every Day Digital — Shared helpers
 * Description: Code shared by the Every Day Digital must-use plugins (Next.js revalidate and social share). Does nothing on its own.
 * Version:     1.0.0
 * Author:      Every Day Digital
 *
 * Install this file in wp-content/mu-plugins/ alongside the plugins that use it.
 *
 * WordPress loads every top-level PHP file in mu-plugins (alphabetically), and
 * each plugin also loads this file with require_once so it never depends on
 * that order. The class_exists() guard below makes any second load a no-op,
 * even if the two loads resolve to different paths.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( class_exists( 'EDD_Common', false ) ) {
	return;
}

final class EDD_Common {

	/**
	 * Registered post type => canonical content type sent to the Next.js API routes.
	 *
	 * Keys are the post_type values WordPress stores. register_post_type()
	 * lowercases its name with sanitize_key(), so the theme's 'Projects' is stored
	 * as 'projects'. Values are the lowercase singular keys the Next.js side uses.
	 * Post types that aren't listed don't drive the website and are ignored.
	 */
	private const CONTENT_TYPES = array(
		'post'         => 'post',
		'page'         => 'page',
		'projects'     => 'project',
		'services'     => 'service',
		'team'         => 'team',
		'testimonials' => 'testimonial',
	);

	/** Canonical content type => path prefix of its single-item page on the website. */
	private const PATH_PREFIXES = array(
		'post'    => '/blog/',
		'project' => '/projects/',
		'service' => '/services/',
	);

	/**
	 * Returns the canonical content type for a post type.
	 *
	 * @param string $post_type Registered post type, e.g. 'projects'.
	 * @return string|null Canonical type, e.g. 'project', or null if the website doesn't use it.
	 */
	public static function content_type( string $post_type ): ?string {
		return self::CONTENT_TYPES[ $post_type ] ?? null;
	}

	/**
	 * Returns the registered post types behind some canonical content types.
	 *
	 * @param string[] $content_types Canonical types, e.g. array( 'post', 'project' ).
	 * @return string[] Post types, e.g. array( 'post', 'projects' ).
	 */
	public static function post_types( array $content_types ): array {
		return array_keys( array_intersect( self::CONTENT_TYPES, $content_types ) );
	}

	/**
	 * Builds the website path of a single item, e.g. '/projects/my-project'.
	 *
	 * @param string $content_type Canonical content type.
	 * @param string $slug         Item slug.
	 * @return string|null The path, or null for types without their own page (pages, team, testimonials).
	 */
	public static function item_path( string $content_type, string $slug ): ?string {
		return isset( self::PATH_PREFIXES[ $content_type ] ) ? self::PATH_PREFIXES[ $content_type ] . $slug : null;
	}

	/**
	 * Checks that settings from wp-config.php are present.
	 *
	 * @param string ...$constants Constant names.
	 * @return bool True when every constant is defined and not empty.
	 */
	public static function configured( string ...$constants ): bool {
		foreach ( $constants as $constant ) {
			if ( ! defined( $constant ) || ! constant( $constant ) ) {
				return false;
			}
		}
		return true;
	}

	/**
	 * POSTs a JSON body to a Next.js API route, authenticated with a bearer token.
	 *
	 * The request is blocking: it waits up to $timeout seconds so the caller can
	 * record the response.
	 *
	 * @param string $url     Endpoint URL.
	 * @param string $secret  Shared secret, sent as "Authorization: Bearer <secret>".
	 * @param array  $body    Payload, JSON-encoded.
	 * @param int    $timeout Seconds to wait for a response.
	 * @return array|WP_Error The wp_remote_post() response.
	 */
	public static function post_json( string $url, string $secret, array $body, int $timeout ) {
		return wp_remote_post(
			$url,
			array(
				'timeout' => $timeout,
				'headers' => array(
					'Content-Type'  => 'application/json',
					'Authorization' => 'Bearer ' . $secret,
				),
				'body'    => wp_json_encode( $body ),
			)
		);
	}

	/**
	 * Builds a nonce-protected admin-post.php link for an action registered with on_admin_action().
	 *
	 * @param string $action  Action name.
	 * @param int    $post_id Post the action applies to, or 0 for none.
	 * @return string The URL, HTML-escaped by wp_nonce_url().
	 */
	public static function admin_action_url( string $action, int $post_id = 0 ): string {
		$args = array( 'action' => $action );
		if ( $post_id ) {
			$args['post'] = $post_id;
		}
		return wp_nonce_url( add_query_arg( $args, admin_url( 'admin-post.php' ) ), self::nonce_action( $action, $post_id ) );
	}

	/**
	 * Handles an admin-post.php link built by admin_action_url().
	 *
	 * Before calling the handler it checks the nonce, which dies on failure,
	 * and the capability, which is checked against the post when the link has
	 * one (so 'edit_post' works). Afterwards it redirects to the URL the
	 * handler returns, or back to the referring page.
	 *
	 * @param string   $action     Action name.
	 * @param string   $capability Capability the user needs.
	 * @param callable $handler    Receives the post ID (0 for none); may return a redirect URL.
	 */
	public static function on_admin_action( string $action, string $capability, callable $handler ): void {
		add_action(
			'admin_post_' . $action,
			static function () use ( $action, $capability, $handler ): void {
				$post_id = isset( $_GET['post'] ) ? absint( $_GET['post'] ) : 0;
				check_admin_referer( self::nonce_action( $action, $post_id ) );
				$cap_args = $post_id ? array( $post_id ) : array();
				if ( ! current_user_can( $capability, ...$cap_args ) ) {
					wp_die( 'Not allowed', '', 403 );
				}
				$redirect = $handler( $post_id );
				wp_safe_redirect( $redirect ? $redirect : ( wp_get_referer() ? wp_get_referer() : admin_url() ) );
				exit;
			}
		);
	}

	/** Nonce action for an admin action. Per-post actions get a per-post nonce. */
	private static function nonce_action( string $action, int $post_id ): string {
		return $post_id ? $action . '_' . $post_id : $action;
	}
}

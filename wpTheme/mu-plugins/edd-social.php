<?php
/**
 * Plugin Name: EDD Social Share
 * Description: When a blog post or project is published for the first time, sends it to the Every Day Digital website, which writes captions with AI and posts to Facebook, Instagram and LinkedIn. Adds a "Share on social" box to the editor.
 * Version:     1.0.0
 * Author:      Every Day Digital
 *
 * Install: copy this file to wp-content/mu-plugins/ (must-use plugins load
 * automatically). Then add to wp-config.php, above "That's all, stop editing!":
 *
 *     define( 'EDD_SOCIAL_URL',    'https://everydaydigital.co.nz/api/social' );
 *     define( 'EDD_SOCIAL_SECRET', 'same value as SOCIAL_WEBHOOK_SECRET in Vercel' );
 *     define( 'EDD_SITE_URL',      'https://everydaydigital.co.nz' );
 *
 * How it works
 * - Fires once per item, the first time it goes to "publish" (including
 *   scheduled posts when their time comes). Updates never re-post.
 * - The send happens about a minute later through WP-Cron, so the website has
 *   already refreshed and publishing in the editor isn't slowed down.
 * - Untick "Share on social when published" in the editor box to skip an item.
 * - The result (captions written, and where it was posted) is saved on the
 *   item and shown in the editor box. "Share again" re-sends it on demand.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class EDD_Social_Share {

	/** Post types that get shared, mapped to their path on the website. */
	private const TYPES = array(
		'post'     => '/blog/',
		'projects' => '/projects/',
		'project'  => '/projects/',
	);

	private const META_SKIP   = '_edd_social_skip';
	private const META_SENT   = '_edd_social_sent';
	private const META_RESULT = '_edd_social_result';
	private const CRON_HOOK   = 'edd_social_send';

	public static function init(): void {
		add_action( 'transition_post_status', array( __CLASS__, 'on_transition' ), 20, 3 );
		add_action( self::CRON_HOOK, array( __CLASS__, 'send' ), 10, 1 );
		add_action( 'add_meta_boxes', array( __CLASS__, 'add_box' ) );
		add_action( 'save_post', array( __CLASS__, 'save_box' ), 10, 1 );
		add_action( 'admin_post_edd_social_resend', array( __CLASS__, 'resend' ) );
	}

	public static function on_transition( string $new, string $old, WP_Post $post ): void {
		if ( 'publish' !== $new || 'publish' === $old ) {
			return;
		}
		if ( ! isset( self::TYPES[ $post->post_type ] ) || wp_is_post_revision( $post ) ) {
			return;
		}
		if ( get_post_meta( $post->ID, self::META_SKIP, true ) || get_post_meta( $post->ID, self::META_SENT, true ) ) {
			return;
		}
		update_post_meta( $post->ID, self::META_SENT, gmdate( 'c' ) );
		wp_schedule_single_event( time() + 60, self::CRON_HOOK, array( $post->ID ) );
	}

	/** Builds the payload and sends it to the website. Runs from WP-Cron. */
	public static function send( int $post_id ): void {
		$post = get_post( $post_id );
		if ( ! $post || 'publish' !== $post->post_status ) {
			return;
		}
		// Checked again here: the block editor saves the "Share" box a moment
		// after the publish itself, so an unticked box may only land now.
		if ( get_post_meta( $post_id, self::META_SKIP, true ) && ! doing_action( 'admin_post_edd_social_resend' ) ) {
			delete_post_meta( $post_id, self::META_SENT );
			return;
		}
		if ( ! defined( 'EDD_SOCIAL_URL' ) || ! defined( 'EDD_SOCIAL_SECRET' ) ) {
			update_post_meta( $post_id, self::META_RESULT, wp_json_encode( array( 'ok' => false, 'error' => 'EDD_SOCIAL_URL / EDD_SOCIAL_SECRET not set in wp-config.php' ) ) );
			return;
		}

		$site  = defined( 'EDD_SITE_URL' ) ? untrailingslashit( EDD_SITE_URL ) : home_url();
		$path  = self::TYPES[ $post->post_type ] ?? '/';
		$image = get_the_post_thumbnail_url( $post, 'large' ) ?: '';
		$full  = get_the_post_thumbnail_url( $post, 'full' ) ?: $image;
		$text  = wp_strip_all_tags( strip_shortcodes( $post->post_content ) );
		$tags  = wp_get_post_terms( $post_id, 'post_tag', array( 'fields' => 'names' ) );

		$payload = array(
			'type'    => 'post' === $post->post_type ? 'post' : 'project',
			'id'      => $post_id,
			'title'   => html_entity_decode( get_the_title( $post ), ENT_QUOTES ),
			'excerpt' => html_entity_decode( wp_strip_all_tags( get_the_excerpt( $post ) ), ENT_QUOTES ),
			'text'    => mb_substr( preg_replace( '/\s+/', ' ', $text ), 0, 4000 ),
			'url'     => $site . $path . $post->post_name,
			'image'   => $full,
			'tags'    => is_array( $tags ) ? array_values( array_diff( $tags, array( 'cover' ) ) ) : array(),
		);

		$res = wp_remote_post(
			EDD_SOCIAL_URL,
			array(
				'timeout' => 60,
				'headers' => array(
					'Content-Type'  => 'application/json',
					'Authorization' => 'Bearer ' . EDD_SOCIAL_SECRET,
				),
				'body'    => wp_json_encode( $payload ),
			)
		);

		$result = is_wp_error( $res )
			? wp_json_encode( array( 'ok' => false, 'error' => $res->get_error_message() ) )
			: wp_remote_retrieve_body( $res );
		update_post_meta( $post_id, self::META_RESULT, $result );
	}

	public static function add_box(): void {
		foreach ( array_keys( self::TYPES ) as $type ) {
			add_meta_box( 'edd-social', 'Share on social', array( __CLASS__, 'render_box' ), $type, 'side' );
		}
	}

	public static function render_box( WP_Post $post ): void {
		wp_nonce_field( 'edd_social_box', 'edd_social_nonce' );
		$skip   = (bool) get_post_meta( $post->ID, self::META_SKIP, true );
		$sent   = get_post_meta( $post->ID, self::META_SENT, true );
		$result = json_decode( (string) get_post_meta( $post->ID, self::META_RESULT, true ), true );

		echo '<p><label><input type="checkbox" name="edd_social_share" value="1" ' . checked( ! $skip, true, false ) . ' /> Share on social when published</label></p>';
		echo '<p style="color:#646970">Facebook, Instagram and LinkedIn. Captions are written by AI from this content. Only the first publish is shared.</p>';

		if ( $sent ) {
			echo '<p><strong>Sent:</strong> ' . esc_html( get_date_from_gmt( $sent, 'j M Y, g:ia' ) ) . '</p>';
		}
		if ( is_array( $result ) ) {
			if ( ! empty( $result['dryRun'] ) ) {
				echo '<p><strong>Test mode</strong> — nothing was posted.</p>';
			}
			foreach ( array( 'facebook', 'instagram', 'linkedin' ) as $ch ) {
				if ( isset( $result['results'][ $ch ] ) ) {
					$r = $result['results'][ $ch ];
					echo '<p>' . esc_html( ucfirst( $ch ) ) . ': ' . esc_html( $r['ok'] ? 'posted' : ( $r['skipped'] ?? ( $r['error'] ?? 'failed' ) ) ) . '</p>';
				}
			}
			if ( ! empty( $result['captions']['linkedin'] ) ) {
				echo '<details><summary>Captions</summary>';
				foreach ( $result['captions'] as $ch => $cap ) {
					echo '<p><strong>' . esc_html( ucfirst( $ch ) ) . ':</strong><br>' . nl2br( esc_html( $cap ) ) . '</p>';
				}
				echo '</details>';
			}
			if ( isset( $result['ok'] ) && ! $result['ok'] && ! empty( $result['error'] ) ) {
				echo '<p style="color:#b32d2e">' . esc_html( $result['error'] ) . '</p>';
			}
		}
		if ( 'publish' === $post->post_status ) {
			$url = wp_nonce_url( admin_url( 'admin-post.php?action=edd_social_resend&post=' . $post->ID ), 'edd_social_resend_' . $post->ID );
			echo '<p><a class="button" href="' . esc_url( $url ) . '">Share again now</a></p>';
		}
	}

	public static function save_box( int $post_id ): void {
		if ( ! isset( $_POST['edd_social_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['edd_social_nonce'] ) ), 'edd_social_box' ) ) {
			return;
		}
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}
		if ( empty( $_POST['edd_social_share'] ) ) {
			update_post_meta( $post_id, self::META_SKIP, 1 );
		} else {
			delete_post_meta( $post_id, self::META_SKIP );
		}
	}

	public static function resend(): void {
		$post_id = isset( $_GET['post'] ) ? absint( $_GET['post'] ) : 0;
		check_admin_referer( 'edd_social_resend_' . $post_id );
		if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
			wp_die( 'Not allowed' );
		}
		update_post_meta( $post_id, self::META_SENT, gmdate( 'c' ) );
		self::send( $post_id );
		wp_safe_redirect( get_edit_post_link( $post_id, 'url' ) );
		exit;
	}
}

EDD_Social_Share::init();

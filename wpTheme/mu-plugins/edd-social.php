<?php
/**
 * Plugin Name: EDD Social Share
 * Description: When a blog post or project is published for the first time, sends it to the Every Day Digital website, which writes captions with AI and posts to Facebook, Instagram and LinkedIn. Adds a "Share on social" box to the editor.
 * Version:     1.1.0
 * Author:      Every Day Digital
 *
 * Install: copy this file and edd-common.php to wp-content/mu-plugins/ (must-use
 * plugins load automatically). Then add to wp-config.php, above "That's all,
 * stop editing!":
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

require_once __DIR__ . '/edd-common.php';

final class EDD_Social_Share {

	/** Canonical content types that get shared (see EDD_Common). */
	private const SHARED_TYPES = array( 'post', 'project' );

	private const META_SKIP   = '_edd_social_skip';
	private const META_SENT   = '_edd_social_sent';
	private const META_RESULT = '_edd_social_result';
	private const CRON_HOOK   = 'edd_social_send';

	/** Seconds to wait for the website, which writes captions and posts before replying. */
	private const TIMEOUT = 60;

	public static function init(): void {
		add_action( 'transition_post_status', array( __CLASS__, 'on_transition' ), 20, 3 );
		// One accepted arg, so scheduled sends never force past the "skip" setting.
		add_action( self::CRON_HOOK, array( __CLASS__, 'send' ), 10, 1 );
		add_action( 'add_meta_boxes', array( __CLASS__, 'add_box' ) );
		add_action( 'save_post', array( __CLASS__, 'save_box' ), 10, 1 );
		EDD_Common::on_admin_action( 'edd_social_resend', 'edit_post', array( __CLASS__, 'resend' ) );
	}

	/** The canonical content type of a shared post, or null if it isn't shared. */
	private static function shared_type( WP_Post $post ): ?string {
		$type = EDD_Common::content_type( $post->post_type );
		return in_array( $type, self::SHARED_TYPES, true ) ? $type : null;
	}

	/** Schedules the send the first time a shared item is published. */
	public static function on_transition( string $new_status, string $old_status, WP_Post $post ): void {
		if ( 'publish' !== $new_status || 'publish' === $old_status || null === self::shared_type( $post ) ) {
			return;
		}
		if ( get_post_meta( $post->ID, self::META_SKIP, true ) || get_post_meta( $post->ID, self::META_SENT, true ) ) {
			return;
		}
		update_post_meta( $post->ID, self::META_SENT, gmdate( 'c' ) );
		wp_schedule_single_event( time() + 60, self::CRON_HOOK, array( $post->ID ) );
	}

	/**
	 * Builds the payload, sends it to the website and stores the result on the item.
	 *
	 * @param int  $post_id Item to share.
	 * @param bool $force   Send even if "Share on social" is unticked ("Share again now").
	 */
	public static function send( int $post_id, bool $force = false ): void {
		$post = get_post( $post_id );
		if ( ! $post || 'publish' !== $post->post_status ) {
			return;
		}
		$type = self::shared_type( $post );
		if ( null === $type ) {
			return;
		}
		// Checked again here: the block editor saves the "Share" box a moment
		// after the publish itself, so an unticked box may only land now.
		if ( ! $force && get_post_meta( $post_id, self::META_SKIP, true ) ) {
			delete_post_meta( $post_id, self::META_SENT );
			return;
		}
		if ( ! EDD_Common::configured( 'EDD_SOCIAL_URL', 'EDD_SOCIAL_SECRET' ) ) {
			update_post_meta( $post_id, self::META_RESULT, wp_json_encode( array( 'ok' => false, 'error' => 'EDD_SOCIAL_URL / EDD_SOCIAL_SECRET not set in wp-config.php' ) ) );
			return;
		}

		$site = EDD_Common::configured( 'EDD_SITE_URL' ) ? untrailingslashit( EDD_SITE_URL ) : home_url();
		$text = wp_strip_all_tags( strip_shortcodes( $post->post_content ) );
		$tags = wp_get_post_terms( $post_id, 'post_tag', array( 'fields' => 'names' ) );

		$payload = array(
			'type'    => $type,
			'title'   => html_entity_decode( get_the_title( $post ), ENT_QUOTES ),
			'excerpt' => html_entity_decode( wp_strip_all_tags( get_the_excerpt( $post ) ), ENT_QUOTES ),
			'text'    => mb_substr( preg_replace( '/\s+/', ' ', $text ), 0, 4000 ),
			'url'     => $site . EDD_Common::item_path( $type, $post->post_name ),
			'image'   => (string) get_the_post_thumbnail_url( $post, 'full' ),
			// The "cover" tag only controls image layout on the website; it isn't a topic.
			'tags'    => is_array( $tags ) ? array_values( array_diff( $tags, array( 'cover' ) ) ) : array(),
		);

		$response = EDD_Common::post_json( EDD_SOCIAL_URL, EDD_SOCIAL_SECRET, $payload, self::TIMEOUT );
		$result   = is_wp_error( $response )
			? wp_json_encode( array( 'ok' => false, 'error' => $response->get_error_message() ) )
			: wp_remote_retrieve_body( $response );
		update_post_meta( $post_id, self::META_RESULT, $result );
	}

	public static function add_box(): void {
		add_meta_box( 'edd-social', 'Share on social', array( __CLASS__, 'render_box' ), EDD_Common::post_types( self::SHARED_TYPES ), 'side' );
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
			echo '<p><a class="button" href="' . esc_url( EDD_Common::admin_action_url( 'edd_social_resend', $post->ID ) ) . '">Share again now</a></p>';
		}
	}

	/** Saves the "Share on social when published" checkbox. */
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

	/**
	 * "Share again now": sends straight away, even if sharing was unticked.
	 *
	 * @return string|null The editor URL to return to.
	 */
	public static function resend( int $post_id ): ?string {
		update_post_meta( $post_id, self::META_SENT, gmdate( 'c' ) );
		self::send( $post_id, true );
		return get_edit_post_link( $post_id, 'url' );
	}
}

EDD_Social_Share::init();

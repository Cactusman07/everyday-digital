<?php
/**
 * Every Day Digital theme.
 *
 * The theme is headless: Next.js renders the public site from WPGraphQL, so
 * this file only defines the content model (custom post types) and an admin
 * notice. Nothing is enqueued on the front end, and index.php is empty.
 *
 * @package everyday-digital
 */

defined( 'ABSPATH' ) || exit;

add_action( 'after_setup_theme', 'edd_setup_theme' );
add_action( 'init', 'edd_register_post_types', 0 );
add_action( 'admin_notices', 'edd_wpgraphql_missing_notice' );

/*
 * Rebuild rewrite rules once on activation so the custom post types' URLs
 * resolve. after_switch_theme fires on 'init' at priority 99, after the post
 * types are registered. Zero accepted args, so flush_rewrite_rules() doesn't
 * receive the old theme's name and keeps its default hard flush.
 */
add_action( 'after_switch_theme', 'flush_rewrite_rules', 10, 0 );

/** Enables featured images and menus, both used by the Next.js front end. */
function edd_setup_theme(): void {
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'menus' );
}

/**
 * The custom post types, keyed by the name passed to register_post_type().
 *
 * Don't rename the keys or GraphQL names. WordPress stores the key on every
 * item, lowercased by sanitize_key() (so 'Projects' is stored as 'projects'),
 * and the Next.js GraphQL queries use the GraphQL names. 'slug' is used as
 * both the rewrite slug and the REST base. Admin labels are built from
 * 'singular' and 'plural' by edd_post_type_labels().
 *
 * @return array<string, array{slug: string, menu_icon: string, graphql_single_name: string, graphql_plural_name: string, singular: string, plural: string}>
 */
function edd_post_types(): array {
	return array(
		'Projects'     => array(
			'slug'                => 'projects',
			'menu_icon'           => 'dashicons-star-filled',
			'graphql_single_name' => 'project',
			'graphql_plural_name' => 'projects',
			'singular'            => __( 'Project', 'everyday-digital' ),
			'plural'              => __( 'Projects', 'everyday-digital' ),
		),
		'Team'         => array(
			'slug'                => 'team',
			'menu_icon'           => 'dashicons-admin-users',
			'graphql_single_name' => 'team',
			'graphql_plural_name' => 'teams',
			'singular'            => __( 'Team Member', 'everyday-digital' ),
			'plural'              => __( 'Team', 'everyday-digital' ),
		),
		'Services'     => array(
			'slug'                => 'services',
			'menu_icon'           => 'dashicons-superhero',
			'graphql_single_name' => 'service',
			'graphql_plural_name' => 'services',
			'singular'            => __( 'Service', 'everyday-digital' ),
			'plural'              => __( 'Services', 'everyday-digital' ),
		),
		'Testimonials' => array(
			'slug'                => 'testimonials',
			'menu_icon'           => 'dashicons-editor-quote',
			'graphql_single_name' => 'testimonial',
			'graphql_plural_name' => 'testimonials',
			'singular'            => __( 'Testimonial', 'everyday-digital' ),
			'plural'              => __( 'Testimonials', 'everyday-digital' ),
		),
	);
}

/**
 * Admin labels for a post type, e.g. "Add New Project" and "All Projects".
 *
 * @param string $singular One item, e.g. "Project".
 * @param string $plural   Several items, e.g. "Projects".
 * @return array<string, string>
 */
function edd_post_type_labels( string $singular, string $plural ): array {
	return array(
		'name'               => $plural,
		'singular_name'      => $singular,
		'menu_name'          => $plural,
		/* translators: %s: post type plural name. */
		'all_items'          => sprintf( __( 'All %s', 'everyday-digital' ), $plural ),
		/* translators: %s: post type singular name. */
		'view_item'          => sprintf( __( 'View %s', 'everyday-digital' ), $singular ),
		/* translators: %s: post type singular name. */
		'add_new_item'       => sprintf( __( 'Add New %s', 'everyday-digital' ), $singular ),
		/* translators: %s: post type singular name. */
		'add_new'            => sprintf( __( 'Add %s', 'everyday-digital' ), $singular ),
		/* translators: %s: post type singular name. */
		'edit_item'          => sprintf( __( 'Edit %s', 'everyday-digital' ), $singular ),
		/* translators: %s: post type singular name. */
		'update_item'        => sprintf( __( 'Update %s', 'everyday-digital' ), $singular ),
		/* translators: %s: post type plural name. */
		'search_items'       => sprintf( __( 'Search %s', 'everyday-digital' ), $plural ),
		'not_found'          => __( 'Not found', 'everyday-digital' ),
		'not_found_in_trash' => __( 'Not found in Trash', 'everyday-digital' ),
	);
}

/** Registers the custom post types from edd_post_types() with the settings they all share. */
function edd_register_post_types(): void {
	foreach ( edd_post_types() as $post_type => $type ) {
		register_post_type(
			$post_type,
			array(
				'label'                 => $type['plural'],
				'labels'                => edd_post_type_labels( $type['singular'], $type['plural'] ),
				'supports'              => array( 'title', 'editor', 'thumbnail', 'excerpt', 'comments' ),
				'hierarchical'          => true,
				'public'                => true,
				'publicly_queryable'    => true,
				'query_var'             => true,
				'rewrite'               => array(
					'slug'       => $type['slug'],
					'with_front' => false,
				),
				'show_in_rest'          => true,
				'rest_base'             => $type['slug'],
				'rest_controller_class' => 'WP_REST_Posts_Controller',
				'show_ui'               => true,
				'show_in_menu'          => true,
				'show_in_nav_menus'     => true,
				'show_in_admin_bar'     => true,
				'menu_position'         => 5,
				'can_export'            => true,
				'has_archive'           => false,
				'exclude_from_search'   => false,
				'capability_type'       => 'page',
				'menu_icon'             => $type['menu_icon'],
				'show_in_graphql'       => true,
				'graphql_single_name'   => $type['graphql_single_name'],
				'graphql_plural_name'   => $type['graphql_plural_name'],
			)
		);
	}
}

/** Warns administrators when WPGraphQL isn't active: the Next.js front end gets all its content through it. */
function edd_wpgraphql_missing_notice(): void {
	if ( class_exists( 'WPGraphQL' ) || ! current_user_can( 'activate_plugins' ) ) {
		return;
	}
	printf(
		'<div class="notice notice-error"><p><strong>%s <a href="%s" target="_blank" rel="noopener noreferrer">%s</a></strong></p></div>',
		esc_html__( 'This theme requires the WPGraphQL plugin.', 'everyday-digital' ),
		esc_url( 'https://www.wpgraphql.com/' ),
		esc_html__( 'Download it here.', 'everyday-digital' )
	);
}

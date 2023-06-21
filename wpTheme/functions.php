<?php 
  function theme_enqueue_scripts()
  {

    $version = '1.1.0';

    wp_enqueue_script('theme-script', get_stylesheet_directory_uri() . '/dist/main.js', array('jquery'), $version, true );
    wp_enqueue_style('theme-style', get_stylesheet_directory_uri() . '/dist/main.css', array(), $version);

    $config = array(
      // Add theme variables later that are needed in react
    );

    wp_localize_script('theme', 'wp_config', $config);
  }
  add_action('admin_notices', 'showAdminMessages');

  function showAdminMessages() {
    $plugin_messages = array();

    include_once( ABSPATH . 'wp-admin/includes/plugin.php' );

    // WPGraphQL Plugin
    if(!is_plugin_active( 'wp-graphql/wp-graphql.php' ))	{
      $plugin_messages[] = 'This theme requires you to install the WPGraphQL plugin, <a href="https://www.wpgraphql.com/" target="_blank">download it from here</a>.';
    }

    if(count($plugin_messages) > 0)	{
      echo '<div id="message" class="error">';

        foreach($plugin_messages as $message) {
          echo '<p><strong>'.$message.'</strong></p>';
        }

      echo '</div>';
    }
  }
  add_action('wp_enqueue_scripts', 'theme_enqueue_scripts');

  add_theme_support( 'post-thumbnails' );
  add_theme_support( 'menus' );

  /* Add custom post type 'Projects' to Theme */
  function create_postTypeProjects() {
  
    $labels = array(
      'name'					      => _x( 'Project', 'Post Type General Name', "Every Day Digital"),
      'singular name'			  => _x( 'Project', 'Singular Name', "Every Day Digital"),
      'menu_name'				    => __( 'Projects', "Every Day Digital"),
      'all_items'         	=> __( 'All Projects', "Every Day Digital" ),
      'view_item'         	=> __( 'View Projects', "Every Day Digital" ),
      'add_new_item'      	=> __( 'Add New Project', "Every Day Digital" ),
      'add_new'           	=> __( 'Add Project', "Every Day Digital" ),
      'edit_item'         	=> __( 'Edit Project', "Every Day Digital" ),
      'update_item'       	=> __( 'Update Projects', "Every Day Digital" ),
      'search_items'      	=> __( 'Search for Project', "Every Day Digital" ),
      'not_found'         	=> __( 'Not Found', "Every Day Digital" ),
      'not_found_in_trash'	=> __( 'Not found in Trash', "Every Day Digital" ),
    );
    
    $args = array(
      'label'				        => __('Projects', "Every Day Digital"),
      'description'		      => __('A list of Projects.', "Every Day Digital"),
      'labels'			        => $labels,
      'supports'			      => array( 'title', 'editor', 'thumbnail', 'excerpt', 'comments' ),
      'hierarchical' 		    => true,
      'public'			        => true,
      'publicly_queryable'  => true,
      'query_var'           => true,
      'show_in_rest'        => true,
      'rest_base'           => 'projects',
      'rest_controller_class' => 'WP_REST_Posts_Controller',
      'show_ui'			        => true,
      'show_in_menu'        => true,
      'show_in_nav_menus'   => true,
      'show_in_admin_bar'   => true,
      'menu_position'       => 5,
      'can_export'          => true,
      'has_archive'         => false,
      'exclude_from_search' => false,
      'publicly_queryable'  => true,
      'capability_type'     => 'page',
      'menu_icon'           => 'dashicons-star-filled',
      'show_in_graphql'     => true,
      'graphql_single_name' => 'project',
      'graphql_plural_name' => 'projects',
    );
    register_post_type('Projects', $args );
  }
  add_action('init', 'create_postTypeProjects', 0 );

?>
<?php
/**
 * Template Name: Front Page Template
 *
 * Description: A template for the front-page of your website
 * for this theme. 
 *
 */
?>
<?php 
  $TEMPLATE_PATH = get_template_directory_uri(  );
  $TEMPLATE_PATH = parse_url($TEMPLATE_PATH, PHP_URL_PATH);
?>
<!DOCTYPE html>
<html lang='<?php language_attributes(); ?>'>
  <head>
    <meta http-equiv='content-type' content='text/html;charset=utf-8' charset='utf-8'/>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <title><?php wp_title('|', true, 'right'); ?></title>
    
    <?php wp_head(); ?>
  </head>
  
  <body <?php body_class(); ?>>
    <div id="background1" class="fullpage"> </div>
    <div id="background2" class="fullpage"> </div>
    <div id="background3" class="fullpage"> </div>
    <div id="background4" class="fullpage"> </div>
    <div id="background5" class="fullpage"> </div>
    <div id="background6" class="fullpage"> </div>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <h1 class="hidden"><?php the_title(); ?></h1>
    
    <div id="root"></div>
    
    <?php wp_footer(); ?>
    <script async src="<?php echo $TEMPLATE_PATH; ?>/scripts/animation.js"></script>
  </body>
</html>

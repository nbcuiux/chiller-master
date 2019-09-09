<?php

	if (isset($_GET['s'])) {
		$response = array(
            'status' => "OK",
            'data' => search(),
            'term' => $_GET['s']
        );
        echo json_encode($response);
        die();
	}


	$context = Timber::get_context();
  	$args = array(
        'post_type' => 'post',
        'posts_per_page' => -1
    );

    $context['categories'] = Timber::get_terms('category');
    $context['posts'] = Timber::get_posts($args);


    //var_dump($context['posts']);

	Timber::render('page.html', $context);
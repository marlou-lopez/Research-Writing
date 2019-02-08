<?php
   require_once 'core/init.php';
   include 'templates/header.php';

   $post = new Post();
   $results = $post->get_posts();
   //echo $result[0]->title;
   if(Session::exists('post')){
      echo Session::flash('post');
   }
   echo '<div class="container">';
   foreach($results as $result){
   //$tags = json_decode($result->tags,true);
   //$body_sum = preg_replace('/((\w+\W*){'.(20).'}(\w+))(.*)/', '${1}', $result->body);
   $body_sum = limit($result->body);
   echo '<div class="card">';
   echo '<div class="card-body">';
   echo '<h3 class = "card-title">'.$result->title.'</h3>';
   echo '<h6 class = "card-subtitle mb-2 text-muted">Posted on: '.$result->created_at.' by '.$result->username.'</h6>';
   echo '<h6 class = "card-subtitle mb-2"> Tags: </h6>'; 
   if(!empty($result->tags)){
      foreach(json_decode($result->tags,true) as $tags){ 
         echo '<button type="button" class = "btn btn-success btn-sm">'.$tags.'</button>'; 
      }
   }
   echo '<p>'.$body_sum.' ...</p><a href="view_post.php?id='.$result->id.'">Read More</a>';
   //echo '<a href="view_post.php?postId='.$row['post_id'].'" class = "btn btn-primary">Read More</a>';
   echo '</div>';
   echo '</div>';
   }
   echo '</div>';

   include 'templates/footer.php';
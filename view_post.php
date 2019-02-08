<?php
   require_once 'core/init.php';
   include 'templates/header.php';


   $post = new Post(Input::get('id'));
   //echo '<pre>', print_r($post->data()), '</pre>';
   if(!$post->exists()){
      Redirect::to(404);
   }else{
      $data = $post->data();
   }
?>
<div class="container">
   <div class="jumbotron">
      <h1 class="display-3"><?php echo $data->title; ?></h1>
      <p class="lead">Posted on: <?php echo $data->created_at. ' by '.$data->username; ?></p>
      <p class="lead">Tags: </p> <?php if(!empty($data->tags)){
         foreach(json_decode($data->tags,true) as $tags){ echo '<button type="button" class = "btn btn-success btn-sm">'.$tags.'</button>';}
         } ?>
      <hr class="my-4">
      <p><?php echo $data->body; ?></p>
      <?php if($user->isLoggedIn() && ($user->data()->id == $data->user_id) ): ?>
         <a href="edit_post.php?id=<?php echo $data->id; ?>" class="btn btn-warning">Edit Post</a>
         <a href="delete_post.php?id=<?php echo $data->id; ?>" class="btn btn-danger">Delete Post</a>
      <?php endif; ?>
   </div>
</div>


<?php
   include 'templates/footer.php';
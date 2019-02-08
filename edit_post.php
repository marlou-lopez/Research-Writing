<?php
   require_once 'core/init.php';
   include 'templates/header.php';
   $post = new Post(Input::get('id'));
   if(!$user->isLoggedIn() || ($post->data()->user_id !== $user->data()->id)){
      Redirect::to('view_post_list.php');
   }

   if(Input::exists()){
      if(Token::check(Input::get('token'))){

         try{
            $post->edit(array(
               'title' => Input::get('title'),
               'body' => Input::get('body')
            ),Input::get('id'));
            Redirect::to('view_post.php?id='.Input::get('id'));
         }catch(Exception $e){
            die($e->getMessage());
         }

      }
   }

?>

<div class="container">
<div class="row">
   <div class="col-md-1"></div>
   <div class="col-md-10">
      <div class="jumbotron">
         <h1 class="display-5">Create a post</h1>
         <hr class="my-3">
         <form action="" method="post">
            <div class="form-group">
               <label for="title">Title:</label>
               <input type="text" class="form-control" name="title" id="title" value="<?php echo escape($post->data()->title); ?>" required>
            </div>
            <div class="form-group">
               <label for="body">Body:</label>
               <textarea name="body" class="form-control" id="body" cols="30" rows="10" required><?php echo escape($post->data()->body); ?></textarea>
            </div>
            <input type="hidden" name="token" value="<?php echo Token::generate(); ?>">
            <input type="submit" class="btn btn-primary" value="Submit">
         </form>
      </div>
   </div>
   <div class="col-md-1"></div>
</div>
</div>





<?php
   include 'templates/footer.php';
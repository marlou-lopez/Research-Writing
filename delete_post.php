<?php
   require_once 'core/init.php';
   include 'templates/header.php';
   $post = new Post(Input::get('id'));
   if(!$user->isLoggedIn() || ($post->data()->user_id !== $user->data()->id)){
      Redirect::to('view_post_list.php');
   }
   if(Input::exists()){
      try{
         $post->delete(Input::get('id'));
         Session::flash('post','<div class="alert alert-danger alert-dismissible fade show" role="alert">
         Your post has been deleted! <button type="button" class="close" data-dismiss="alert" aria-label="Close">
         <span aria-hidden="true">&times;</span>
       </button></div>');
         Redirect::to('view_post_list.php');
      }catch(Exception $e){
         die($e->getMessage());
      }
   }
?>
<div class="container">  
   <div class="sticky-top alert alert-dismissible alert-danger">
      <h4 class="alert-heading">Delete Post?</h4>
      <p class="mb-0">Are you sure you want to delete this posts?</p>
      <hr>
      <form action="" method="post">
         <div class="form-group">
            <input type="submit" name="deleteBtn" class="btn btn-primary" value="Yes">
            <a href="view_post.php?id=<?php echo Input::get('id');?>" class="btn">No</a>
         </div>
      </form>
   </div>
</div>

<?php
   include 'templates/footer.php';
<?php
   require_once 'core/init.php';
   include 'templates/header.php';

   $data = $user->data();
   $post = new Post();
   $keywords = array();
   
   /* * * * * * * * * * * * * *
   *       PROBLEM THREE      *
   * * * * * * * * * * * * * */
    // Get document not in the same class
   foreach($post->get_not_category_posts(Input::get('category')) as $pd){ 
      array_push($keywords,$pd->keywords);
   }
   $postData = '[{}]';
   if(!empty($keywords)){
      $postData = '['.implode(", ",$keywords).']';
   }
   if(Input::exists()){
      if(Token::check(Input::get('token'))){
         try{
            $tags = json_encode(Input::get('tags'));
            $post->create_post(array(
               'user_id' => $data->id,
               'title' => Input::get('title'),
               'body' => Input::get('body'),
               'created_at' => date('Y-m-d H:i:s'),
               'tags' => $tags,
               'category' => Input::get('category'),
               'keywords' => Input::get('keywords')
            ));
            Session::flash('post',
            '<div class="alert alert-success alert-dismissible fade show" role="alert">
            Your post has been created! <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button></div>');
            Redirect::to('view_post_list.php');
         } catch(Exception $e){
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
               <input type="text" class="form-control" name="title" id="title" required>
            </div>
            <div class="form-group">
               <label for="body">Body:</label>
               <textarea name="body" class="form-control" id="body" cols="30" rows="10" required></textarea>
            </div>
            
            <button type="button" class="btn btn-primary" id="keywordBtn">Button</button>
            <div class="modal" id="keywordModal">
               <div class="modal-dialog" role="document">
                  <div class="modal-content">
                     <div class="modal-header">
                        <h5 class="modal-title">Select Tags:</h5>
                     </div>
                     <div class="modal-body">
                        <p>Tags</p>
                        <div class="btn-group-toggle" data-toggle="buttons" id="keywordBody">

                        </div>
                     </div>
                     <div class="modal-footer">
                        <input type="hidden" name="token" value="<?php echo Token::generate(); ?>">
                        <input type="submit" class="btn btn-success" value="Create Post" >
                        <button type="button" class="btn btn-secondary" id="keywordCloseBtn" data-dismiss="modal">Close</button>
                     </div>
                  </div>
               </div>
            </div>
            <input type="hidden" name="category" value = <?php echo Input::get('category');?>>
            <input type="hidden" name="keywords" id = "keywords" value = "{}">
         </form>
      </div>
   </div>
   <div class="col-md-1"></div>
</div>
</div>

<script src="./js/s_nouns.js" type="module"></script>
<script>
   let allPosts = JSON.parse(<?php echo json_encode($postData); ?>);
</script>
<script src="./js/tfidf.js" type="module"></script>
<?php
   include 'templates/footer.php';
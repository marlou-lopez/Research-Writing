<?php
   require_once 'core/init.php';
   include 'templates/header.php';
   $categories = new Categories();
   $category = $categories->get_categories();
?>

<div class="container">
   <div class="jumbotron">
      <form action="create_post.php" method="post">
         <h1>Select a Category</h1>
            <select name="category" id="category" class="form-control">
               <?php
                  foreach($category as $val){
                     echo '<option value = "'.$val->category_id.'">'.$val->name.'</option>';
                  }
               ?>
            </select>
            <hr>
            <input type="submit" value="Submit" class="btn btn-primary btn-block">
      </form>
   </div>
</div>

<?php
   include 'templates/footer.php';
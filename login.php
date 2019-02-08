<?php
   require_once 'core/init.php';
   include 'templates/header.php';
   if(Input::exists()){
      if(Token::check(Input::get('token'))){
         $remember = (Input::get('remember') === 'on') ? true : false;
         $login = $user->login(Input::get('username'), Input::get('password'), $remember);
            if($login){
               Redirect::to('view_post_list.php');
            }else{
               echo '<div class="sticky-top alert alert-dismissible alert-danger">';
               echo '<p class="mb-0">Invalid Username or Password!</p>';
               echo '</div>';
            }
      }
   }
?>

<div class="container">
   <div class="row">
      <div class="col-lg-4"></div>
      <div class="col-lg-4">
         <div class="jumbotron">
            <h1 align ="center">Log in</h1>
            <form action="" method="post">
               <div class="form-group">
                  <label for="username">Username:</label>
                  <input type="text" class="form-control" name="username" id="username" autocomplete="off" required>
               </div>
               <div class="form-group">
                  <label for="password">Password:</label>
                  <input type="password" class="form-control" name="password" id="password" autocomplete="off" required>
               </div>
               <div class="form-group">
                  <label for="remember">
                     <input type="checkbox"  name="remember" id="remember"> Remember me
                  </label>
               </div>

               <input type="hidden" name="token" value ="<?php echo Token::generate(); ?>">
               <input type="submit" class="form-control btn btn-primary" value="Log in">
            </form>
         </div>
      </div>
      <div class="col-lg-4"></div>
   </div>
</div>
<?php 
   include 'templates/footer.php';
?>

<?php
   require_once 'core/init.php';
   include 'templates/header.php';

   if(Session::exists('profile')){
      echo Session::flash('profile');
   }
   if(!$username = Input::get('user')){
      Redirect::to('index.php');
   }else{
      $user = new User($username);
      if(!$user->exists()){
         Redirect::to(404);
      }else{
         $data = $user->data();

      }
      ?>
   <div class="container">
      <div class="row">
         <div class="col-md-3"></div>
         <div class="col-md-6">
            <div class="jumbotron">
               <h3><?php echo escape($data->username); ?></h3>
               <p>Full name : <?php echo escape($data->name); ?></p>
               <a href="http:update.php">Update Profile</a>
               <a href="http:changepassword.php">Change Password</a>
            </div>
         </div>
         <div class="col-md-3"></div>
      </div>
   </div>
      <?php
   }

   include 'templates/footer.php';
<?php
   require_once 'core/init.php';
   include 'templates/header.php';
   $user = new User();

   if(!$user->isLoggedIn()){
      Redirect::to('index.php');
   }

   if(Input::exists()){
      if(Token::check(Input::get('token'))){
         $validate = new Validate();
         $validation = $validate->check($_POST, array(
            'password_new_again' => array(
               'matches' => 'password_new'
            )
         ));

         if($validation->passed()){
            
            if(Hash::make(Input::get('password_current'), $user->data()->salt) !== $user->data()->password){
               echo '<div class="sticky-top alert alert-dismissible alert-danger">';
               echo '<p class="mb-0">Your current password is wrong!</p>';
               echo '</div>';
            }else{
               $salt = Hash::salt(16);
               $user->update(array(
                  'password' => Hash::make(Input::get('password_new'), $salt),
                  'salt' => $salt
               ));

               Session::flash('profile', '<div class="alert alert-success" role="alert">Your password has been changed successfully!</div>');
               Redirect::to('profile.php?user='.$user->data()->username);
            }

         }else{
            echo '<div class="sticky-top alert alert-dismissible alert-danger">';
            foreach($validation->errors() as $error){
               echo '<p class="mb-0">'.$error.'</p>';
            }
            echo '</div>';
         }
      }
   }
?>
<div class="row">
   <div class="col-lg-4"></div>
   <div class="col-lg-4">
      <div class="jumbotron">
         <form action="" method="post">
            <div class="form-group">
               <label for="password_current">Current Password:</label>
               <input type="password" class="form-control" name="password_current" id="password_current" minlength="6" required>
            </div>
            <div class="form-group">
               <label for="password_new">New Password:</label>
               <input type="password" class="form-control" name="password_new" id="password_new" minlength="6" required>
            </div>
            <div class="form-group">
               <label for="password_new_again">Confirm New Password:</label>
               <input type="password" class="form-control" name="password_new_again" id="password_new_again" minlength="6" required>
            </div>

            <input type="hidden" name="token" value="<?php echo Token::generate(); ?>">
            <input type="submit" class="form-control btn btn-primary" value="Change">
         </form>
      </div>
   </div>
   <div class="col-lg-4"></div>
</div>

<?php
   include 'templates/footer.php';
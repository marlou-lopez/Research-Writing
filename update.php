<?php
   require_once 'core/init.php';
   include 'templates/header.php';

   if(!$user->isLoggedIn()){
      Redirect::to('index.php');
   }

   if(Input::exists()){
      if(Token::check(Input::get('token'))){
         // $validate = new Validate();
         // $validation = $validate->check($_POST, array(
         //    'name' => array(
         //       'required' => true,
         //       'min' => 2,
         //       'max' => 50
         //    )
         // ));

         // if($validation->passed()){
         //    try{
         //       $user->update(array(
         //          'name' => Input::get('name')
         //       ));

         //       Session::flash('home', 'Your details have been updated');
         //       Redirect::to('index.php');
         //    }catch(Exception $e){
         //       die($e->getMessage());
         //    }
         // }else{
         //    foreach($validation->errors() as $error){
         //       echo $error, '<br>';
         //    }
         // }
         try{
            $user->update(array(
               'name' => Input::get('name')
            ));
            Session::flash('profile', '<div class="alert alert-success" role="alert">You have successfully update your profile!</div>');
            Redirect::to('profile.php?user='.$user->data()->username);
         }catch(Exception $e){
            die($e->getMessage());
         }
      }
   }

?>

<div class="container">
<div class="row">
   <div class="col-lg-4"></div>
   <div class="col-lg-4">
      <div class="jumbotron">
         <form action="" method="post">
            <div class="form-group">
               <label for="name">Name</label>
               <input type="text" class="form-control" name="name" id="name" value = "<?php echo escape($user->data()->name); ?>" minlength="2" maxlength="50" required>
            </div>
            <input type="submit" value="Update" class="form-control btn btn-primary">
            <input type="hidden" name="token" value ="<?php echo Token::generate(); ?>">
         </form>
      </div>
   </div>
   <div class="col-lg-4"></div>
</div>
</div>

<?php 
   include 'templates/footer.php';
?>
<?php $user = new User(); ?>
<!DOCTYPE html>
<html lang="en">

<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <meta http-equiv="X-UA-Compatible" content="ie=edge">
   <title>Research Writing</title>
   <!-- <link href="https://stackpath.bootstrapcdn.com/bootswatch/4.1.3/lumen/bootstrap.min.css" rel="stylesheet" integrity="sha384-DfbCiBdRiiNWvRTbHe5X9IfkezKzm0pCrZSKc7EM9mmSl/OyckwbYk3GrajL8Ngy"
      crossorigin="anonymous"> -->
   <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootswatch/4.1.3/darkly/bootstrap.min.css">
   <link rel="stylesheet" href="./assets/style.css">
   <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
      crossorigin="anonymous"></script>
   <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy"
      crossorigin="anonymous"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.17.0/jquery.validate.min.js"></script>
</head>

<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
   <a class="navbar-brand" href="#">Research Writing II</a>
   <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01"
      aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
   </button>

   <div class="collapse navbar-collapse" id="navbarColor01">
      <ul class="navbar-nav mr-auto">
         <li class="nav-item">
            <a class="nav-link" href="index.php">Home</a>
         </li>
         <li class="nav-item">
            <a class="nav-link" href="view_post_list.php">Blogposts</a>
         </li>
         <li class="nav-item">
            <a class="nav-link" href="#">About</a>
         </li>
         <?php if($user->isLoggedIn()) : ?>
         <li class="nav-item">
            <a class="nav-link" href="profile.php?user=<?php echo escape($user->data()->username); ?>">Welcome, <?php echo escape($user->data()->username); ?> </a>
         </li>
         <?php endif; ?>
      </ul>
      <?php if(!$user->isLoggedIn()) : ?>
      <a href="http:login.php" class="btn btn-light">Login</a>
      <a href="http:register.php" class="btn btn-primary">Register</a>
      <?php endif; ?>
      <?php if($user->isLoggedIn()) : ?>
      <a href="http:select_category.php" class="btn btn-success">Create Post</a>
      <a href="http:logout.php" class="btn btn-danger">Logout</a>
      <?php endif; ?>
   </div>
</nav>

<body>


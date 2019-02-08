<?php

   class Post{
      private  $_db,
               $_data;

      public function __construct($post = null){
         $this->_db = DB::getInstance();
         $this->find($post);
      }

      public function create_post($fields = array()){
         if($this->_db->insert('posts', $fields)){
            throw new Exception('There was a problem creating a post');
         }
      }

      public function get_posts(){
         $data = $this->_db->query('SELECT posts.id, posts.title, posts.body, posts.tags, posts.category ,posts.keywords, posts.created_at, users.username FROM `posts` INNER JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC');
         return $data->results();
      }

      public function get_not_category_posts($category){
         $data = $this->_db->query('SELECT posts.keywords FROM `posts` WHERE NOT posts.category = '.$category);
         return $data->results();
      }

      public function find($post = null){
         if($post){
            $data = $this->_db->query('SELECT posts.id, posts.title, posts.body, posts.tags, posts.created_at, posts.user_id ,users.username FROM `posts` INNER JOIN users ON posts.user_id = users.id WHERE posts.id = '.$post);
            if($data->count()){
               $this->_data = $data->first();
               return true;
            }
         }
         return false;
      }

      public function edit($fields = array(), $post){
         if(!$this->_db->update('posts', $post, $fields)){
            throw new Exception('There was a problem on editing your post');
         }
      }

      public function delete($post){
         if(!$this->_db->delete('posts', array('id', '=', $post))){
            throw new Exception('There was a problem deleting the post');
         }
      }

      public function data(){
         return $this->_data;
      }

      public function exists(){
         return (!empty($this->_data)) ? true : false;
      }
      
   }
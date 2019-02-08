<?php

   class Categories {
      private $_db,$_data;

      public function __construct(){
         $this->_db = DB::getInstance();
      }

      public function get_categories(){
         $data = $this->_db->query('SELECT * FROM `categories`');
         return $data->results();
      }

      public function data(){
         return $this->_data;
      }

   }
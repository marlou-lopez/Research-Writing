<?php
   function limit($string){
      $string = strip_tags($string);
      if (strlen($string) > 500) {
         // truncate string
         $stringCut = substr($string, 0, 500);
         $endPoint = strrpos($stringCut, ' ');

         //if the string doesn't contain any space then it will cut without word basis.
         $string = $endPoint? substr($stringCut, 0, $endPoint) : substr($stringCut, 0);

      }
      return $string;
   }
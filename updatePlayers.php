<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$json = $_POST['data'];

/* sanity check */
if (json_decode($json) != null)
{
  $file = fopen('p1.json','w+');
  fwrite($file, $json);
  fclose($file);
}
else
{
  // user has posted invalid JSON, handle the error 
}


?>
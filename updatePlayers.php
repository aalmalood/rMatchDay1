<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

/* sanity check */
if (json_decode($json) != null)
{
  $file = fopen('p1.json','w+');
  fwrite($file, $request->players);
  fclose($file);
}
else
{
  // user has posted invalid JSON, handle the error 
}


?>
<HTML>
  <body>
    <h1>hello</h1>
</body>
</HTML>
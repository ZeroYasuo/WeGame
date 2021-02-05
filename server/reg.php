<?php


$username = $_POST['username'];
$password = $_POST['password'];
$nickname = $_POST['nickname'];

$link = mysqli_connect('127.0.0.1','root','root','bk2004');
$sql="INSERT INTO `users` VALUE (null,'$username','$password',null)";
// $sql = "insert into users (username,password,nickname) values ('$username','$password','$nickname')";
$res = mysqli_query($link, $sql);
// $query = $connect->query($sql);

echo json_encode(array(
  "message"=>"注册成功",
  "code" => $res
))
?>
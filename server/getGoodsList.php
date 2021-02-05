<?php

  // 1. 接受前端传递来的参数
  $one = $_GET['cat_one'];
  $method = $_GET['sort_method'];
  $type = $_GET['sort_type'];
  $current = $_GET['current'];
  $pagesize = $_GET['pagesize'];

  // 2. 组装 sql 语句
  $sql = "SELECT * FROM `goods`";
  // 添加筛选条件
  if ($one != 'all') $sql .= " WHERE `cat_one_id`='$one'";
  // 确定排序方式
  if ($method == '综合') $sql .= " ORDER BY `goods_id` $type";
  // 确定拿哪一条数据
  /*
    确定好了 一页 12 条 $pagesize
    第一页   0     12
    第二页   12    12
    第三页   24    12
  */
  $start = ($current - 1) * $pagesize;
  $sql .= " LIMIT $start, $pagesize";

  // 3. 操作数据库进行查询
  $link = mysqli_connect('localhost', 'root', 'root', 'bk2004');
  $res = mysqli_query($link, $sql);
  $data = mysqli_fetch_all($res, MYSQLI_ASSOC);

  // 4. 把结果返回给前端
  echo json_encode(array(
    "message" => "获取商品列表成功",
    "current" => $current,
    "code" => 1,
    "list" => $data,
    "sql" => $sql
  ));

?>

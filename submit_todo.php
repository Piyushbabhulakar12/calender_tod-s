<?php
header("Access-Control-Allow-Origin: *");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "todo";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn) {
    echo "Connected";
}

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$title = $_POST['todoTitle'];
$start_date = $_POST['todoStartDate'];
$end_date = $_POST['todoEndDate'];
$description = $_POST['todoDescription'];
$status = $_POST['todoStatus'];
$priority = $_POST['todoPriority'];
$category = $_POST['todoCategory'];
$comment = $_POST['todoComment'];
$color = $_POST['todoColor'];


$stmt = $conn->prepare("INSERT INTO todos (title, start_date, end_date, description, status, priority, category, comment, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssssss", $title, $start_date, $end_date, $description, $status, $priority, $category, $comment, $color);

if ($stmt->execute()) {
  
    $todo_id = $conn->insert_id;


    if (isset($_POST['subChecklist']) && is_array($_POST['subChecklist'])) {
      
        $stmtSub = $conn->prepare("INSERT INTO sub_checklist (todo_id, item) VALUES (?, ?)");
        $stmtSub->bind_param("is", $todo_id, $subItem);

        foreach ($_POST['subChecklist'] as $subItem) {
            $stmtSub->execute();
        }

        $stmtSub->close();
    }

    echo "Todo added successfully";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>

<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "todo";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT todos.*, sub_checklist.id AS sub_id, sub_checklist.item AS sub_item
        FROM todos
        LEFT JOIN sub_checklist ON todos.id = sub_checklist.todo_id";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $todos = array();
    while($row = $result->fetch_assoc()) {
        $todo_id = $row['id'];

        if (!isset($todos[$todo_id])) {
           
            $todos[$todo_id] = array(
                'id' => $row['id'],
                'title' => $row['title'],
                'start_date' => $row['start_date'],
                'end_date' => $row['end_date'],
                'description' => $row['description'],
                'status' => $row['status'],
                'priority' => $row['priority'],
                'category' => $row['category'],
                'comment' => $row['comment'],
                'color' => $row['color'],
                'sub_checklist_items' => array()
            );
        }

      
        if (!empty($row['sub_id'])) {
           
            $sub_checklist_item = array(
                'id' => $row['sub_id'],
                'item' => $row['sub_item']
            );
            $todos[$todo_id]['sub_checklist_items'][] = $sub_checklist_item;
        }
    }
    
  
    $todos = array_values($todos);

    echo json_encode($todos);
} else {
    echo json_encode(array('message' => 'No todos found'));
}

$conn->close();
?>

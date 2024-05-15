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

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("INSERT INTO holidays (holidayName, startDate, endDate, leaveType) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $data['holidayName'], $data['startDate'], $data['endDate'], $data['leaveType']);

if ($stmt->execute()) {
    echo json_encode(array("message" => "Leave added successfully"));
} else {
    echo json_encode(array("error" => "Failed to add leave: " . $conn->error));
}

$stmt->close();
$conn->close();
?>

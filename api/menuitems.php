<?php
// api/menuitems.php
header('Content-Type: application/json; charset=utf-8');
// If you call from frontend on a different port/origin, uncomment CORS:
// header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
// header('Access-Control-Allow-Headers: Content-Type');

$mysqli = new mysqli('localhost', 'root', '', 'restaurant_db');
if ($mysqli->connect_errno) {
  http_response_code(500);
  echo json_encode(['error' => 'DB connection failed']);
  exit;
}
$mysqli->set_charset('utf8mb4');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  // Return all items (only the 3 columns)
  $res = $mysqli->query("SELECT menuitem_id, name, price FROM menuitems ORDER BY menuitem_id ASC");
  $rows = [];
  while ($row = $res->fetch_assoc()) { $rows[] = $row; }
  echo json_encode($rows, JSON_UNESCAPED_UNICODE);
  exit;
}

if ($method === 'POST') {
  // Add a new item: { "name": "...", "price": 12.34 }
  $input = json_decode(file_get_contents('php://input'), true);
  if (!isset($input['name']) || !isset($input['price'])) {
    http_response_code(400);
    echo json_encode(['error' => 'name and price are required']);
    exit;
  }

  $name  = $mysqli->real_escape_string($input['name']);
  $price = $mysqli->real_escape_string($input['price']);

  $sql = "INSERT INTO menuitems (name, price) VALUES ('$name', '$price')";
  if ($mysqli->query($sql)) {
    echo json_encode([
      'message' => 'Item added',
      'menuitem_id' => $mysqli->insert_id,
      'name' => $input['name'],
      'price' => (float)$input['price']
    ], JSON_UNESCAPED_UNICODE);
  } else {
    http_response_code(500);
    echo json_encode(['error' => 'insert failed']);
  }
  exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);

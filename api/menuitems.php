<?php
require_once 'db.php';

$db = new Database();
$method = $_SERVER['REQUEST_METHOD'];
$pathInfo = $_SERVER['PATH_INFO'] ?? '';

switch ($method) {
    case 'GET':
        if (preg_match('/^\/(\d+)$/', $pathInfo, $matches)) {
            $id = $matches[1];
            $result = $db->fetchOne(
                "SELECT * FROM menu_items WHERE id = ?",
                [$id]
            );

            if ($result) {
                $result['price'] = (float)$result['price'];
                echo json_encode($result);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Item not found']);
            }
        } else {
            $results = $db->fetchAll("SELECT * FROM menu_items ORDER BY id DESC");

            foreach ($results as &$item) {
                $item['price'] = (float)$item['price'];
            }

            echo json_encode($results);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['name']) || !isset($data['price']) || !isset($data['image'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Name, price, and image are required']);
            exit();
        }

        $db->query(
            "INSERT INTO menu_items (name, price, image, description) VALUES (?, ?, ?, ?)",
            [
                $data['name'],
                $data['price'],
                $data['image'],
                $data['description'] ?? null
            ]
        );

        $id = $db->lastInsertId();
        $result = $db->fetchOne("SELECT * FROM menu_items WHERE id = ?", [$id]);
        $result['price'] = (float)$result['price'];

        echo json_encode($result);
        break;

    case 'PUT':
        if (preg_match('/^\/(\d+)$/', $pathInfo, $matches)) {
            $id = $matches[1];
            $data = json_decode(file_get_contents('php://input'), true);

            $existing = $db->fetchOne("SELECT id FROM menu_items WHERE id = ?", [$id]);

            if (!$existing) {
                http_response_code(404);
                echo json_encode(['error' => 'Item not found']);
                exit();
            }

            $db->query(
                "UPDATE menu_items SET name = ?, price = ?, image = ?, description = ? WHERE id = ?",
                [
                    $data['name'],
                    $data['price'],
                    $data['image'],
                    $data['description'] ?? null,
                    $id
                ]
            );

            $result = $db->fetchOne("SELECT * FROM menu_items WHERE id = ?", [$id]);
            $result['price'] = (float)$result['price'];

            echo json_encode($result);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Item ID is required']);
        }
        break;

    case 'DELETE':
        if (preg_match('/^\/(\d+)$/', $pathInfo, $matches)) {
            $id = $matches[1];

            $existing = $db->fetchOne("SELECT id FROM menu_items WHERE id = ?", [$id]);

            if (!$existing) {
                http_response_code(404);
                echo json_encode(['error' => 'Item not found']);
                exit();
            }

            $db->query("DELETE FROM menu_items WHERE id = ?", [$id]);

            echo json_encode(['success' => true]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Item ID is required']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

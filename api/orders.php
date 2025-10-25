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
                "SELECT * FROM orders WHERE id = ?",
                [$id]
            );

            if ($result) {
                $result['total_amount'] = (float)$result['total_amount'];
                $result['items'] = json_decode($result['items']);
                echo json_encode($result);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Order not found']);
            }
        } else {
            $results = $db->fetchAll("SELECT * FROM orders ORDER BY created_at DESC");

            foreach ($results as &$order) {
                $order['total_amount'] = (float)$order['total_amount'];
                $order['items'] = json_decode($order['items']);
            }

            echo json_encode($results);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        $required = ['customerName', 'customerPhone', 'customerAddress', 'items', 'totalAmount'];
        foreach ($required as $field) {
            if (!isset($data[$field])) {
                http_response_code(400);
                echo json_encode(['error' => ucfirst($field) . ' is required']);
                exit();
            }
        }

        $db->query(
            "INSERT INTO orders (customer_name, customer_phone, customer_address, delivery_time, items, total_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                $data['customerName'],
                $data['customerPhone'],
                $data['customerAddress'],
                $data['deliveryTime'] ?? null,
                json_encode($data['items']),
                $data['totalAmount'],
                $data['status'] ?? 'pending'
            ]
        );

        $id = $db->lastInsertId();
        $result = $db->fetchOne("SELECT * FROM orders WHERE id = ?", [$id]);
        $result['total_amount'] = (float)$result['total_amount'];
        $result['items'] = json_decode($result['items']);

        echo json_encode($result);
        break;

    case 'PUT':
        if (preg_match('/^\/(\d+)$/', $pathInfo, $matches)) {
            $id = $matches[1];
            $data = json_decode(file_get_contents('php://input'), true);

            $existing = $db->fetchOne("SELECT id FROM orders WHERE id = ?", [$id]);

            if (!$existing) {
                http_response_code(404);
                echo json_encode(['error' => 'Order not found']);
                exit();
            }

            $db->query(
                "UPDATE orders SET customer_name = ?, customer_phone = ?, customer_address = ?, delivery_time = ?, items = ?, total_amount = ?, status = ? WHERE id = ?",
                [
                    $data['customerName'],
                    $data['customerPhone'],
                    $data['customerAddress'],
                    $data['deliveryTime'] ?? null,
                    json_encode($data['items']),
                    $data['totalAmount'],
                    $data['status'] ?? 'pending',
                    $id
                ]
            );

            $result = $db->fetchOne("SELECT * FROM orders WHERE id = ?", [$id]);
            $result['total_amount'] = (float)$result['total_amount'];
            $result['items'] = json_decode($result['items']);

            echo json_encode($result);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Order ID is required']);
        }
        break;

    case 'DELETE':
        if (preg_match('/^\/(\d+)$/', $pathInfo, $matches)) {
            $id = $matches[1];

            $existing = $db->fetchOne("SELECT id FROM orders WHERE id = ?", [$id]);

            if (!$existing) {
                http_response_code(404);
                echo json_encode(['error' => 'Order not found']);
                exit();
            }

            $db->query("DELETE FROM orders WHERE id = ?", [$id]);

            echo json_encode(['success' => true]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Order ID is required']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

<?php
require_once 'db.php';

$db = new Database();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sessionId = $_GET['session_id'] ?? null;

        if (!$sessionId) {
            http_response_code(400);
            echo json_encode(['error' => 'Session ID is required']);
            exit();
        }

        $result = $db->fetchOne(
            "SELECT cart_data FROM cart_sessions WHERE session_id = ?",
            [$sessionId]
        );

        if ($result) {
            echo json_encode(json_decode($result['cart_data']));
        } else {
            echo json_encode([]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $sessionId = $data['session_id'] ?? null;
        $cartData = $data['cart_data'] ?? [];

        if (!$sessionId) {
            http_response_code(400);
            echo json_encode(['error' => 'Session ID is required']);
            exit();
        }

        $existing = $db->fetchOne(
            "SELECT id FROM cart_sessions WHERE session_id = ?",
            [$sessionId]
        );

        if ($existing) {
            $db->query(
                "UPDATE cart_sessions SET cart_data = ?, updated_at = NOW() WHERE session_id = ?",
                [json_encode($cartData), $sessionId]
            );
        } else {
            $db->query(
                "INSERT INTO cart_sessions (session_id, cart_data) VALUES (?, ?)",
                [$sessionId, json_encode($cartData)]
            );
        }

        echo json_encode(['success' => true]);
        break;

    case 'DELETE':
        $sessionId = $_GET['session_id'] ?? null;

        if (!$sessionId) {
            http_response_code(400);
            echo json_encode(['error' => 'Session ID is required']);
            exit();
        }

        $db->query(
            "DELETE FROM cart_sessions WHERE session_id = ?",
            [$sessionId]
        );

        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

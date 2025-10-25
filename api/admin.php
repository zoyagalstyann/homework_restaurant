<?php
require_once 'db.php';

$db = new Database();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sessionToken = $_GET['session_token'] ?? null;

        if (!$sessionToken) {
            http_response_code(400);
            echo json_encode(['error' => 'Session token is required']);
            exit();
        }

        $result = $db->fetchOne(
            "SELECT is_logged_in FROM admin_sessions WHERE session_token = ?",
            [$sessionToken]
        );

        if ($result) {
            echo json_encode(['is_logged_in' => (bool)$result['is_logged_in']]);
        } else {
            echo json_encode(['is_logged_in' => false]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $sessionToken = $data['session_token'] ?? null;
        $password = $data['password'] ?? null;

        if (!$sessionToken) {
            http_response_code(400);
            echo json_encode(['error' => 'Session token is required']);
            exit();
        }

        $isValid = $password === 'admin123';

        $existing = $db->fetchOne(
            "SELECT id FROM admin_sessions WHERE session_token = ?",
            [$sessionToken]
        );

        if ($existing) {
            $db->query(
                "UPDATE admin_sessions SET is_logged_in = ?, last_active = NOW() WHERE session_token = ?",
                [$isValid ? 1 : 0, $sessionToken]
            );
        } else {
            $db->query(
                "INSERT INTO admin_sessions (session_token, is_logged_in) VALUES (?, ?)",
                [$sessionToken, $isValid ? 1 : 0]
            );
        }

        echo json_encode(['success' => $isValid, 'is_logged_in' => $isValid]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $sessionToken = $data['session_token'] ?? null;
        $isLoggedIn = $data['is_logged_in'] ?? false;

        if (!$sessionToken) {
            http_response_code(400);
            echo json_encode(['error' => 'Session token is required']);
            exit();
        }

        $existing = $db->fetchOne(
            "SELECT id FROM admin_sessions WHERE session_token = ?",
            [$sessionToken]
        );

        if ($existing) {
            $db->query(
                "UPDATE admin_sessions SET is_logged_in = ?, last_active = NOW() WHERE session_token = ?",
                [$isLoggedIn ? 1 : 0, $sessionToken]
            );
        } else {
            $db->query(
                "INSERT INTO admin_sessions (session_token, is_logged_in) VALUES (?, ?)",
                [$sessionToken, $isLoggedIn ? 1 : 0]
            );
        }

        echo json_encode(['success' => true]);
        break;

    case 'DELETE':
        $sessionToken = $_GET['session_token'] ?? null;

        if (!$sessionToken) {
            http_response_code(400);
            echo json_encode(['error' => 'Session token is required']);
            exit();
        }

        $db->query(
            "UPDATE admin_sessions SET is_logged_in = 0, last_active = NOW() WHERE session_token = ?",
            [$sessionToken]
        );

        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

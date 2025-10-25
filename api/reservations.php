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
                "SELECT * FROM reservations WHERE id = ?",
                [$id]
            );

            if ($result) {
                $result['guest_count'] = (int)$result['guest_count'];
                $result['table_number'] = (int)$result['table_number'];
                echo json_encode($result);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Reservation not found']);
            }
        } else {
            $results = $db->fetchAll("SELECT * FROM reservations ORDER BY reservation_date DESC, reservation_time DESC");

            foreach ($results as &$reservation) {
                $reservation['guest_count'] = (int)$reservation['guest_count'];
                $reservation['table_number'] = (int)$reservation['table_number'];
            }

            echo json_encode($results);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        $required = ['firstName', 'lastName', 'phone', 'email', 'reservationDate', 'reservationTime', 'guestCount', 'tableNumber'];
        foreach ($required as $field) {
            if (!isset($data[$field])) {
                http_response_code(400);
                echo json_encode(['error' => ucfirst($field) . ' is required']);
                exit();
            }
        }

        $db->query(
            "INSERT INTO reservations (first_name, last_name, phone, email, city, reservation_date, reservation_time, guest_count, table_number, special_requests, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $data['firstName'],
                $data['lastName'],
                $data['phone'],
                $data['email'],
                $data['city'] ?? null,
                $data['reservationDate'],
                $data['reservationTime'],
                $data['guestCount'],
                $data['tableNumber'],
                $data['specialRequests'] ?? null,
                $data['status'] ?? 'pending'
            ]
        );

        $id = $db->lastInsertId();
        $result = $db->fetchOne("SELECT * FROM reservations WHERE id = ?", [$id]);
        $result['guest_count'] = (int)$result['guest_count'];
        $result['table_number'] = (int)$result['table_number'];

        echo json_encode($result);
        break;

    case 'PUT':
        if (preg_match('/^\/(\d+)$/', $pathInfo, $matches)) {
            $id = $matches[1];
            $data = json_decode(file_get_contents('php://input'), true);

            $existing = $db->fetchOne("SELECT id FROM reservations WHERE id = ?", [$id]);

            if (!$existing) {
                http_response_code(404);
                echo json_encode(['error' => 'Reservation not found']);
                exit();
            }

            $db->query(
                "UPDATE reservations SET first_name = ?, last_name = ?, phone = ?, email = ?, city = ?, reservation_date = ?, reservation_time = ?, guest_count = ?, table_number = ?, special_requests = ?, status = ? WHERE id = ?",
                [
                    $data['firstName'],
                    $data['lastName'],
                    $data['phone'],
                    $data['email'],
                    $data['city'] ?? null,
                    $data['reservationDate'],
                    $data['reservationTime'],
                    $data['guestCount'],
                    $data['tableNumber'],
                    $data['specialRequests'] ?? null,
                    $data['status'] ?? 'pending',
                    $id
                ]
            );

            $result = $db->fetchOne("SELECT * FROM reservations WHERE id = ?", [$id]);
            $result['guest_count'] = (int)$result['guest_count'];
            $result['table_number'] = (int)$result['table_number'];

            echo json_encode($result);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Reservation ID is required']);
        }
        break;

    case 'DELETE':
        if (preg_match('/^\/(\d+)$/', $pathInfo, $matches)) {
            $id = $matches[1];

            $existing = $db->fetchOne("SELECT id FROM reservations WHERE id = ?", [$id]);

            if (!$existing) {
                http_response_code(404);
                echo json_encode(['error' => 'Reservation not found']);
                exit();
            }

            $db->query("DELETE FROM reservations WHERE id = ?", [$id]);

            echo json_encode(['success' => true]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Reservation ID is required']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

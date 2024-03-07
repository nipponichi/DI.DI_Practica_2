<?php

include '../api/accionesAuth.php';
include '../api/conexionWS.php';

try {
    $pdo = new Conexion();
} catch (PDOException $e) {
    echo json_encode(['error' => 'Error de conexión con base de datos']);
}

// Obtiene el método con el que se comunica el cliente
$metodo = $_SERVER['REQUEST_METHOD'];

switch ($metodo) {

    case 'POST':

        // Llama a la función doLogin
        $resultado = AccionesAuth::doLogin($pdo);

        // Retorna la respuesta
        echo $resultado;
        
        break;

}
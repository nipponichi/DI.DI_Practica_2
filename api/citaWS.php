<?php

include '../api/accionesCita.php';
include '../api/conexionWS.php';

try {
    $pdo = new Conexion();
} catch (PDOException $e) {
    echo json_encode(['error' => 'Error de conexión con base de datos']);
}

// Obtiene el método con el que se comunica el cliente
$metodo = $_SERVER['REQUEST_METHOD'];

switch ($metodo) {

    case 'GET':
        // Obtiene los filtros de la URL
        $parametros = $_GET;
    
        // Llama a la función obtenerCita con los parámetros obtenidos
        $resultado = AccionesCita::obtenerCitas($pdo, $parametros);

        // Devuelve la respuesta
        echo $resultado;
        
        break;

    case 'POST':
        // Llama a la función insertarCita
        $resultado = AccionesCita::insertarCita($pdo);

        // Retorna la respuesta
        echo $resultado;

        break;


    case 'DELETE':
        // Llama a la función eliminarCita
        $resultado = AccionesCita::eliminarCita($pdo);

        // Envía la respuesta
        echo $resultado;

        break;

    case 'PUT':
        // Llama a la función modificarCita
        $resultado = AccionesCita::modificarCita($pdo);

        // Envía la respuesta
        echo $resultado;

        break;

}
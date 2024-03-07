<?php

include '../api/accionesPaciente.php';
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
        
        // Llama a la función obtenerPacientes con los parámetros obtenidos
        $resultado = AccionesPaciente::obtenerPacientes($pdo, $parametros);

        // Devuelve la respuesta
        echo $resultado;
        
        break;

    case 'POST':
        // Llama a la función insertarPaciente
        $resultado = AccionesPaciente::insertarPaciente($pdo);

        // Retorna la respuesta
        echo $resultado;

        break;


    case 'DELETE':
        // Llama a la función eliminarPaciente
        $resultado = AccionesPaciente::eliminarPaciente($pdo);

        // Envía la respuesta
        echo $resultado;

        break;

    case 'PUT':
        // Llama a la función modificarPaciente
        $resultado = AccionesPaciente::modificarPaciente($pdo);

        // Envía la respuesta
        echo $resultado;

        break;

}

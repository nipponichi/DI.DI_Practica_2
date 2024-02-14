<?php

include '../api/accionesMedico.php';
include '../models/conexion.php';

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
        
        // Llama a la función obtenerMedicos con los parámetros obtenidos
        $resultado = AccionesMedico::obtenerMedicos($pdo, $parametros);

        // Devuelve la respuesta
        echo $resultado;
        
        break;

    case 'POST':
        // Llama a la función insertarMedico
        $resultado = AccionesMedico::insertarMedico($pdo);

        // Retorna la respuesta
        echo $resultado;

        break;


    case 'DELETE':
        // Llama a la función eliminarMedico
        $resultado = AccionesMedico::eliminarMedico($pdo);

        // Envía la respuesta
        echo $resultado;

        break;

    case 'PUT':
        // Llama a la función modificarMedico
        $resultado = AccionesMedico::modificarMedico($pdo);

        // Envía la respuesta
        echo $resultado;

        break;

}

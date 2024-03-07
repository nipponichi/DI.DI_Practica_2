<?php

class accionesAuth
{
    // Método para resolver Login
    public static function doLogin($pdo)
    {
        // Toma el valor de usuario
        parse_str(file_get_contents('php://input'), $usuario);

        // Toma valor de los campos usuario y contraseña de usuario
        $user = $usuario['user'];
        $password = $usuario['passwd'];
    
        $response = ['status' => 'success', 'message' => "¡Bienvenido!"];
    
        if (empty($user) || empty($password)) {
            $response = ['status' => 'error', 'message' => "No se han recibido todos los parámetros requeridos."];
        } else if ($user !== 'admin' || $password !== 'admin') {
            $response = ['status' => 'error', 'message' => "Credenciales incorrectas"];
        }
    
        echo json_encode($response);
    }
}
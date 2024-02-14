<?php

include '../models/medico.php';



class AccionesMedico
{
    // Devuelve el listado de medicos y el total de registros
    public static function obtenerMedicos($pdo,$parametros)
    {
        $where = [];
        $valores = [];

        foreach ($parametros as $clave => $valor) {
            if (!empty($valor)) {
                $where[] = "$clave = :$clave";
                $valores[":$clave"] = $valor;
            }
        }
        $whereSql = '';
        if ($where) {
            $whereSql = 'WHERE ' . implode(' AND ', $where);
        }
        $sql = $pdo->prepare("SELECT * FROM medicos $whereSql");
        $sqlCount = $pdo->prepare("SELECT COUNT(*) FROM medicos $whereSql");
        
        $sql->execute($valores);
        $sqlCount->execute($valores);
        $sql->setFetchMode(PDO::FETCH_ASSOC);
        $sqlCount->setFetchMode(PDO::FETCH_ASSOC);
        $medicos = $sql->fetchAll();
        $total = $sqlCount->fetchColumn();
        // Devuelve el resultado de la consulta
        if (!empty($medicos)) {
            $resultado = json_encode(['status' => 'success', 'medicos' => $medicos, 'message' => 'Listado médicos']);
        } else {
            $resultado = json_encode(['status' => 'error', 'message' => 'Error cargando listado médicos']);
        }
        error_log(print_r('Resultados medicosWS', true));
        error_log('Resultado: ' . $resultado . ', Medicos: ' . print_r($medicos, true));
        return $resultado;
    }

    // Inserta el medico en la base de datos
    public static function insertarMedico($pdo)
    {
        parse_str(file_get_contents('php://input'), $medico);
        // Prepara la consulta SQL
        $sql = "INSERT INTO medicos (dni, numero_colegiado, nombre, apellido1, apellido2, especialidad_id, telefono) VALUES (:dni, :numero_colegiado, :nombre, :apellido1, :apellido2, :especialidad_id, :telefono)";

        // Prepara la declaración
        $stmt = $pdo->prepare($sql);

        // Vincula los parámetros
        $stmt->bindParam(':dni', $medico['dni']);
        $stmt->bindParam(':numero_colegiado', $medico['numero_colegiado']);
        $stmt->bindParam(':nombre', $medico['nombre']);
        $stmt->bindParam(':apellido1', $medico['apellido1']);
        $stmt->bindParam(':apellido2', $medico['apellido2']);
        $stmt->bindParam(':especialidad_id', $medico['especialidad_id']);
        $stmt->bindParam(':telefono', $medico['telefono']);

        // Retorna el resultado de la consulta
        if ($stmt->execute()) {
            $resultado = json_encode(['status' => 'success', 'message' => 'Medico eliminado correctamente']);
        } else {
            $resultado = json_encode(['status' => 'error', 'message' => 'DNI no encontrado']);
        }
        return $resultado;
    }

    // Elimina el medico de la base de datos tomando su DNI o N.de colegiado
    public static function eliminarMedico($pdo)
    {
        // Obtiene el dni
        $datos = file_get_contents("php://input");

        // Extraemos el valor dni
        list($key, $value) = explode('=', $datos);
        $dni = $value;

        $sql = "DELETE FROM medicos WHERE dni = :dni";

        $stmt = $pdo->prepare($sql);

        // Sustituye el valor de la variable en la consulta para ejecutar
        $stmt->bindParam(':dni', $dni);

        // Retorna el resultado de la consulta
        if ($stmt->execute()) {
            $resultado = json_encode(['status' => 'success', 'message' => 'Medico eliminado correctamente']);
        } else {
            $resultado = json_encode(['status' => 'error', 'message' => 'DNI no encontrado']);
        }
        return $resultado;
    }

    public static function modificarMedico($pdo)
    {
        // Recibe los datos del formulario
        $datos = json_decode(file_get_contents('php://input'), true);

        // Busca el DNI en la base de datos
        $stmt = $pdo->prepare("SELECT * FROM medicos WHERE dni = ?");
        $stmt->execute([$datos['dni']]);

        // Devuelve valor si encuentra el dni
        $hayDni = $stmt->fetch();

        if ($hayDni) {
            // Filtra los campos vacíos
            $datos = array_filter($datos, function ($valor) {
                return $valor !== "";
            });

            // Recoge los campos con valores ya filtrados los vacíos
            $campos = array_keys($datos);

            // Construimos el SET de la consulta
            $sql = "UPDATE medicos SET " . implode(" = ?, ", $campos) . " = ? WHERE dni = ?";

            // Añade dni a las datos a modificar
            $parametros = array_values($datos);
            $parametros[] = $datos['dni'];


            // Ejecuta la consulta
            $stmt = $pdo->prepare($sql);
            $stmt->execute($parametros);

            $resultado = json_encode(['status' => 'success', 'message' => 'Datos actualizados correctamente']);
        } else {
            $resultado = json_encode(['status' => 'error', 'message' => 'DNI no encontrado']);
        }

        return $resultado;
    }

}





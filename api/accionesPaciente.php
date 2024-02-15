<?php

class AccionesPaciente
{
    // Devuelve el listado de pacientes y el total de registros
    public static function obtenerPacientes($pdo,$parametros)
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
        $sql = $pdo->prepare("SELECT * FROM pacientes $whereSql");
        $sqlCount = $pdo->prepare("SELECT COUNT(*) FROM pacientes $whereSql");
        
        $sql->execute($valores);
        $sqlCount->execute($valores);
        $sql->setFetchMode(PDO::FETCH_ASSOC);
        $sqlCount->setFetchMode(PDO::FETCH_ASSOC);
        $pacientes = $sql->fetchAll();
        $total = $sqlCount->fetchColumn();
        // Devuelve el resultado de la consulta
        if (!empty($pacientes)) {
            $resultado = json_encode(['status' => 'success', 'pacientes' => $pacientes, 'message' => 'Listado pacientes']);
        } else {
            $resultado = json_encode(['status' => 'error', 'message' => 'Error cargando listado pacientes']);
        }
        error_log(print_r('Resultados pacientesWS', true));
        error_log('Resultado: ' . $resultado . ', Pacientes: ' . print_r($pacientes, true));
        return $resultado;
    }

    // Inserta el paciente en la base de datos
    public static function insertarPaciente($pdo)
    {
        parse_str(file_get_contents('php://input'), $paciente);
        // Prepara la consulta SQL
        $sql = "INSERT INTO pacientes (dni, sip, nombre, apellido1, apellido2, sexo, fecha_nacimiento) VALUES (:dni, :sip, :nombre, :apellido1, :apellido2, :sexo, :fecha_nacimiento)";

        // Prepara la declaración
        $stmt = $pdo->prepare($sql);

        // Vincula los parámetros
        $stmt->bindParam(':dni', $paciente['dni']);
        $stmt->bindParam(':sip', $paciente['sip']);
        $stmt->bindParam(':nombre', $paciente['nombre']);
        $stmt->bindParam(':apellido1', $paciente['apellido1']);
        $stmt->bindParam(':apellido2', $paciente['apellido2']);
        $stmt->bindParam(':sexo', $paciente['sexo']);
        $stmt->bindParam(':fecha_nacimiento', $paciente['fecha_nacimiento']);

        // Retorna el resultado de la consulta
        if ($stmt->execute()) {
            $resultado = json_encode(['status' => 'success', 'message' => 'Paciente creado correctamente']);
        } else {
            $resultado = json_encode(['status' => 'error', 'message' => 'Error creando paciente']);
        }
        return $resultado;
    }

    // Elimina el paciente de la base de datos tomando su DNI
    public static function eliminarPaciente($pdo)
    {
        // Obtiene el dni
        $datos = file_get_contents("php://input");

        // Extraemos el valor dni
        list($key, $value) = explode('=', $datos);
        $dni = $value;

        $sql = "DELETE FROM pacientes WHERE dni = :dni";

        $stmt = $pdo->prepare($sql);

        // Sustituye el valor de la variable en la consulta para ejecutar
        $stmt->bindParam(':dni', $dni);

        // Retorna el resultado de la consulta
        if ($stmt->execute()) {
            $resultado = json_encode(['status' => 'success', 'message' => 'Paciente eliminado correctamente']);
        } else {
            $resultado = json_encode(['status' => 'error', 'message' => 'Error al eliminar paciente']);
        }
        return $resultado;
    }

    public static function modificarPaciente($pdo)
    {
        // Recibe los datos del formulario
        $datos = json_decode(file_get_contents('php://input'), true);

        // Busca el DNI en la base de datos
        $stmt = $pdo->prepare("SELECT * FROM pacientes WHERE dni = ?");
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
            $sql = "UPDATE pacientes SET " . implode(" = ?, ", $campos) . " = ? WHERE dni = ?";

            // Añade dni a las datos a modificar
            $parametros = array_values($datos);
            $parametros[] = $datos['dni'];


            // Ejecuta la consulta
            $stmt = $pdo->prepare($sql);
            $stmt->execute($parametros);

            $resultado = json_encode(['status' => 'success', 'message' => 'Datos de paciente actualizados correctamente']);
        } else {
            $resultado = json_encode(['status' => 'error', 'message' => 'DNI de paciente no encontrado']);
        }

        return $resultado;
    }

}





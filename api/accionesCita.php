<?php

include '../api/accionesPaginacion.php';

class AccionesCita
{
    // Devuelve el listado de citas y el total de registros
    public static function obtenerCitas($pdo, $parametros)
    {
        $where = [];
        $valores = [];

        foreach ($parametros as $clave => $valor) {
            if (!empty($valor) && $clave != 'registrosPagina' && $clave != 'numeroPagina') {
                $where[] = "$clave = :$clave";
                $valores[":$clave"] = $valor;
            }
        }
        $whereSql = '';
        if ($where) {
            // Separamos con AND todos los filtros para contruir la clausula WHERE
            $whereSql = 'WHERE ' . implode(' AND ', $where);
        }

        // Obtenemos recuento citas
        $sqlCount = $pdo->prepare("SELECT COUNT(*) FROM citas $whereSql");
        $sqlCount->execute($valores);
        $sqlCount->setFetchMode(PDO::FETCH_ASSOC);
        $total = $sqlCount->fetchColumn();
        

        $numeroPagina = isset($parametros['numeroPagina']) ? $parametros['numeroPagina'] : 1;
        $registrosPagina = isset($parametros['registrosPagina']) ? $parametros['registrosPagina'] : 10;

        // Obtenemos el cálculo de la paginación
        $resultadoPaginacion = AccionesPaginacion::obtenerPaginacion($total, $registrosPagina, $numeroPagina);

        // Registros a saltar
        $offset = ($numeroPagina - 1) * $registrosPagina;

        $limit = (int) $registrosPagina;
        $offset = (int) $offset;

        // Obtenemos total citas segun hoja y registros seleccionados
        $sql = $pdo->prepare("SELECT * FROM citas $whereSql LIMIT $limit OFFSET $offset");
        $sql->execute($valores);
        $sql->setFetchMode(PDO::FETCH_ASSOC);
        $citas = $sql->fetchAll();


        // Añadimos los datos de los médicos y pacientes a las citas
        foreach ($citas as &$cita) {
            $medico_id = $cita['medico_id'];
            $paciente_id = $cita['paciente_id'];

            // self hace referencia a un metodo de la misma clase
            $cita['numero_colegiado'] = self::obtenerMedico($pdo, $medico_id);
            $cita['sip'] = self::obtenerPaciente($pdo, $paciente_id);
        }

        // Devuelve el resultado de la consulta
        if (!empty($citas)) {
            $resultado = json_encode(['status' => 'success', 'citas' => $citas, 'message' => 'Listado citas', 'Total' => $total, 'Paginacion' => $resultadoPaginacion]);
        } else {
            $resultado = json_encode(['status' => 'error', 'message' => 'Error cargando listado citas']);
        }
        return $resultado;
    }

    // Inserta el paciente en la base de datos
    public static function insertarCita($pdo)
    {
        parse_str(file_get_contents('php://input'), $cita);

        // Obtiene el ID del médico y paciente de la cita
        $cita['paciente_id'] = self::obtenerPacienteId($pdo, $cita['sip']);
        $cita['medico_id'] = self::obtenerMedicoId($pdo, $cita['numero_colegiado']);


        // Prepara la consulta SQL
        $sql = "INSERT INTO citas (medico_id , paciente_id, fecha) VALUES (:medico_id, :paciente_id, :fecha)";

        // Prepara la declaración
        $stmt = $pdo->prepare($sql);

        // Vincula los parámetros
        $stmt->bindParam(':medico_id', $cita['medico_id']);
        $stmt->bindParam(':paciente_id', $cita['paciente_id']);
        $stmt->bindParam(':fecha', $cita['fecha']);

        // Retorna el resultado de la consulta
        if ($stmt->execute()) {
            $resultado = json_encode(['status' => 'success', 'message' => 'Cita creada correctamente']);
        } else {
            $resultado = json_encode(['status' => 'error', 'message' => 'Error generando cita']);
        }
        return $resultado;
    }

    // Elimina el paciente de la base de datos tomando su DNI
    public static function eliminarCita($pdo)
    {
        // Obtiene el ID de la cita
        $datos = file_get_contents("php://input");

        // Extraemos el valor ID
        list($key, $value) = explode('=', $datos);
        $id = $value;

        $sql = "DELETE FROM citas WHERE id = :id";

        $stmt = $pdo->prepare($sql);

        // Sustituye el valor de la variable en la consulta para ejecutar
        $stmt->bindParam(':id', $id);

        // Retorna el resultado de la consulta
        if ($stmt->execute()) {
            $resultado = json_encode(['status' => 'success', 'message' => 'Cita eliminada correctamente']);
        } else {
            $resultado = json_encode(['status' => 'error', 'message' => 'Error al eliminar la cita']);
        }
        return $resultado;
    }

    public static function modificarCita($pdo)
    {
        // Recibe los datos del formulario
        $cita = json_decode(file_get_contents('php://input'), true);

        $cita['paciente_id'] = self::obtenerPacienteId($pdo, $cita['sip']);
        $cita['medico_id'] = self::obtenerMedicoId($pdo, $cita['numero_colegiado']);

        // Elimina los campos sip y numero_colegiado del array $cita
        unset($cita['sip'], $cita['numero_colegiado']);

        // Busca el ID en la base de datos
        $stmt = $pdo->prepare("SELECT * FROM citas WHERE id = ?");
        $stmt->execute([$cita['id']]);

        // Devuelve valor si encuentra el dni
        $hayId = $stmt->fetch();

        if ($hayId) {
            // Filtra los campos vacíos
            $cita = array_filter($cita, function ($valor) {
                return $valor !== "";
            });

            // Elimina registrosPagina y numeroPagina de datos
            unset($cita['registrosPagina'], $cita['numeroPagina']);
            // Recoge los campos con valores ya filtrados los vacíos
            $campos = array_keys($cita);

            // Construimos el SET de la consulta
            $sql = "UPDATE citas SET " . implode(" = ?, ", $campos) . " = ? WHERE id = ?";

            // Añade id a los datos a modificar
            $parametros = array_values($cita);
            $parametros[] = $cita['id'];


            // Ejecuta la consulta
            $stmt = $pdo->prepare($sql);
            $stmt->execute($parametros);

            $resultado = json_encode(['status' => 'success', 'message' => 'Datos de cita actualizados correctamente']);
        } else {
            $resultado = json_encode(['status' => 'error', 'message' => 'ID de cita no encontrado']);
        }

        return $resultado;
    }

    // Obtiene el sip de los pacientes listados en citas
    public static function obtenerPaciente($pdo, $paciente_id)
    {
        $sql = $pdo->prepare("SELECT sip FROM pacientes WHERE id = :paciente_id");
        $sql->execute([':paciente_id' => $paciente_id]);
        $paciente = $sql->fetch();

        return $paciente ? $paciente['sip'] : null;
    }

    // Obtiene el numero de colegiado de los médicos listados en citas
    public static function obtenerMedico($pdo, $medico_id)
    {
        $sql = $pdo->prepare("SELECT numero_colegiado FROM medicos WHERE id = :medico_id");
        $sql->execute([':medico_id' => $medico_id]);
        $medico = $sql->fetch();

        return $medico ? $medico['numero_colegiado'] : null;
    }

    // Obtiene el ID del paciente para insertar la cita
    public static function obtenerPacienteId($pdo, $sip)
    {
        $sql = $pdo->prepare("SELECT id FROM pacientes WHERE sip = :sip");
        $sql->execute([':sip' => $sip]);
        $paciente = $sql->fetch();

        return $paciente ? $paciente['id'] : null;
    }

    // Obtiene el ID de médico para insertar la cita
    public static function obtenerMedicoId($pdo, $numero_colegiado)
    {
        $sql = $pdo->prepare("SELECT id FROM medicos WHERE numero_colegiado = :numero_colegiado");
        $sql->execute([':numero_colegiado' => $numero_colegiado]);
        $sql->setFetchMode(PDO::FETCH_ASSOC);
        $medico = $sql->fetch();

        return $medico ? $medico['id'] : null;
    }

}





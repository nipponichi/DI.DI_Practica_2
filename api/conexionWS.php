<?php

class conexion extends PDO {
    private $hostBd = 'localhost';
    private $nombreBd = 'hospital';
    private $usuarioBd = 'root';
    private $passwordBd = 'root';

    public function __construct() {

        try {
            parent::__construct('mysql:host=' . $this->hostBd . ';dbname=' . $this->
            nombreBd . ';charset=utf8', $this->usuarioBd, $this->passwordBd, array(PDO::
            ATTR_ERRMODE=> PDO::ERRMODE_EXCEPTION));
        } catch (PDOException $e) {
            echo 'Error: ' .$e->getMessage();
            exit;
        }
    }
}

?>
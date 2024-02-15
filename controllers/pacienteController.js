
document.addEventListener('DOMContentLoaded', function () {

    // Manejo de enlaces en navBar
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault(); 
            var page = this.textContent.trim();
            switch (page) {
                case 'Médicos':
                    window.location.href = 'medicoList.html';
                    break;
                case 'Pacientes':
                    window.location.href = 'pacienteList.html';
                    break;
                case 'Citas':
                    window.location.href = 'citaList.html';
                    break;
                default:
                    console.log('Página no encontrada');
            }
        });
    });

    $(document).ready(function () {

        buscarPacientes();

        // Botón Buscar
        $('#btnBuscar').click(function (e) {
            e.preventDefault();
            buscarPacientes();
        });

        // Botón Insertar
        $('#btnInsertar').click(function (e) {
            e.preventDefault();
            insertarPacientes();
        });

        // Botón Eliminar
        $('#btnEliminar').click(function (e) {
            e.preventDefault();
            eliminarPacientes();
        });

        // Botón Modificar
        $('#btnModificar').click(function (e) {
            e.preventDefault();
            modificarPacientes();
        });

        // Obtiene valores filtrados de médicos
        function buscarPacientes() {
            // Recoge los valores de los campos del formulario
            var paciente = {
                dni: $('#inputDni').val(),
                sip: $('#inputSip').val(),
                nombre: $('#inputName').val(),
                apellido1: $('#inputApellido1').val(),
                apellido2: $('#inputApellido2').val(),
                sexo: $('#inputSexo').val(),
                fecha_nacimiento: $('#inputFecha_Nacimiento').val()
            };

            // Añade a parametros los valores
            var parametros = $.param(paciente);

            // Realiza la petición AJAX para buscar médicos con los filtros
            $.ajax({
                url: 'http://localhost/di_practica_2/api/pacienteWS.php',
                type: 'GET',
                data: parametros,
                dataType: 'json',
                success: function (respuesta) {
                    console.log(respuesta);
                    if (respuesta.status === 'success') {
                        limpiarCampos();
                        mostrarPacientes(respuesta.pacientes);
                    } else {
                        alert(respuesta.message);
                        limpiarCampos();
                    }
                }
            });
        }

        // Crea un nuevo paciente con los valores del formulario
        function insertarPacientes() {
            // Recoge los valores de los campos del formulario
            var paciente = {
                dni: $('#inputDni').val(),
                sip: $('#inputSip').val(),
                nombre: $('#inputName').val(),
                apellido1: $('#inputApellido1').val(),
                apellido2: $('#inputApellido2').val(),
                sexo: $('#inputSexo').val(),
                fecha_nacimiento: $('#inputFecha_Nacimiento').val()
            };

            // Petición AJAX para insertar un nuevo paciente
            $.ajax({
                url: 'http://localhost/di_practica_2/api/pacienteWS.php',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: paciente,
                success: function (respuesta) {
                    console.log(respuesta);
                    if (respuesta.status === 'success') {
                        alert(respuesta.message);
                        limpiarCampos();
                        buscarPacientes();
                    } else {
                        alert(respuesta.message);
                        limpiarCampos();
                        buscarPacientes();
                    }
                },
            });

        }

        // Elimina un paciente tomando su campo DNI
        function eliminarPacientes() {
            // Recoge los valores de los campos del formulario
            var dni = $('#inputDni').val();

            // Verifica que dni tenga valor
            if (!dni) {
                alert('Debes introducir el DNI del paciente a eliminar.');
                return;
            } else {

                if (!confirm('¿Deseas eliminar al paciente con DNI ' + dni + '?')) {
                    return;
                }
            }

            // Realiza la petición AJAX para eliminar paciente
            $.ajax({
                url: 'http://localhost/di_practica_2/api/pacienteWS.php',
                type: 'DELETE',
                dataType: 'json',
                contentType: 'application/json',
                data: { dni: dni },
                success: function (respuesta) {
                    console.log(respuesta);
                    if (respuesta.status === 'success') {
                        alert(respuesta.message);
                        limpiarCampos();
                        buscarPacientes();
                    } else {
                        alert(respuesta.message);
                        limpiarCampos();
                        buscarPacientes();
                    }
                }
            });

        }

        // Modifica un registro de paciente por su DNI
        function modificarPacientes() {
            // Recoge los valores de los campos del formulario
            var paciente = {
                dni: $('#inputDni').val(),
                sip: $('#inputSip').val(),
                nombre: $('#inputName').val(),
                apellido1: $('#inputApellido1').val(),
                apellido2: $('#inputApellido2').val(),
                sexo: $('#inputSexo').val(),
                fecha_nacimiento: $('#inputFecha_Nacimiento').val()
            };

            if (!paciente.dni) {
                alert('Debes introducir el DNI del paciente a modificar.');
                return;
            }

            // Verifica si todos los campos están vacíos
            var camposVacios = true;
            for (var key in paciente) {
                if (paciente[key] !== "") {
                    camposVacios = false;
                    break;
                }
            }

            if (camposVacios) {
                alert('Debes introducir al menos un valor en los campos del formulario.');
                return;
            }

            // Realiza la petición AJAX
            $.ajax({
                url: 'http://localhost/di_practica_2/api/pacienteWS.php',
                type: "PUT",
                dataType: 'json',
                data: JSON.stringify(paciente),
                contentType: "application/json",
                success: function (respuesta) {
                    console.log(respuesta);
                    if (respuesta.status === 'success') {
                        alert(respuesta.message);
                        limpiarCampos();
                        buscarPacientes();
                    } else {
                        alert(respuesta.message);
                        limpiarCampos();
                        buscarPacientes();
                    }
                }
            });

        }

        // Muestra el listado de pacientes en la tabla
        function mostrarPacientes(pacientes) {
            // Limpia la tabla
            $('#tablaDatos tbody').empty();
            // Añade los nuevos datos a la tabla
            pacientes.forEach(function (valor) {
                $('#tablaDatos tbody').append(`
                    <tr>
                        <td>${valor.dni}</td>
                        <td>${valor.sip}</td>
                        <td>${valor.nombre}</td>
                        <td>${valor.apellido1}</td>
                        <td>${valor.apellido2}</td>
                        <td>${valor.sexo}</td>
                        <td>${valor.fecha_nacimiento}</td>
                    </tr>
                `);
            });
        }

        // Vacía los campos del formulario
        function limpiarCampos() {
            document.getElementById("formularioBusqueda").reset();
        }

    });

});



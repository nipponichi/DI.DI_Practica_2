document.addEventListener('DOMContentLoaded', function () {

    // Manejo de enlaces en navBar
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var pagina = this.textContent.trim();
            switch (pagina) {
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

        buscarCitas();

        // Botón Buscar
        $('#btnBuscar').click(function (e) {
            e.preventDefault();
            buscarCitas();
        });

        // Botón Insertar
        $('#btnInsertar').click(function (e) {
            e.preventDefault();
            insertarCita();
        });

        // Botón Eliminar
        $('#btnEliminar').click(function (e) {
            e.preventDefault();
            eliminarCita();
        });

        // Botón Modificar
        $('#btnModificar').click(function (e) {
            e.preventDefault();
            modificarCita();
        });

        // Obtiene valores filtrados de médicos
        function buscarCitas() {
            // Recoge los valores de los campos del formulario
            var filtros = {
                id: $('#inputId').val(),
                sip: $('#inputSip').val(),
                numero_colegiado: $('#inputColegiado').val(),
                fecha: $('#inputFecha').val(),
            };

            // Añade a parametros los valores
            var parametros = $.param(filtros);

            // Realiza la petición AJAX para buscar médicos con los filtros
            $.ajax({
                url: 'http://localhost/di_practica_2/api/citaWS.php',
                type: 'GET',
                data: parametros,
                dataType: 'json',
                success: function (respuesta) {
                    console.log(respuesta);
                    if (respuesta.status === 'success') {
                        limpiarCampos();
                        mostrarCitas(respuesta.citas);
                    } else {
                        alert(respuesta.message);
                        limpiarCampos();
                    }
                }
            });
        }

        // Crea un nuevo médico con los valores del formulario
        function insertarCita() {
            // Recoge los valores de los campos del formulario
            var cita = {
                sip: $('#inputSip').val(),
                numero_colegiado: $('#inputColegiado').val(),
                fecha: $('#inputFecha').val(),
                medico_id: "",
                paciente_id: "",
            };

            // Petición AJAX para insertar un nuevo médico
            $.ajax({
                url: 'http://localhost/di_practica_2/api/citaWS.php',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: cita,
                success: function (respuesta) {
                    console.log(respuesta);
                    if (respuesta.status === 'success') {
                        alert(respuesta.message);
                        limpiarCampos();
                        buscarCitas();
                    } else {
                        alert(respuesta.message);
                        limpiarCampos();
                        buscarCitas();
                    }
                },
            });

        }

        // Elimina una cita tomando su campo ID
        function eliminarCita() {
            // Recoge los valores de los campos del formulario
            var id = $('#inputId').val();

            // Verifica que dni tenga valor
            if (!id) {
                alert('Debes introducir el ID de cita a eliminar.');
                return;
            } else {

                if (!confirm('¿Deseas eliminar la cita con ID ' + id + '?')) {
                    return;
                }
            }

            // Realiza la petición AJAX para eliminar médico
            $.ajax({
                url: 'http://localhost/di_practica_2/api/citaWS.php',
                type: 'DELETE',
                dataType: 'json',
                contentType: 'application/json',
                data: { id: id },
                success: function (respuesta) {
                    console.log(respuesta);
                    if (respuesta.status === 'success') {
                        alert(respuesta.message);
                        limpiarCampos();
                        buscarCitas();
                    } else {
                        alert(respuesta.message);
                        limpiarCampos();
                        buscarCitas();
                    }
                }
            });

        }

        // Modifica un registro de médico por su DNI
        function modificarCita() {
            // Recoge los valores de los campos del formulario
            var cita = {
                id: $('#inputId').val(),
                sip: $('#inputSip').val(),
                numero_colegiado: $('#inputColegiado').val(),
                fecha: $('#inputFecha').val(),
            };

            if (!cita.id) {
                alert('Debes introducir el ID de la cita a modificar.');
                return;
            }

            // Verifica si todos los campos están vacíos
            var camposVacios = true;
            for (var key in cita) {
                if (cita[key] !== "") {
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
                url: 'http://localhost/di_practica_2/api/citaWS.php',
                type: "PUT",
                dataType: 'json',
                data: JSON.stringify(cita),
                contentType: "application/json",
                success: function (respuesta) {
                    console.log(respuesta);
                    if (respuesta.status === 'success') {
                        alert(respuesta.message);
                        limpiarCampos();
                        buscarCitas();
                    } else {
                        alert(respuesta.message);
                        limpiarCampos();
                        buscarCitas();
                    }
                }
            });

        }

        // Muestra el listado de médicos en la tabla
        function mostrarCitas(citas) {
            // Limpia la tabla
            $('#tablaDatos tbody').empty();
            // Añade los nuevos datos a la tabla
            citas.forEach(function (valor) {
                $('#tablaDatos tbody').append(`
                    <tr>
                        <td>${valor.id}</td>
                        <td>${valor.fecha}</td>
                        <td>${valor.numero_colegiado}</td>
                        <td>${valor.sip}</td>
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

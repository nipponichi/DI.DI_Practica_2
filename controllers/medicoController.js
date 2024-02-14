
$(document).ready(function () {

    buscarMedicos();

    // Botón Buscar
    $('#btnBuscar').click(function (e) {
        e.preventDefault();
        buscarMedicos();
    });

    // Botón Insertar
    $('#btnInsertar').click(function (e) {
        e.preventDefault();
        insertarMedicos();
    });

    // Botón Eliminar
    $('#btnEliminar').click(function (e) {
        e.preventDefault();
        eliminarMedicos();
    });

    // Botón Modificar
    $('#btnModificar').click(function (e) {
        e.preventDefault();
        modificarMedicos();
    });

    // Obtiene valores filtrados de médicos
    function buscarMedicos() {
        // Recoge los valores de los campos del formulario
        var filtros = {
            dni: $('#inputDni').val(),
            numero_colegiado: $('#inputColegiado').val(),
            nombre: $('#inputName').val(),
            apellido1: $('#inputApellido1').val(),
            apellido2: $('#inputApellido2').val(),
            especialidad_id: $('#inputEspecialidad').val(),
            telefono: $('#inputTelefono').val()
        };

        // Añade a parametros los valores
        var parametros = $.param(filtros);

        // Realiza la petición AJAX para buscar médicos con los filtros
        $.ajax({
            url: 'http://localhost/di_practica_2/api/medicoWS.php',
            type: 'GET',
            data: parametros,
            dataType: 'json',
            success: function (respuesta) {
                console.log(respuesta);
                if (respuesta.status === 'success') {
                    limpiarCampos();
                    mostrarMedicos(respuesta.medicos);
                } else {
                    alert("Error cargando el listado de médicos");
                    limpiarCampos();
                }
            }
        });
    }

    // Crea un nuevo médico con los valores del formulario
    function insertarMedicos() {
        // Recoge los valores de los campos del formulario
        var medico = {
            dni: $('#inputDni').val(),
            numero_colegiado: $('#inputColegiado').val(),
            nombre: $('#inputName').val(),
            apellido1: $('#inputApellido1').val(),
            apellido2: $('#inputApellido2').val(),
            especialidad_id: $('#inputEspecialidad').val(),
            telefono: $('#inputTelefono').val()
        };

        // Petición AJAX para insertar un nuevo médico
        $.ajax({
            url: 'http://localhost/di_practica_2/api/medicoWS.php',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: medico,
            success: function (respuesta) {
                console.log(respuesta);
                if (respuesta.status === 'success') {
                    alert("Médico creado con éxito.");
                    limpiarCampos();
                    buscarMedicos();
                } else {
                    alert("No se ha podido crear el nuevo médico.");
                    limpiarCampos();
                    buscarMedicos();
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                alert("Error en la solicitud AJAX");
            }
        });
        
    }

    // Elimina un médico tomando su campo DNI
    function eliminarMedicos() {
        // Recoge los valores de los campos del formulario
        var dni = $('#inputDni').val();

        // Verifica que al menos uno de los campos obligatorios (dni) tenga valor
        if (!dni) {
            alert('Debes introducir el DNI del médico a eliminar.');
            return;
        } else {

            if (!confirm('¿Deseas eliminar al médico con DNI ' + dni + '?')) {
                return;
            }
        }

        // Realiza la petición AJAX para eliminar médico
        $.ajax({
            url: 'http://localhost/di_practica_2/api/medicoWS.php',
            type: 'DELETE',
            dataType: 'json',
            contentType: 'application/json',
            data: { dni: dni },
            success: function (respuesta) {
                console.log(respuesta);
                if (respuesta.status === 'success') {
                    alert("Médico eliminado con éxito.");
                    limpiarCampos();
                    buscarMedicos();
                } else {
                    alert("No se ha podido eliminar el médico.");
                    limpiarCampos();
                    buscarMedicos();
                }
            }
        });

    }

    // Modifica un registro de médico por su DNI
    function modificarMedicos() {
        // Recoge los valores de los campos del formulario
        var formData = {
            dni: $("#inputDni").val(),
            numero_colegiado: $("#inputColegiado").val(),
            nombre: $("#inputName").val(),
            apellido1: $("#inputApellido1").val(),
            apellido2: $("#inputApellido2").val(),
            especialidad: $("#inputEspecialidad").val(),
            telefono: $("#inputTelefono").val()
        };

        if (!formData.dni) {
            alert('Debes introducir el DNI del médico a modificar.');
            return;
        }

        // Verifica si todos los campos están vacíos
        var camposVacios = true;
        for (var key in formData) {
            if (formData[key] !== "") {
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
            url: 'http://localhost/di_practica_2/api/medicoWS.php',
            type: "PUT",
            dataType: 'json',
            data: JSON.stringify(formData),
            contentType: "application/json",
            success: function (respuesta) {
                console.log(respuesta);
                if (respuesta.status === 'success') {
                    alert("Médico modificado con éxito.");
                    limpiarCampos();
                    buscarMedicos();
                } else {
                    alert("No se han podido actualizar los datos.");
                    limpiarCampos();
                    buscarMedicos();
                }
            }
        });

    }

    // Muestra el listado de médicos en la tabla
    function mostrarMedicos(medicos) {
        // Limpia la tabla
        $('#tablaDatos tbody').empty();
        // Añade los nuevos datos a la tabla
        medicos.forEach(function (valor) {
            $('#tablaDatos tbody').append(`
                    <tr>
                        <td>${valor.dni}</td>
                        <td>${valor.numero_colegiado}</td>
                        <td>${valor.nombre}</td>
                        <td>${valor.apellido1}</td>
                        <td>${valor.apellido2}</td>
                        <td>${valor.especialidad_id}</td>
                        <td>${valor.telefono}</td>
                    </tr>
                `);
        });
    }

    // Vacía los campos del formulario
    function limpiarCampos() {
        document.getElementById("formularioBusqueda").reset();
    }

});





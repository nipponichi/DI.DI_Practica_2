
document.addEventListener('DOMContentLoaded', function () {

    // Manejo de enlaces en navBar
    let navLinks = document.querySelectorAll('.nav-link, .navbar-brand');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            let page = this.textContent.trim();
            switch (page) {
                case 'Logout':
                    window.location.href = 'index.html';
                    break;
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
                    alert('Página no encontrada');
            }
        });
    });


    $(document).ready(function () {

        let paginaActual;
        let totalPaginas;
        buscarPacientes();

        // Botones acción CRUD
        let btnDark = document.querySelectorAll('.btn.btn-dark');
        btnDark.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                let accion = this.title;
                switch (accion) {
                    case 'Buscar':
                        buscarPacientes();
                        break;
                    case 'Insertar':
                        insertarPacientes();
                        break;
                    case 'Eliminar':
                        eliminarPacientes();
                        break;
                    case 'Modificar':
                        modificarPacientes();
                        break;
                }
            });
        });

        // Botones paginación 
        let btnPaginacion = document.querySelectorAll('.page-link');
        btnPaginacion.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                let accion = this.dataset.action;
                switch (accion) {
                    case 'siguiente':
                        if (paginaActual != totalPaginas) {
                            paginaActual++;
                            buscarPacientes(paginaActual);
                        }
                        break;
                    case 'anterior':
                        if (paginaActual != 1) {
                            paginaActual--;
                            buscarPacientes(paginaActual);
                        }
                        break;
                    case 'primera':
                        buscarPacientes(1);
                        break;
                    case 'ultima':
                        buscarPacientes(totalPaginas);
                        break;
                }
            });
        });

        // Obtiene valores filtrados de médicos
        function buscarPacientes(numeroPagina = 1) {

            // Recoge los valores de los campos del formulario
            let paciente = tomarDatos(numeroPagina);

            // Realiza la petición AJAX para buscar médicos con los filtros
            $.ajax({
                url: 'http://localhost/di_practica_2/api/pacienteWS.php',
                type: 'GET',
                data: paciente,
                dataType: 'json',
                success: function (respuesta) {
                    if (respuesta.status === 'success') {
                        limpiarCampos();
                        mostrarPacientes(respuesta);
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
            let paciente = tomarDatos();

            // Petición AJAX para insertar un nuevo paciente
            $.ajax({
                url: 'http://localhost/di_practica_2/api/pacienteWS.php',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: paciente,
                success: function (respuesta) {
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
            let dni = $('#inputDni').val();

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
            let paciente = tomarDatos();

            if (!paciente.dni) {
                alert('Debes introducir el DNI del paciente a modificar.');
                return;
            }

            // Verifica si todos los campos están vacíos
            let camposVacios = true;
            for (let key in paciente) {
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
        function mostrarPacientes(respuesta) {

            // Resultados de la paginación
            let paginacion = respuesta.Paginacion;
            let paginasAdicionales = paginacion.paginasAdicionales

            paginaActual = paginacion.paginaActual;
            totalPaginas = paginacion.totalPaginas;

            // Resultados pacientes
            let pacientes = respuesta.pacientes;

            // Limpia la tabla
            $('#tablaDatos tbody').empty();

            // Añade los nuevos datos a la tabla
            for (let i = 0; i < pacientes.length; i++) {
                let valor = pacientes[i];
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
            }

            let elementoPaginacion = document.getElementById('btnPaginacion');

            // Limpia el contenido del elemento
            elementoPaginacion.innerHTML = '';

            // Crea un botón por página
            for (let i = 0; i < paginasAdicionales.length; i++) {
                let boton = document.createElement('button');
                boton.textContent = `${paginasAdicionales[i]}`;
                boton.className = "btn btn-dark";
                boton.onclick = function () {
                    paginaActual = paginasAdicionales[i];
                    // Recarga pacientes según la pagina seleccionada
                    buscarPacientes(paginaActual);
                };
                elementoPaginacion.appendChild(document.createTextNode('\u00A0'));
                elementoPaginacion.appendChild(boton);
            }

        }

        // Vacía los campos del formulario
        function limpiarCampos() {
            document.getElementById("formularioBusqueda").reset();
        }

        // Recoge los datos de la web (formulario y configuración páginas)
        function tomarDatos(numeroPagina) {
            let paciente = {
                dni: $('#inputDni').val().toUpperCase().trim(),
                sip: $('#inputSip').val().trim(),
                nombre: $('#inputName').val().trim(),
                apellido1: $('#inputApellido1').val().trim(),
                apellido2: $('#inputApellido2').val().trim(),
                sexo: $('#inputSexo').val().trim(),
                fecha_nacimiento: $('#inputFecha_Nacimiento').val().trim(),
                registrosPagina: $('#selectRegistros').val(),
                numeroPagina: numeroPagina
            };
            return paciente;
        }

    });

});


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

    let paginaActual;
    let totalPaginas;
    $(document).ready(function () {

        buscarMedicos();

        // Botones acción CRUD
        let btnDark = document.querySelectorAll('.btn.btn-dark');
        btnDark.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                let accion = this.title;
                switch (accion) {
                    case 'Buscar':
                        buscarMedicos();
                        break;
                    case 'Insertar':
                        insertarMedicos();
                        break;
                    case 'Eliminar':
                        eliminarMedicos();
                        break;
                    case 'Modificar':
                        modificarMedicos();
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
                        console.log("siguiente");
                        if (paginaActual !== totalPaginas) {
                            paginaActual++;
                            buscarMedicos(paginaActual);
                        }
                        break;
                    case 'anterior':
                        console.log("anterior");
                        if (paginaActual != 1) {
                            paginaActual--;
                            buscarMedicos(paginaActual);
                        }
                        break;
                    case 'primera':
                        buscarMedicos(1);
                        break;
                    case 'ultima':
                        buscarMedicos(totalPaginas);
                        break;
                }
            });
        });

        // Obtiene valores filtrados de médicos
        function buscarMedicos(numeroPagina = 1) {
            // Recoge los valores de los campos del formulario
            let medico = tomarDatos(numeroPagina);

            // Añade a parametros los valores
            let parametros = $.param(medico);

            // Realiza la petición AJAX para buscar médicos con los filtros
            $.ajax({
                url: 'http://localhost/di_practica_2/api/medicoWS.php',
                type: 'GET',
                data: parametros,
                dataType: 'json',
                success: function (respuesta) {
                    if (respuesta.status === 'success') {
                        limpiarCampos();
                        mostrarMedicos(respuesta);
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
            let medico = tomarDatos();

            // Petición AJAX para insertar un nuevo médico
            $.ajax({
                url: 'http://localhost/di_practica_2/api/medicoWS.php',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: medico,
                success: function (respuesta) {
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
            });

        }

        // Elimina un médico tomando su campo DNI
        function eliminarMedicos() {
            // Recoge los valores de los campos del formulario
            let dni = $('#inputDni').val();

            // Verifica que dni tenga valor
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
            let medico = tomarDatos();

            if (!medico.dni) {
                alert('Debes introducir el DNI del médico a modificar.');
                return;
            }

            // Verifica si todos los campos están vacíos
            let camposVacios = true;
            for (let key in medico) {
                if (medico[key] !== "") {
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
                data: JSON.stringify(medico),
                contentType: "application/json",
                success: function (respuesta) {
                    if (respuesta.status === 'success') {
                        alert(respuesta.message);
                        limpiarCampos();
                        buscarMedicos();
                    } else {
                        alert(respuesta.message);
                        limpiarCampos();
                        buscarMedicos();
                    }
                }
            });

        }

        // Muestra el listado de médicos en la tabla
        function mostrarMedicos(respuesta) {

            // Resultados de la paginación
            let paginacion = respuesta.Paginacion;
            let paginasAdicionales = paginacion.paginasAdicionales

            paginaActual = paginacion.paginaActual;
            totalPaginas = paginacion.totalPaginas;

            // Resultados medicos
            let medicos = respuesta.medicos;

            // Limpia la tabla
            $('#tablaDatos tbody').empty();

            // Añade los nuevos datos a la tabla
            for (let i = 0; i < medicos.length; i++) {
                let valor = medicos[i];
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
                    // Recarga pacientes según la página seleccionada
                    buscarMedicos(paginaActual);
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
            let medico = {
                dni: $('#inputDni').val().trim(),
                numero_colegiado: $('#inputColegiado').val().trim(),
                nombre: $('#inputName').val().trim(),
                apellido1: $('#inputApellido1').val().trim(),
                apellido2: $('#inputApellido2').val().trim(),
                especialidad_id: $('#inputEspecialidad').val().trim(),
                telefono: $('#inputTelefono').val().trim(),
                registrosPagina: $('#selectRegistros').val(),
                numeroPagina: numeroPagina
            }
            return medico
        }
    });
});





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
        buscarCitas();

        // Botones acción CRUD
        let btnDark = document.querySelectorAll('.btn.btn-dark');
        btnDark.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                let accion = this.title;
                switch (accion) {
                    case 'Buscar':
                        buscarCitas();
                        break;
                    case 'Insertar':
                        insertarCitas();
                        break;
                    case 'Eliminar':
                        eliminarCitas();
                        break;
                    case 'Modificar':
                        modificarCitas();
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
                        if(paginaActual != totalPaginas) {
                            paginaActual++;
                        buscarCitas(paginaActual);
                        }
                        break;
                    case 'anterior':
                        if(paginaActual != 1) {
                            paginaActual--;
                        buscarCitas(paginaActual);
                        }
                        break;
                    case 'primera':
                        buscarCitas(1);
                        break;
                    case 'ultima':
                        buscarCitas(totalPaginas);
                        break;
                }
            });
        });

        // Obtiene valores filtrados de citas
        function buscarCitas(numeroPagina = 1) {
            // Recoge los valores de los campos del formulario
            let cita = tomarDatos(numeroPagina);

            // Añade a parametros los valores
            let parametros = $.param(cita);

            // Realiza la petición AJAX para buscar citas con los filtros
            $.ajax({
                url: 'http://localhost/di_practica_2/api/citaWS.php',
                type: 'GET',
                data: parametros,
                dataType: 'json',
                success: function (respuesta) {
                    if (respuesta.status === 'success') {
                        limpiarCampos();
                        mostrarCitas(respuesta);
                    } else {
                        alert(respuesta.message);
                        limpiarCampos();
                    }
                }
            });
        }

        // Crea una nueva cita con los valores del formulario
        function insertarCitas() {
            // Recoge los valores de los campos del formulario
            let cita = tomarDatos();

            // Petición AJAX para insertar una nueva cita
            $.ajax({
                url: 'http://localhost/di_practica_2/api/citaWS.php',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: cita,
                success: function (respuesta) {
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
        function eliminarCitas() {
            // Recoge los valores de los campos del formulario
            let id = $('#inputId').val();

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
        function modificarCitas() {
            // Recoge los valores de los campos del formulario
            let cita = tomarDatos();

            if (!cita.id) {
                alert('Debes introducir el ID de la cita a modificar.');
                return;
            }

            // Verifica si todos los campos están vacíos
            let camposVacios = true;
            for (let key in cita) {
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

        // Muestra el listado de citas en la tabla
        function mostrarCitas(respuesta) {

            // Resultados de la paginación
            let paginacion = respuesta.Paginacion;
            let paginasAdicionales = paginacion.paginasAdicionales

            paginaActual = paginacion.paginaActual;
            totalPaginas = paginacion.totalPaginas;

            // Resultados citas
            let citas = respuesta.citas;

            // Limpia la tabla
            $('#tablaDatos tbody').empty();
            // Añade los nuevos datos a la tabla
            for (let i = 0; i < citas.length; i++) {
                let valor = citas[i];
                $('#tablaDatos tbody').append(`
                    <tr>
                        <td>${valor.id}</td>
                        <td>${valor.fecha}</td>
                        <td>${valor.numero_colegiado}</td>
                        <td>${valor.sip}</td>
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
                    buscarCitas(paginaActual);
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
        function tomarDatos (numeroPagina) {
            let cita = {
                id: $('#inputId').val().trim(),
                sip: $('#inputSip').val().trim(),
                numero_colegiado: $('#inputColegiado').val().trim(),
                fecha: $('#inputFecha').val().trim(),
                registrosPagina: $('#selectRegistros').val(),
                numeroPagina: numeroPagina
            };
            return cita
        }

    });
});

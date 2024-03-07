

$(document).ready(function () {

    let btnDark = document.querySelectorAll('.btn.btn-dark');
    btnDark.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            let accion = this.title;
            switch (accion) {
                case 'Login':
                    console.log("pulsado");
                    doLogin();
                    break;
            }
        });
    });

    function doLogin() {
        let usuario = tomarDatos();
        // Realiza la petición AJAX para doLogin
        $.ajax({
            url: 'http://localhost/di_practica_2/api/authWS.php',
            type: 'POST',
            data: usuario,
            dataType: 'json',
            success: function (respuesta) {
                if (respuesta.status === 'success') {
                    console.log("todo ok");
                    alert(respuesta.message);
                    window.location.href = 'citaList.html';
                } else {
                    console.log("fail");
                    alert(respuesta.message);
                }
            }
        });
    }

    // Recoge los datos de la web (formulario)
    function tomarDatos() {
        let usuario = {
            user: $('#user').val().trim(),
            passwd: $('#password').val().trim(),
        }
        return usuario
    }

});
document.addEventListener('DOMContentLoaded', function() {
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var page = this.textContent.trim();
            switch(page) {
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
});

// La clave que usaremos para guardar los datos en LocalStorage
const STORAGE_KEY = 'medicos_idw';

/**
 * Función para cargar y mostrar los médicos en la página principal
 */
function displayDoctors() {
    const doctors = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const doctorsContainer = document.getElementById('doctors-container');

    doctorsContainer.innerHTML = '';

    if (doctors && doctors.length > 0) {
        doctors.forEach(doctor => {
            const card = document.createElement('div');
            card.className = 'col-lg-3 col-md-6 col-sm-12 py-2 d-flex justify-content-center';
            card.innerHTML = `
                <div class="card" style="width: 20rem">
                    <img src="${doctor.imagen}" class="card-img-top" alt="${doctor.nombre}" />
                    <div class="card-body">
                        <h5 class="card-title">${doctor.nombre}</h5>
                        <p class="card-text">Especialidad: ${doctor.especialidad}</p>
                    </div>
                </div>
            `;
            doctorsContainer.appendChild(card);
        });
    }
}

// Llamar a la función de visualización cuando la página cargue
document.addEventListener('DOMContentLoaded', () => {
    displayDoctors();
});
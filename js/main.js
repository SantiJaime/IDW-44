// La clave que usaremos para guardar los datos en LocalStorage
const STORAGE_KEY = 'medicos_idw';

// Lista inicial de médicos que se cargará por defecto
const initialDoctors = [
    {
        id: 1,
        nombre: 'Dr. Juan Pérez',
        especialidad: 'Cardiología',
        imagen: '../img/doctor4.png'
    },
    {
        id: 2,
        nombre: 'Dra. María Gómez',
        especialidad: 'Pediatría',
        imagen: '../img/doctora1.png'
    },
    {
        id: 3,
        nombre: 'Dra. Fátima Hernández',
        especialidad: 'Neurología',
        imagen: '../img/doctora5.jpg'
    },
    {
        id: 4,
        nombre: 'Dr. Pedro Rodríguez',
        especialidad: 'Traumatología',
        imagen: '../img/doctor3.jpg'
    },
    {
        id: 5,
        nombre: 'Dr. Facundo González',
        especialidad: 'Radiología',
        imagen: '../img/doctor2.png'
    }
];

/**
 * Función para inicializar los datos de los médicos en LocalStorage
 */
function initializeData() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDoctors));
        console.log('Datos de médicos iniciales guardados en LocalStorage.');
    } else {
        console.log('Los datos de médicos ya existen en LocalStorage.');
    }
}

/**
 * Función para cargar y mostrar los médicos en la tabla
 */
function displayDoctors() {
    const doctors = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const tableBody = document.getElementById('medicos-table-body');
    tableBody.innerHTML = '';

    if (doctors && doctors.length > 0) {
        doctors.forEach(doctor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doctor.id}</td>
                <td>${doctor.nombre}</td>
                <td>${doctor.especialidad}</td>
                <td><img src="${doctor.imagen}" alt="${doctor.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%;"></td>
                <td>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${doctor.id}">Eliminar</button>
                    <button class="btn btn-warning btn-sm edit-btn" data-id="${doctor.id}">Modificar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

/**
 * Función para guardar un nuevo médico
 * @param {object} newDoctor - El objeto del nuevo médico a guardar
 */
function saveDoctor(newDoctor) {
    const doctors = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    doctors.push(newDoctor);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doctors));
}

/**
 * Función para manejar el envío del formulario de creación
 * @param {Event} event - El evento del formulario
 */
function handleFormSubmit(event) {
    event.preventDefault();

    const nameInput = document.getElementById('doctor-name');
    const specialtyInput = document.getElementById('doctor-specialty');
    const imageInput = document.getElementById('doctor-image');

    const newDoctor = {
        id: Date.now(),
        nombre: nameInput.value,
        especialidad: specialtyInput.value,
        imagen: imageInput.value
    };

    saveDoctor(newDoctor);
    displayDoctors();
    
    nameInput.value = '';
    specialtyInput.value = '';
    imageInput.value = '';
}

/**
 * Función para eliminar un médico por su ID
 * @param {number} id - El ID del médico a eliminar
 */
function deleteDoctor(id) {
    let doctors = JSON.parse(localStorage.getItem(STORAGE_KEY));
    doctors = doctors.filter(doctor => doctor.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doctors));
}

/**
 * Función para precargar los datos del médico en el formulario de edición
 * @param {number} id - El ID del médico a editar
 */
function loadDoctorForEditing(id) {
    const doctors = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const doctorToEdit = doctors.find(doctor => doctor.id === id);

    if (doctorToEdit) {
        document.getElementById('edit-form-section').style.display = 'block';
        document.getElementById('doctor-form').parentElement.style.display = 'none';

        document.getElementById('edit-doctor-id').value = doctorToEdit.id;
        document.getElementById('edit-doctor-name').value = doctorToEdit.nombre;
        document.getElementById('edit-doctor-specialty').value = doctorToEdit.especialidad;
        document.getElementById('edit-doctor-image').value = doctorToEdit.imagen;
    }
}

/**
 * Función para guardar los cambios de un médico editado
 * @param {Event} event - El evento del formulario
 */
function handleEditFormSubmit(event) {
    event.preventDefault();

    const editedDoctor = {
        id: parseInt(document.getElementById('edit-doctor-id').value),
        nombre: document.getElementById('edit-doctor-name').value,
        especialidad: document.getElementById('edit-doctor-specialty').value,
        imagen: document.getElementById('edit-doctor-image').value,
    };

    let doctors = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const doctorIndex = doctors.findIndex(doctor => doctor.id === editedDoctor.id);
    if (doctorIndex !== -1) {
        doctors[doctorIndex] = editedDoctor;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(doctors));
    }

    displayDoctors();
    
    document.getElementById('edit-form-section').style.display = 'none';
    document.getElementById('doctor-form').parentElement.style.display = 'block';
}

// Llamar a las funciones de inicialización y visualización cuando la página cargue
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    displayDoctors();
});

// Obtener la referencia al formulario de creación y añadir el "listener"
const doctorForm = document.getElementById('doctor-form');
doctorForm.addEventListener('submit', handleFormSubmit);

// Manejar clics en los botones de la tabla
document.getElementById('medicos-table-body').addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const doctorId = parseInt(event.target.getAttribute('data-id'));
        if (confirm('¿Estás seguro de que quieres eliminar este médico?')) {
            deleteDoctor(doctorId);
            displayDoctors();
        }
    }
    if (event.target.classList.contains('edit-btn')) {
        const doctorId = parseInt(event.target.getAttribute('data-id'));
        loadDoctorForEditing(doctorId);
    }
});

// Obtener la referencia al formulario de edición y añadir el listener
const editForm = document.getElementById('edit-doctor-form');
editForm.addEventListener('submit', handleEditFormSubmit);

// Añadir el listener al botón de cancelar para ocultar el formulario
document.getElementById('cancel-edit-btn').addEventListener('click', () => {
    document.getElementById('edit-form-section').style.display = 'none';
    document.getElementById('doctor-form').parentElement.style.display = 'block';
});

// Exportar la clave y la lista inicial para usarlas en otros archivos si es necesario
export { STORAGE_KEY, initialDoctors };
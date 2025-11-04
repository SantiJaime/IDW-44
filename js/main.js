// La clave que usaremos para guardar los datos en LocalStorage
const STORAGE_KEY = "medicos_idw";
let editEspecialidadId = null;
let editDoctorId = null;
/**
 * Función para cargar y mostrar los médicos en la tabla
 */
function displayDoctors() {
  const doctors = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const obrasSociales = JSON.parse(localStorage.getItem("obras-sociales"));

  const tableBody = document.getElementById("medicos-table-body");
  tableBody.innerHTML = "";

  if (doctors && doctors.length > 0) {
    doctors.forEach((doctor) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${doctor.id}</td>
                <td>${doctor.nombre} ${doctor.apellido}</td>
                <td>${doctor.especialidad}</td>
                <td>${doctor.matricula}</td>
                <td>$${doctor.valorConsulta}</td>
                <td>${doctor.obrasSociales.map(
                  (id) => obrasSociales.find((os) => os.id === id).nombre
                )}</td>
                <td><img src="${doctor.imagen}" alt="${
        doctor.nombre
      }" style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%;"></td>
                <td>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${
                      doctor.id
                    }">Eliminar</button>
                    <button class="btn btn-warning btn-sm edit-btn" data-bs-toggle="modal" data-bs-target="#editarMedicoModal" data-id="${
                      doctor.id
                    }">Modificar</button>
                </td>
            `;
      tableBody.appendChild(row);
    });
  }
}

function displayEspecialidades() {
  const especialidades = JSON.parse(localStorage.getItem("especialidades"));
  const tableBody = document.getElementById("especialidades-table-body");
  tableBody.innerHTML = "";

  if (especialidades && especialidades.length > 0) {
    especialidades.forEach((esp) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${esp.id}</td>
                <td>${esp.nombre}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-btn" onclick="deleteEspecialidad(${esp.id})">Eliminar</button>
                    <button class="btn btn-warning btn-sm edit-btn" data-bs-toggle="modal" data-bs-target="#editarEspecialidadModal" data-id="${esp.id}">Modificar</button>
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

function saveEspecialidad(newEspecialidad) {
  const especialidades =
    JSON.parse(localStorage.getItem("especialidades")) || [];
  especialidades.push(newEspecialidad);
  localStorage.setItem("especialidades", JSON.stringify(especialidades));
}

/**
 * Función para manejar el envío del formulario de creación
 * @param {Event} event - El evento del formulario
 */
function handleFormSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById("doctor-name");
  const lastNameInput = document.getElementById("doctor-lastname");
  const specialtyInput = document.getElementById("doctor-specialty");
  const matriculaInput = document.getElementById("doctor-matricula");
  const imageInput = document.getElementById("doctor-image");

  const newDoctor = {
    id: Date.now(),
    nombre: nameInput.value,
    apellido: lastNameInput.value,
    especialidad: specialtyInput.value,
    matricula: matriculaInput.value,
    imagen: imageInput.value,
  };

  saveDoctor(newDoctor);
  displayDoctors();

  const modal = document.getElementById("crearMedicoModal");
  const modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();

  nameInput.value = "";
  specialtyInput.value = "";
  imageInput.value = "";

  Swal.fire(
    "Médico creado correctamente",
    "El médico ha sido creado con éxito",
    "success"
  );
}

function handleEspecialidadFormSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById("especialidad-name");

  const newEspecialidad = {
    id: Date.now(),
    nombre: nameInput.value,
  };

  saveEspecialidad(newEspecialidad);
  displayEspecialidades();
  loadEspecialidadesOnSelect();

  const modal = document.getElementById("crearEspecialidadModal");
  const modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();
  nameInput.value = "";

  Swal.fire(
    "Especialidad creada correctamente",
    "La especialidad ha sido creado con éxito",
    "success"
  );
}

/**
 * Función para eliminar un médico por su ID
 * @param {number} id - El ID del médico a eliminar
 */
function deleteDoctor(id) {
  let doctors = JSON.parse(localStorage.getItem(STORAGE_KEY));
  doctors = doctors.filter((doctor) => doctor.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(doctors));
}

function deleteEspecialidad(id) {
  Swal.fire({
    title: "¿Estás seguro de que quieres eliminar esta especialidad?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      let especialidades = JSON.parse(localStorage.getItem("especialidades"));
      especialidades = especialidades.filter((esp) => esp.id !== parseInt(id));
      localStorage.setItem("especialidades", JSON.stringify(especialidades));

      displayEspecialidades();
      loadEspecialidadesOnSelect();
      Swal.fire({
        title: "Especialidad eliminada correctamente",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
}

/**
 * Función para precargar los datos del médico en el formulario de edición
 * @param {number} id - El ID del médico a editar
 */
function loadDoctorForEditing(id) {
  const doctors = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const doctorToEdit = doctors.find((doctor) => doctor.id === id);
  const especialidades = JSON.parse(localStorage.getItem("especialidades"));

  if (doctorToEdit) {
    document.getElementById("edit-doctor-name").value = doctorToEdit.nombre;
    document.getElementById("edit-doctor-lastname").value =
      doctorToEdit.apellido;
    document.getElementById("edit-doctor-matricula").value =
      doctorToEdit.matricula;
    document.getElementById("edit-doctor-valor-consulta").value =
      doctorToEdit.valorConsulta;
    document.getElementById("edit-doctor-image").value = doctorToEdit.imagen;
    const select = document.getElementById("edit-doctor-specialty");

    select.innerHTML = "";
    especialidades.forEach((esp) => {
      const option = document.createElement("option");
      option.value = esp.nombre;
      option.text = esp.nombre;
      select.add(option);
    });
    select.value = doctorToEdit.especialidad;
  }
}

/**
 * Función para guardar los cambios de un médico editado
 * @param {Event} event - El evento del formulario
 */
function handleEditFormSubmit(id) {
  const editedDoctor = {
    nombre: document.getElementById("edit-doctor-name").value,
    apellido: document.getElementById("edit-doctor-lastname").value,
    especialidad: document.getElementById("edit-doctor-specialty").value,
    matricula: document.getElementById("edit-doctor-matricula").value,
    valorConsulta: document.getElementById("edit-doctor-valor-consulta").value,
    imagen: document.getElementById("edit-doctor-image").value,
  };

  let doctors = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const doctorIndex = doctors.findIndex((doctor) => doctor.id === parseInt(id));
  if (doctorIndex !== -1) {
    editedDoctor.obrasSociales = doctors[doctorIndex].obrasSociales;
    editedDoctor.id = doctors[doctorIndex].id;

    doctors[doctorIndex] = editedDoctor;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(doctors));
  }

  displayDoctors();

  const modal = document.getElementById("editarMedicoModal");
  const modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();

  Swal.fire(
    "Médico editado correctamente",
    "El médico ha sido editado con éxito",
    "success"
  );
}

function handleEspecialidadEditFormSubmit(id) {
  const especialidades = JSON.parse(localStorage.getItem("especialidades"));

  const especialidadToEditIndex = especialidades.findIndex(
    (esp) => esp.id === parseInt(id)
  );
  const nameInput = document.getElementById("edit-especialidad-name");

  especialidades[especialidadToEditIndex].nombre = nameInput.value;
  localStorage.setItem("especialidades", JSON.stringify(especialidades));

  displayEspecialidades();
  loadEspecialidadesOnSelect();

  const modal = document.getElementById("editarEspecialidadModal");
  const modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();

  Swal.fire(
    "Especialidad editada correctamente",
    "La especialidad ha sido editada con éxito",
    "success"
  );
}

function loadEspecialidadesOnSelect() {
  const selectSpecialty = document.getElementById("doctor-specialty");
  selectSpecialty.innerHTML = "";

  const emptyOption = document.createElement("option");

  emptyOption.value = "Sin seleccionar";
  emptyOption.textContent = "Sin seleccionar";

  selectSpecialty.appendChild(emptyOption);

  const especialidades = JSON.parse(localStorage.getItem("especialidades"));
  especialidades.forEach((esp) => {
    const option = document.createElement("option");

    option.value = esp.nombre;
    option.textContent = esp.nombre;

    selectSpecialty.appendChild(option);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  displayDoctors();
  displayEspecialidades();
  loadEspecialidadesOnSelect();
});

// Obtener la referencia al formulario de creación y añadir el "listener"
const doctorForm = document.getElementById("doctor-form");
doctorForm.addEventListener("submit", handleFormSubmit);

const especialidadForm = document.getElementById("especialidad-form");
especialidadForm.addEventListener("submit", handleEspecialidadFormSubmit);

function editEspecialidad(id) {
  const especialidades = JSON.parse(localStorage.getItem("especialidades"));

  const input = document.getElementById("edit-especialidad-name");

  const especialidadToEditIndex = especialidades.findIndex(
    (esp) => esp.id === parseInt(id)
  );

  if (especialidadToEditIndex !== -1) {
    input.value = especialidades[especialidadToEditIndex].nombre;
  }
}

// Manejar clics en los botones de la tabla
document
  .getElementById("especialidades-table-body")
  .addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-btn")) {
      editEspecialidadId = event.target.getAttribute("data-id");
      editEspecialidad(editEspecialidadId);
    }
  });
document
  .getElementById("medicos-table-body")
  .addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
      const doctorId = parseInt(event.target.getAttribute("data-id"));
      Swal.fire({
        title: "¿Estás seguro de que quieres eliminar este médico?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteDoctor(doctorId);
          displayDoctors();
          Swal.fire({
            title: "Médico eliminado correctamente",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    }
    if (event.target.classList.contains("edit-btn")) {
      editDoctorId = parseInt(event.target.getAttribute("data-id"));
      loadDoctorForEditing(editDoctorId);
    }
  });

// Obtener la referencia al formulario de edición y añadir el listener
const editForm = document.getElementById("edit-doctor-form");
editForm.addEventListener("submit", function (event) {
  event.preventDefault();

  handleEditFormSubmit(editDoctorId);
});

const editEspecialidadForm = document.getElementById("edit-especialidad-form");
editEspecialidadForm.addEventListener("submit", function (event) {
  event.preventDefault();

  handleEspecialidadEditFormSubmit(editEspecialidadId);
});

// Añadir el listener al botón de cancelar para ocultar el formulario
document.getElementById("cancel-edit-btn").addEventListener("click", () => {
  document.getElementById("edit-form-section").style.display = "none";
  document.getElementById("doctor-form").parentElement.style.display = "block";
});

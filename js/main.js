if (!sessionStorage.getItem("token")) {
  window.location.href = "login.html";
}

const STORAGE_KEY = "medicos_idw";
let editEspecialidadId = null;
let editDoctorId = null;
let editObraSocialId = null;

function getNextId(storageKey) {
  const items = JSON.parse(localStorage.getItem(storageKey)) || [];
  if (items.length === 0) return 1;
  const maxId = items.reduce((max, item) => (item.id > max ? item.id : max), 0);
  return maxId + 1;
}

// --- FUNCIONES DE MEDICOS ---

function displayDoctors() {
  const doctors = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const obrasSociales = JSON.parse(localStorage.getItem("obras-sociales"));
  const tableBody = document.getElementById("medicos-table-body");
  tableBody.innerHTML = "";

  if (doctors && doctors.length > 0) {
    doctors.forEach((doctor) => {
      const row = document.createElement("tr");
      const osNombres = doctor.obrasSociales
        .map((id) => {
          const os = obrasSociales.find((o) => o.id === id);
          return os ? os.nombre : null;
        })
        .filter(Boolean)
        .join(", ");

      row.innerHTML = `
                <td>${doctor.id}</td>
                <td>${doctor.nombre} ${doctor.apellido}</td>
                <td>${doctor.especialidad}</td>
                <td>${doctor.matricula}</td>
                <td>$${doctor.valorConsulta}</td>
                <td>${osNombres}</td>
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

function saveDoctor(newDoctor) {
  const doctors = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  doctors.push(newDoctor);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(doctors));
}

function handleFormSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById("doctor-name");
  const lastNameInput = document.getElementById("doctor-lastname");
  const specialtyInput = document.getElementById("doctor-specialty");
  const matriculaInput = document.getElementById("doctor-matricula");
  const valorInput = document.getElementById("doctor-valor-consulta");
  const imageInput = document.getElementById("doctor-image");

  const newDoctor = {
    id: getNextId(STORAGE_KEY),
    nombre: nameInput.value,
    apellido: lastNameInput.value,
    especialidad: specialtyInput.value,
    matricula: matriculaInput.value,
    valorConsulta: valorInput.value,
    imagen: imageInput.value,
    obrasSociales: [],
  };

  saveDoctor(newDoctor);
  displayDoctors();

  const modal = document.getElementById("crearMedicoModal");
  const modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();

  event.target.reset();

  Swal.fire(
    "Médico creado correctamente",
    "El médico ha sido creado con éxito",
    "success"
  );
}

function deleteDoctor(id) {
  let doctors = JSON.parse(localStorage.getItem(STORAGE_KEY));
  doctors = doctors.filter((doctor) => doctor.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(doctors));
}

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

// --- FUNCIONES DE ESPECIALIDADES ---

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
                    <button class="btn btn-danger btn-sm delete-esp-btn" data-id="${esp.id}">Eliminar</button>
                    <button class="btn btn-warning btn-sm edit-esp-btn" data-bs-toggle="modal" data-bs-target="#editarEspecialidadModal" data-id="${esp.id}">Modificar</button>
                </td>
            `;
      tableBody.appendChild(row);
    });
  }
}

function saveEspecialidad(newEspecialidad) {
  const especialidades =
    JSON.parse(localStorage.getItem("especialidades")) || [];
  especialidades.push(newEspecialidad);
  localStorage.setItem("especialidades", JSON.stringify(especialidades));
}

function handleEspecialidadFormSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById("especialidad-name");

  const newEspecialidad = {
    id: getNextId("especialidades"),
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

function editEspecialidad(id) {
  const especialidades = JSON.parse(localStorage.getItem("especialidades"));

  const input = document.getElementById("edit-especialidad-name");

  const especialidadToEdit = especialidades.find(
    (esp) => esp.id === parseInt(id)
  );

  if (especialidadToEdit) {
    input.value = especialidadToEdit.nombre;
  }
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
  const selectEditSpecialty = document.getElementById("edit-doctor-specialty");
  selectSpecialty.innerHTML = "";
  selectEditSpecialty.innerHTML = "";

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
    selectEditSpecialty.appendChild(option.cloneNode(true));
  });
}

// --- FUNCIONES DE OBRAS SOCIALES ---

function displayObrasSociales() {
  const obrasSociales = JSON.parse(localStorage.getItem("obras-sociales"));
  const tableBody = document.getElementById("obras-sociales-table-body");
  tableBody.innerHTML = "";

  if (obrasSociales && obrasSociales.length > 0) {
    obrasSociales.forEach((os) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${os.id}</td>
                <td>${os.nombre}</td>
                <td>${os.descripcion}</td>
                <td>${(os.porcentaje * 100).toFixed(0)}%</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-os-btn" data-id="${
                      os.id
                    }">Eliminar</button>
                    <button class="btn btn-warning btn-sm edit-os-btn" data-bs-toggle="modal" data-bs-target="#editarObraSocialModal" data-id="${
                      os.id
                    }">Modificar</button>
                </td>
            `;
      tableBody.appendChild(row);
    });
  }
}

function saveObraSocial(newObraSocial) {
  const obrasSociales =
    JSON.parse(localStorage.getItem("obras-sociales")) || [];
  obrasSociales.push(newObraSocial);
  localStorage.setItem("obras-sociales", JSON.stringify(obrasSociales));
}

function handleObraSocialFormSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById("obra-social-name");
  const descInput = document.getElementById("obra-social-desc");
  const pctInput = document.getElementById("obra-social-pct");

  const newObraSocial = {
    id: getNextId("obras-sociales"),
    nombre: nameInput.value,
    descripcion: descInput.value,
    porcentaje: parseFloat(pctInput.value) / 100,
  };

  saveObraSocial(newObraSocial);
  displayObrasSociales();
  displayDoctors();

  const modal = document.getElementById("crearObraSocialModal");
  const modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();
  event.target.reset();

  Swal.fire(
    "Obra Social creada correctamente",
    "La obra social ha sido creada con éxito",
    "success"
  );
}

function deleteObraSocial(id) {
  Swal.fire({
    title: "¿Estás seguro de que quieres eliminar esta obra social?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      let obrasSociales = JSON.parse(localStorage.getItem("obras-sociales"));
      obrasSociales = obrasSociales.filter((os) => os.id !== parseInt(id));
      localStorage.setItem("obras-sociales", JSON.stringify(obrasSociales));

      displayObrasSociales();
      displayDoctors();
      Swal.fire({
        title: "Obra Social eliminada correctamente",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
}

function loadObraSocialForEditing(id) {
  const obrasSociales = JSON.parse(localStorage.getItem("obras-sociales"));
  const osToEdit = obrasSociales.find((os) => os.id === parseInt(id));

  if (osToEdit) {
    document.getElementById("edit-obra-social-name").value = osToEdit.nombre;
    document.getElementById("edit-obra-social-desc").value =
      osToEdit.descripcion;
    document.getElementById("edit-obra-social-pct").value = osToEdit.porcentaje * 100;
  }
}

function handleEditObraSocialSubmit(id) {
  const obrasSociales = JSON.parse(localStorage.getItem("obras-sociales"));
  const osIndex = obrasSociales.findIndex((os) => os.id === parseInt(id));

  if (osIndex !== -1) {
    obrasSociales[osIndex].nombre = document.getElementById(
      "edit-obra-social-name"
    ).value;
    obrasSociales[osIndex].descripcion = document.getElementById(
      "edit-obra-social-desc"
    ).value;
    obrasSociales[osIndex].porcentaje = parseFloat(
      document.getElementById("edit-obra-social-pct").value
    ) / 100;

    localStorage.setItem("obras-sociales", JSON.stringify(obrasSociales));
  }

  displayObrasSociales();
  displayDoctors();

  const modal = document.getElementById("editarObraSocialModal");
  const modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();

  Swal.fire(
    "Obra Social editada correctamente",
    "La obra social ha sido editada con éxito",
    "success"
  );
}

// --- FUNCIONES DE RESERVAS ---

function displayReservas() {
  const reservas = JSON.parse(localStorage.getItem("reservas"));
  const medicos = JSON.parse(localStorage.getItem("medicos_idw"));
  const tableBody = document.getElementById("reservas-table-body");
  tableBody.innerHTML = "";

  if (reservas && reservas.length > 0) {
    reservas.forEach((res) => {
      const medico = medicos.find((m) => m.id === res.medicoId);
      const medicoNombre = medico
        ? `${medico.nombre} ${medico.apellido}`
        : "Médico no encontrado";
      const fecha = new Date(res.fechaHora).toLocaleString("es-AR");

      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${res.id}</td>
                <td>${res.nombrePaciente}</td>
                <td>${res.documento}</td>
                <td>${medicoNombre}</td>
                <td>${fecha} hs.</td>
                <td>$${res.valorTotal.toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-res-btn" data-id="${
                      res.id
                    }">Eliminar</button>
                </td>
            `;
      tableBody.appendChild(row);
    });
  }
}

function deleteReserva(id) {
  Swal.fire({
    title: "¿Estás seguro de que quieres eliminar esta reserva?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      let reservas = JSON.parse(localStorage.getItem("reservas"));
      reservas = reservas.filter((res) => res.id !== parseInt(id));
      localStorage.setItem("reservas", JSON.stringify(reservas));

      displayReservas();
      Swal.fire({
        title: "Reserva eliminada correctamente",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
}

// --- EVENT LISTENERS ---

document.addEventListener("DOMContentLoaded", () => {
  displayDoctors();
  displayEspecialidades();
  displayObrasSociales();
  displayReservas();
  loadEspecialidadesOnSelect();
});

document.getElementById("doctor-form").addEventListener("submit", handleFormSubmit);
document.getElementById("especialidad-form").addEventListener("submit", handleEspecialidadFormSubmit);
document.getElementById("obra-social-form").addEventListener("submit", handleObraSocialFormSubmit);

document.getElementById("edit-doctor-form").addEventListener("submit", function (event) {
  event.preventDefault();
  handleEditFormSubmit(editDoctorId);
});

document.getElementById("edit-especialidad-form").addEventListener("submit", function (event) {
  event.preventDefault();
  handleEspecialidadEditFormSubmit(editEspecialidadId);
});

document.getElementById("edit-obra-social-form").addEventListener("submit", function (event) {
  event.preventDefault();
  handleEditObraSocialSubmit(editObraSocialId);
});

document.getElementById("medicos-table-body").addEventListener("click", (event) => {
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

document.getElementById("especialidades-table-body").addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-esp-btn")) {
      editEspecialidadId = event.target.getAttribute("data-id");
      editEspecialidad(editEspecialidadId);
    }
    if (event.target.classList.contains("delete-esp-btn")) {
      const espId = event.target.getAttribute("data-id");
      deleteEspecialidad(espId);
    }
});

document.getElementById("obras-sociales-table-body").addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-os-btn")) {
      editObraSocialId = event.target.getAttribute("data-id");
      loadObraSocialForEditing(editObraSocialId);
    }
    if (event.target.classList.contains("delete-os-btn")) {
      const osId = event.target.getAttribute("data-id");
      deleteObraSocial(osId);
    }
});

document.getElementById("reservas-table-body").addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-res-btn")) {
      const resId = event.target.getAttribute("data-id");
      deleteReserva(resId);
    }
});
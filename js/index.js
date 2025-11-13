const initialDoctors = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    especialidad: "Cardiología",
    imagen: "../img/doctor4.png",
    obrasSociales: [1, 3, 7],
    valorConsulta: 15000.0,
    descripcion: "Especialista en Cardiología con 12 años de experiencia.",
    matricula: 1234,
    especialidadId: 1,
    horarios: [
      { id: 1, dia: "Martes", inicio: "08:00", fin: "16:00" },
      { id: 2, dia: "Jueves", inicio: "14:00", fin: "22:00" },
    ],
  },
  {
    id: 2,
    nombre: "María",
    apellido: "Gómez",
    especialidad: "Pediatría",
    imagen: "../img/doctora1.png",
    obrasSociales: [2, 4, 5, 7],
    valorConsulta: 13500.5,
    descripcion:
      "Pediatra dedicada al cuidado infantil y seguimiento de neonatos.",
    matricula: 2187,
    especialidadId: 2,
    horarios: [
      { id: 1, dia: "Lunes", inicio: "09:00", fin: "17:00" },
      { id: 2, dia: "Miércoles", inicio: "08:00", fin: "16:00" },
      { id: 3, dia: "Viernes", inicio: "10:00", fin: "18:00" },
    ],
  },
  {
    id: 3,
    nombre: "Fátima",
    apellido: "Hernández",
    especialidad: "Neurología",
    imagen: "../img/doctora5.jpg",
    obrasSociales: [1, 2, 6],
    valorConsulta: 18000.0,
    descripcion: "Neuróloga enfocada en trastornos del movimiento y migrañas.",
    matricula: 3207,
    especialidadId: 3,
    horarios: [
      { id: 1, dia: "Martes", inicio: "12:00", fin: "20:00" },
      { id: 2, dia: "Jueves", inicio: "10:00", fin: "18:00" },
    ],
  },
  {
    id: 4,
    nombre: "Pedro",
    apellido: "Rodríguez",
    especialidad: "Traumatología",
    imagen: "../img/doctor3.jpg",
    obrasSociales: [3, 5, 6, 7],
    valorConsulta: 16200.75,
    descripcion:
      "Traumatólogo experto en lesiones deportivas y cirugía de rodilla.",
    matricula: 7950,
    especialidadId: 4,
    horarios: [
      { id: 1, dia: "Lunes", inicio: "14:00", fin: "22:00" },
      { id: 2, dia: "Miércoles", inicio: "09:00", fin: "17:00" },
      { id: 3, dia: "Viernes", inicio: "08:00", fin: "16:00" },
    ],
  },
  {
    id: 5,
    nombre: "Facundo",
    apellido: "González",
    especialidad: "Radiología",
    imagen: "../img/doctor2.png",
    obrasSociales: [1, 4, 5],
    valorConsulta: 14000.0,
    descripcion: "Radiólogo especializado en diagnósticos",
    matricula: 6541,
    especialidadId: 5,
    horarios: [
      { id: 1, dia: "Martes", inicio: "08:00", fin: "16:00" },
      { id: 2, dia: "Viernes", inicio: "12:00", fin: "20:00" },
    ],
  },
];

const especialidades = [
  {
    id: 1,
    nombre: "Cardiología",
  },
  {
    id: 2,
    nombre: "Pediatría",
  },
  {
    id: 3,
    nombre: "Neurología",
  },
  {
    id: 4,
    nombre: "Traumatología",
  },
  {
    id: 5,
    nombre: "Radiología",
  },
];

const obrasSociales = [
  {
    id: 1,
    nombre: "OSDE",
    descripcion: "Cobertura y planes ofrecidos por OSDE.",
    porcentaje: 0.4,
  },
  {
    id: 2,
    nombre: "OSECAC",
    descripcion: "Cobertura y planes ofrecidos por OSECAC.",
    porcentaje: 0.3,
  },
  {
    id: 3,
    nombre: "SWISS MEDICAL",
    descripcion: "Cobertura y planes ofrecidos por SWISS MEDICAL.",
    porcentaje: 0.5,
  },
  {
    id: 4,
    nombre: "GALENO",
    descripcion: "Cobertura y planes ofrecidos por GALENO.",
    porcentaje: 0.35,
  },
  {
    id: 5,
    nombre: "SANCOR SALUD",
    descripcion: "Cobertura y planes ofrecidos por SANCOR SALUD.",
    porcentaje: 0.25,
  },
  {
    id: 6,
    nombre: "OSPE",
    descripcion: "Cobertura y planes ofrecidos por OSPE.",
    porcentaje: 0.2,
  },
  {
    id: 7,
    nombre: "UPCN",
    descripcion: "Cobertura y planes ofrecidos por UPCN.",
    porcentaje: 0.3,
  },
];

function renderObrasSociales() {
  const pathName = window.location.pathname;
  if (pathName === "/index.html" || pathName === "/") {
    const obrasSocialesContainer = document.getElementById(
      "obras-sociales-container"
    );

    obrasSociales.forEach(({ nombre }) => {
      const obraSocialButton = document.createElement("button");
      obraSocialButton.classList.add("button");
      obraSocialButton.textContent = nombre;

      obrasSocialesContainer.appendChild(obraSocialButton);
    });
  }
}

function renderEspecialidades() {
  const pathName = window.location.pathname;
  if (pathName !== "/html/institucional.html") return;

  const especialidadesContainer = document.getElementById(
    "especialidades-container"
  );

  const especialidadesLS = JSON.parse(localStorage.getItem("especialidades"));
  especialidadesLS.forEach(({ nombre }) => {
    const especialidadButton = document.createElement("button");
    especialidadButton.classList.add("button");
    especialidadButton.classList.add("fw-bold");
    especialidadButton.textContent = nombre;

    especialidadesContainer.appendChild(especialidadButton);
  });
}

function initializeData() {
  if (!localStorage.getItem("medicos_idw")) {
    localStorage.setItem("medicos_idw", JSON.stringify(initialDoctors));
  }
  if (!localStorage.getItem("especialidades")) {
    localStorage.setItem("especialidades", JSON.stringify(especialidades));
  }
  if (!localStorage.getItem("obras-sociales")) {
    localStorage.setItem("obras-sociales", JSON.stringify(obrasSociales));
  }
}

function displayDoctors() {
  const doctors = JSON.parse(localStorage.getItem("medicos_idw"));
  const doctorsContainer = document.getElementById("doctors-container");

  if (!doctorsContainer) return;

  doctorsContainer.innerHTML = "";

  if (doctors && doctors.length > 0) {
    doctors.forEach((doctor) => {
      const card = document.createElement("div");
      card.className =
        "col-lg-3 col-md-6 col-sm-12 py-2 d-flex justify-content-center";
      card.innerHTML = `
                <div class="card" style="width: 20rem">
                    <img src="${doctor.imagen}" class="card-img-top" alt="${doctor.nombre} ${doctor.apellido}" />
                    <div class="card-body">
                        <h5 class="card-title">Dr(a). ${doctor.nombre} ${doctor.apellido}</h5>
                        <hr>
                        <p class="card-text">Especialidad: ${doctor.especialidad}</p>
                        <p class="card-text">Matrícula profesional: ${doctor.matricula}</p>
                    </div>
                </div>
            `;
      doctorsContainer.appendChild(card);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeData();
  displayDoctors();
  renderObrasSociales();
  renderEspecialidades();
});

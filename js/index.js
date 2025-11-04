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
  },
  {
    id: 2,
    nombre: "OSECAC",
    descripcion: "Cobertura y planes ofrecidos por OSECAC.",
  },
  {
    id: 3,
    nombre: "SWISS MEDICAL",
    descripcion: "Cobertura y planes ofrecidos por SWISS MEDICAL.",
  },
  {
    id: 4,
    nombre: "GALENO",
    descripcion: "Cobertura y planes ofrecidos por GALENO.",
  },
  {
    id: 5,
    nombre: "SANCOR SALUD",
    descripcion: "Cobertura y planes ofrecidos por SANCOR SALUD.",
  },
  {
    id: 6,
    nombre: "OSPE",
    descripcion: "Cobertura y planes ofrecidos por OSPE.",
  },
  {
    id: 7,
    nombre: "UPCN",
    descripcion: "Cobertura y planes ofrecidos por UPCN.",
  },
];

function renderObrasSociales() {
  const pathName = window.location.pathname;
  if (pathName === "/index.html" || pathName === "/") {
    const obrasSocialesContainer = document.getElementById(
      "obras-sociales-container"
    );

    obrasSociales.forEach(({nombre}) => {
      const obraSocialButton = document.createElement("button");
      obraSocialButton.classList.add("button");
      obraSocialButton.textContent = nombre;

      obrasSocialesContainer.appendChild(obraSocialButton);
    });
  }
}

function initializeData() {
  if (!localStorage.getItem("medicos_idw")) {
    localStorage.setItem("medicos_idw", JSON.stringify(initialDoctors));
    console.log("Datos de médicos iniciales guardados en LocalStorage.");
  }
  if (!localStorage.getItem("especialidades")) {
    localStorage.setItem("especialidades", JSON.stringify(especialidades));
    console.log("Datos de especialidades iniciales guardados en LocalStorage.");
  }
  if(!localStorage.getItem("obras-sociales")) {
    localStorage.setItem("obras-sociales", JSON.stringify(obrasSociales));
    console.log("Datos de obras sociales iniciales guardados en LocalStorage.");
  }
  console.log("Los datos de médicos ya existen en LocalStorage.");
}

function displayDoctors() {
  const doctors = JSON.parse(localStorage.getItem("medicos_idw"));
  const doctorsContainer = document.getElementById("doctors-container");

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
});

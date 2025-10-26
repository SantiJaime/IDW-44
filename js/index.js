const initialDoctors = [
  {
    id: 1,
    nombre: "Dr. Juan Pérez",
    especialidad: "Cardiología",
    imagen: "../img/doctor4.png",
  },
  {
    id: 2,
    nombre: "Dra. María Gómez",
    especialidad: "Pediatría",
    imagen: "../img/doctora1.png",
  },
  {
    id: 3,
    nombre: "Dra. Fátima Hernández",
    especialidad: "Neurología",
    imagen: "../img/doctora5.jpg",
  },
  {
    id: 4,
    nombre: "Dr. Pedro Rodríguez",
    especialidad: "Traumatología",
    imagen: "../img/doctor3.jpg",
  },
  {
    id: 5,
    nombre: "Dr. Facundo González",
    especialidad: "Radiología",
    imagen: "../img/doctor2.png",
  },
];

const obrasSociales = [
  "OSDE",
  "OSECAC",
  "SWISS MEDICAL",
  "GALEANO",
  "SANCOR SALUD",
  "OSPE",
  "UPCN",
];

function renderObrasSociales() {
  const pathName = window.location.pathname;
  if (pathName !== "/index.html") return;
  
  const obrasSocialesContainer = document.getElementById(
    "obras-sociales-container"
  );

  obrasSociales.forEach((nombreObraSocial) => {
    const obraSocialButton = document.createElement("button");
    obraSocialButton.classList.add("button");
    obraSocialButton.textContent = nombreObraSocial;

    obrasSocialesContainer.appendChild(obraSocialButton);
  });
}

function initializeData() {
  if (!localStorage.getItem("medicos_idw")) {
    localStorage.setItem("medicos_idw", JSON.stringify(initialDoctors));
    console.log("Datos de médicos iniciales guardados en LocalStorage.");
    return;
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

document.addEventListener("DOMContentLoaded", () => {
  initializeData();
  displayDoctors();
  renderObrasSociales();
});

document.addEventListener("DOMContentLoaded", () => {
  const medicos = JSON.parse(localStorage.getItem("medicos_idw"));
  const especialidades = JSON.parse(localStorage.getItem("especialidades"));
  const obrasSociales = JSON.parse(localStorage.getItem("obras-sociales"));

  const buttonCalcularMonto = document.getElementById("button-calcular-monto");
  const reservaForm = document.getElementById("reserva-form");
  const selectEspecialidad = document.getElementById("especialidad");
  const selectMedico = document.getElementById("medico");
  const selectObraSocial = document.getElementById("obra-social");
  let valorTotalDisplay = document.getElementById("valor-total-display");

  const inputNombre = document.getElementById("nombre-paciente");
  const inputDocumento = document.getElementById("documento");
  const inputFechaHora = document.getElementById("fecha-hora");

  function cargarEspecialidades() {
    especialidades.forEach((esp) => {
      const option = document.createElement("option");
      option.value = esp.id;
      option.textContent = esp.nombre;
      selectEspecialidad.appendChild(option);
    });
  }

  function cargarObrasSociales() {
    obrasSociales.forEach((os) => {
      const option = document.createElement("option");
      option.value = os.id;
      option.textContent = os.nombre;
      selectObraSocial.appendChild(option);
    });
  }

  function cargarMedicos(especialidadId) {
    selectMedico.innerHTML =
      '<option value="" disabled selected>Seleccione un médico...</option>';
    
    const medicosFiltrados = medicos.filter(
      (doc) => doc.especialidadId === parseInt(especialidadId)
    );

    if (medicosFiltrados.length > 0) {
      medicosFiltrados.forEach((doc) => {
        const option = document.createElement("option");
        option.value = doc.id;
        option.textContent = `${doc.nombre} ${doc.apellido}`;
        selectMedico.appendChild(option);
      });
      selectMedico.disabled = false;
    } else {
      selectMedico.innerHTML =
        '<option value="" disabled selected>No hay médicos para esta especialidad</option>';
      selectMedico.disabled = true;
    }
  }

  function calcularYMostrarTotal(medicoId, obraSocialId) {
    if(!medicoId || !obraSocialId){
      Swal.fire("Error", "Por favor, complete todos los campos.", "error");
      return;
    }
    const medico = medicos.find((doc) => doc.id === parseInt(medicoId));
    const medicoRecibeObraSocial = medico.obrasSociales.find((os) => os === parseInt(obraSocialId));
    
    let descuentoPct = 0;

    if (medicoRecibeObraSocial) {
      const obraSocial = obrasSociales.find((os) => os.id === parseInt(obraSocialId));
      descuentoPct = obraSocial.porcentaje;
    }
    
    const valorBase = parseFloat(medico.valorConsulta);
    const valorConDescuento = valorBase - (valorBase * descuentoPct);

    return valorConDescuento;
  }

  function saveReserva(reserva) {
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    reservas.push(reserva);
    localStorage.setItem("reservas", JSON.stringify(reservas));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const especialidadId = selectEspecialidad.value;
    const medicoId = selectMedico.value;
    const obraSocialId = selectObraSocial.value;
    const nombrePaciente = inputNombre.value;
    const documento = inputDocumento.value;
    const fechaHora = inputFechaHora.value;

    const valorTotal = calcularYMostrarTotal(medicoId, obraSocialId);

    if (
      !especialidadId ||
      !medicoId ||
      !obraSocialId ||
      !nombrePaciente ||
      !documento ||
      !fechaHora
    ) {
      Swal.fire("Error", "Por favor, complete todos los campos.", "error");
      return;
    }

    const nuevaReserva = {
      id: Date.now(),
      documento: documento,
      nombrePaciente: nombrePaciente,
      especialidadId: parseInt(especialidadId),
      medicoId: parseInt(medicoId),
      obraSocialId: parseInt(obraSocialId),
      fechaHora: fechaHora,
      valorTotal: valorTotal,
    };
    
    saveReserva(nuevaReserva);

    const medicoTexto = selectMedico.options[selectMedico.selectedIndex].text;
    const fechaFormateada = new Date(fechaHora).toLocaleString("es-AR", {
      dateStyle: "long",
      timeStyle: "short",
    });
    const valorFormateado = valorTotalDisplay.textContent;

    Swal.fire({
      title: "¡Reserva Confirmada!",
      html: `
        <b>Paciente:</b> ${nuevaReserva.nombrePaciente}<br>
        <b>Documento:</b> ${nuevaReserva.documento}<br>
        <b>Médico:</b> ${medicoTexto}<br>
        <b>Fecha:</b> ${fechaFormateada} hs.<br>
        <b>Valor total:</b> ${valorFormateado}
      `,
      icon: "success",
      confirmButtonText: "Aceptar",
    });

    reservaForm.reset();
    valorTotalDisplay.textContent = "";

    selectMedico.disabled = true;
    selectMedico.innerHTML =
      '<option value="" disabled selected>Seleccione un médico...</option>';
  }

  cargarEspecialidades();
  cargarObrasSociales();

  selectEspecialidad.addEventListener("change", () => {
    cargarMedicos(selectEspecialidad.value);
  });

  reservaForm.addEventListener("submit", handleSubmit);

  buttonCalcularMonto.addEventListener("click", () => {
    const valorTotal = calcularYMostrarTotal(selectMedico.value, selectObraSocial.value);
    if(valorTotal){
      valorTotalDisplay.textContent = `$${valorTotal.toFixed(2)}`;
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const medicos = JSON.parse(localStorage.getItem("medicos_idw"));
  const especialidades = JSON.parse(localStorage.getItem("especialidades"));
  const obrasSociales = JSON.parse(localStorage.getItem("obras-sociales"));

  const reservaForm = document.getElementById("reserva-form");
  const selectEspecialidad = document.getElementById("especialidad");
  const selectMedico = document.getElementById("medico");
  const selectObraSocial = document.getElementById("obra-social");
  const turnosContainer = document.getElementById("turnos-container");
  const buttonCalcularMonto = document.getElementById("button-calcular-monto");
  let valorTotalDisplay = document.getElementById("valor-total-display");

  const inputNombre = document.getElementById("nombre-paciente");
  const inputDocumento = document.getElementById("documento");

  let turnoSeleccionadoISO = null;
  const DURACION_TURNO = 30;
  const DIAS_A_MOSTRAR = 7;

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
    resetTurnos();
  }

  function resetTurnos() {
    turnosContainer.innerHTML =
      '<small class="text-muted">Seleccione un médico para ver sus próximos turnos disponibles...</small>';
    turnoSeleccionadoISO = null;
  }

  function parseTimeString(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return { hours, minutes };
  }

  function formatTime(dateObj) {
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function generarProximosTurnos(medicoId) {
    resetTurnos();
    turnosContainer.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div>';

    const medico = medicos.find((m) => m.id === parseInt(medicoId));
    if (!medico || !medico.horarios || medico.horarios.length === 0) {
      turnosContainer.innerHTML =
        '<small class="text-danger">Este médico no tiene horarios de atención cargados.</small>';
      return;
    }

    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    const diasSemana = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const hoy = new Date();
    let turnosEncontrados = false;
    let turnosHTML = "";

    for (let i = 0; i < DIAS_A_MOSTRAR; i++) {
      let diaActual = new Date(hoy);
      diaActual.setDate(hoy.getDate() + i);

      const nombreDia = diasSemana[diaActual.getDay()];
      const horarioMedico = medico.horarios.find((h) => h.dia === nombreDia);

      if (!horarioMedico) {
        continue;
      }

      const { hours: inicioH, minutes: inicioM } = parseTimeString(
        horarioMedico.inicio
      );
      const { hours: finH, minutes: finM } = parseTimeString(horarioMedico.fin);

      let slotTime = new Date(diaActual);
      slotTime.setHours(inicioH, inicioM, 0, 0);

      const endTime = new Date(diaActual);
      endTime.setHours(finH, finM, 0, 0);

      let slotsDelDiaHTML = "";
      let hayTurnosEnEsteDia = false;
      const ahora = new Date();

      while (slotTime < endTime) {
        if (slotTime < ahora) {
          slotTime.setMinutes(slotTime.getMinutes() + DURACION_TURNO);
          continue;
        }

        const fechaISO = slotTime.toISOString();
        const horaString = formatTime(slotTime);

        const estaReservado = reservas.some(
          (r) =>
            r.medicoId === parseInt(medicoId) && r.fechaHora === fechaISO
        );

        if (!estaReservado) {
          hayTurnosEnEsteDia = true;
          slotsDelDiaHTML += `<span class="turno-slot" data-fecha-iso="${fechaISO}">${horaString}</span>`;
        }

        slotTime.setMinutes(slotTime.getMinutes() + DURACION_TURNO);
      }

      if (hayTurnosEnEsteDia) {
        turnosEncontrados = true;
        const fechaFormateada = diaActual.toLocaleDateString("es-AR", {
          weekday: "long",
          day: "numeric",
          month: "long",
        });

        turnosHTML += `
          <div class="turno-dia-grupo">
            <h6 class="mb-2">${
              fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)
            }</h6>
            <div class="turno-slots-container">${slotsDelDiaHTML}</div>
          </div>
        `;
      }
    }

    if (!turnosEncontrados) {
      turnosContainer.innerHTML =
        '<small class="text-info">El médico no tiene más turnos disponibles en los próximos 7 días.</small>';
    } else {
      turnosContainer.innerHTML = turnosHTML;
    }
  }

  function calcularYMostrarTotal(medicoId, obraSocialId) {
    if (!medicoId || !obraSocialId) {
      return null;
    }
    const medico = medicos.find((doc) => doc.id === parseInt(medicoId));
    const medicoRecibeObraSocial = medico.obrasSociales.find(
      (os) => os === parseInt(obraSocialId)
    );

    let descuentoPct = 0;

    if (medicoRecibeObraSocial) {
      const obraSocial = obrasSociales.find(
        (os) => os.id === parseInt(obraSocialId)
      );
      descuentoPct = obraSocial.porcentaje;
    }

    const valorBase = parseFloat(medico.valorConsulta);
    const valorConDescuento = valorBase - valorBase * descuentoPct;

    return valorConDescuento;
  }

  function saveReserva(reserva) {
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    reservas.push(reserva);
    localStorage.setItem("reservas", JSON.stringify(reservas));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const medicoId = selectMedico.value;
    const obraSocialId = selectObraSocial.value;
    const nombrePaciente = inputNombre.value;
    const documento = inputDocumento.value;

    if (
      !medicoId ||
      !obraSocialId ||
      !nombrePaciente ||
      !documento ||
      !turnoSeleccionadoISO
    ) {
      Swal.fire(
        "Error",
        "Por favor, complete todos los campos y seleccione un turno disponible.",
        "error"
      );
      return;
    }

    const valorTotal = calcularYMostrarTotal(medicoId, obraSocialId);

    const nuevaReserva = {
      id: Date.now(),
      documento: documento,
      nombrePaciente: nombrePaciente,
      especialidadId: parseInt(selectEspecialidad.value),
      medicoId: parseInt(medicoId),
      obraSocialId: parseInt(obraSocialId),
      fechaHora: turnoSeleccionadoISO,
      valorTotal: valorTotal,
    };

    saveReserva(nuevaReserva);

    const medicoTexto = selectMedico.options[selectMedico.selectedIndex].text;
    const fechaFormateada = new Date(turnoSeleccionadoISO).toLocaleString(
      "es-AR",
      {
        dateStyle: "long",
        timeStyle: "short",
      }
    );

    Swal.fire({
      title: "¡Reserva Confirmada!",
      html: `
        <b>Paciente:</b> ${nuevaReserva.nombrePaciente}<br>
        <b>Documento:</b> ${nuevaReserva.documento}<br>
        <b>Médico:</b> ${medicoTexto}<br>
        <b>Fecha:</b> ${fechaFormateada} hs.<br>
        <b>Valor total:</b> ${valorTotalDisplay.textContent}
      `,
      icon: "success",
      confirmButtonText: "Aceptar",
    });
    
    valorTotalDisplay.textContent = "";
    turnoSeleccionadoISO = null;
    
    generarProximosTurnos(medicoId);
  }

  cargarEspecialidades();
  cargarObrasSociales();

  selectEspecialidad.addEventListener("change", () => {
    cargarMedicos(selectEspecialidad.value);
  });

  selectMedico.addEventListener("change", () => {
    generarProximosTurnos(selectMedico.value);
  });

  turnosContainer.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("turno-slot") &&
      !e.target.classList.contains("disabled")
    ) {
      document
        .querySelectorAll(".turno-slot.selected")
        .forEach((el) => el.classList.remove("selected"));
      e.target.classList.add("selected");
      turnoSeleccionadoISO = e.target.dataset.fechaIso;
    }
  });

  reservaForm.addEventListener("submit", handleSubmit);

  buttonCalcularMonto.addEventListener("click", () => {
    const valorTotal = calcularYMostrarTotal(
      selectMedico.value,
      selectObraSocial.value
    );
    if (valorTotal !== null) {
      valorTotalDisplay.textContent = `$${valorTotal.toFixed(2)}`;
    } else {
      Swal.fire(
        "Error",
        "Seleccione médico y obra social para calcular.",
        "error"
      );
    }
  });

  window.addEventListener('storage', (event) => {
    if (event.key === 'reservas' && selectMedico.value) {
      console.log('Reservas actualizadas desde otra pestaña. Recargando turnos...');
      generarProximosTurnos(selectMedico.value);
    }
  });
  
});
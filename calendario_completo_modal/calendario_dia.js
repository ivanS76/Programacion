document.addEventListener("DOMContentLoaded", function () {
  const dayView = document.getElementById("day-view");
  const currentDayTitle = document.getElementById("current-day-title");
  const fechaInput = document.getElementById("fecha");
  const form = document.getElementById("turnoForm");
  const eliminarBtn = document.getElementById("eliminarTurnoBtn");
  const cancelarBtn = document.getElementById("cancelarBtn");
  const turnoModal = document.getElementById("turnoModal");
  const confirmDeleteModal = document.getElementById("confirmDeleteModal");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

  let fechaActual;
  let turnoAEliminarId = null;

  const urlParams = new URLSearchParams(window.location.search);
  fechaActual = urlParams.get("fecha");

  if (!fechaActual) {
    alert("Fecha no especificada");
    return;
  }

  fechaInput.value = fechaActual;
  currentDayTitle.textContent = `Turnos para ${fechaActual}`;
  renderDay();

  function getTurnos() {
    const data = localStorage.getItem("turnos");
    return data ? JSON.parse(data) : [];
  }

  function guardarTurnos(turnos) {
    localStorage.setItem("turnos", JSON.stringify(turnos));
  }

  function renderDay() {
    dayView.innerHTML = "";
    const turnos = getTurnos().filter((t) => t.fecha === fechaActual);

    for (let h = 0; h < 24; h++) {
      const hourLabel = document.createElement("div");
      hourLabel.className = "hour-label";
      hourLabel.textContent = `${String(h).padStart(2, "0")}:00`;

      const slot = document.createElement("div");
      slot.className = "hour-slot";

      turnos
        .filter((t) => parseInt(t.hora_inicio.split(":")[0]) === h)
        .forEach((t) => {
          const turnoDiv = document.createElement("div");
          turnoDiv.className = "turno";
          turnoDiv.textContent = `${t.hora_inicio} - ${t.hora_fin} | ${t.descripcion}`;
          turnoDiv.onclick = (e) => {
            e.stopPropagation();
            abrirModal(t);
          };
          slot.appendChild(turnoDiv);
        });

      slot.addEventListener("click", () => {
        abrirModal({
          fecha: fechaActual,
          hora_inicio: `${String(h).padStart(2, "0")}:00`,
          hora_fin: "",
          descripcion: "",
          id: "",
        });
      });

      dayView.appendChild(hourLabel);
      dayView.appendChild(slot);
    }
  }

  function abrirModal(turno = {}) {
    turnoModal.style.display = "flex";
    document.getElementById("modal-title").textContent = turno.id
      ? "Editar Turno"
      : "Nuevo Turno";
    fechaInput.value = turno.fecha || fechaActual;
    document.getElementById("hora_inicio").value = turno.hora_inicio || "";
    document.getElementById("hora_fin").value = turno.hora_fin || "";
    document.getElementById("descripcion").value = turno.descripcion || "";
    document.getElementById("turno_id").value = turno.id || "";

    eliminarBtn.style.display = turno.id ? "inline-block" : "none";
  }

  function cerrarModal() {
    turnoModal.style.display = "none";
    form.reset();
    eliminarBtn.style.display = "none";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const turno = {
      id: document.getElementById("turno_id").value || Date.now().toString(),
      fecha: fechaInput.value,
      hora_inicio: document.getElementById("hora_inicio").value,
      hora_fin: document.getElementById("hora_fin").value,
      descripcion: document.getElementById("descripcion").value,
    };

    let turnos = getTurnos();
    const index = turnos.findIndex((t) => t.id === turno.id);

    if (index >= 0) {
      turnos[index] = turno;
    } else {
      turnos.push(turno);
    }

    guardarTurnos(turnos);
    cerrarModal();
    renderDay();
  });

  eliminarBtn.addEventListener("click", () => {
    // Abrir modal de confirmación de eliminación
    turnoAEliminarId = document.getElementById("turno_id").value;
    confirmDeleteModal.style.display = "flex";
  });

  cancelDeleteBtn.addEventListener("click", () => {
    confirmDeleteModal.style.display = "none";
    turnoAEliminarId = null;
  });

  confirmDeleteBtn.addEventListener("click", () => {
    if (turnoAEliminarId) {
      let turnos = getTurnos().filter((t) => t.id !== turnoAEliminarId);
      guardarTurnos(turnos);
      confirmDeleteModal.style.display = "none";
      turnoAEliminarId = null;
      cerrarModal();
      renderDay();
    }
  });

  cancelarBtn.addEventListener("click", cerrarModal);

  window.cambiarDia = function (offset) {
    const fechaObj = new Date(fechaActual);
    fechaObj.setDate(fechaObj.getDate() + offset);
    const nuevaFecha = fechaObj.toISOString().slice(0, 10);
    window.location.href = `calendario_dia.html?fecha=${nuevaFecha}`;
  };

  window.volver = function () {
    window.location.href = "calendario_demo.html";
  };
});

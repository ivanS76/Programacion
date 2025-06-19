document.addEventListener("DOMContentLoaded", function () {
    const vistaDia = document.getElementById("day-view");
    const tituloDia = document.getElementById("current-day-title");
    const entradaFecha = document.getElementById("fecha");
    const formulario = document.getElementById("turnoForm");
    const botonEliminar = document.getElementById("eliminarTurnoBtn");
    const botonCancelar = document.getElementById("cancelarBtn");
    const modalTurno = document.getElementById("turnoModal");
    const modalConfirmarEliminacion = document.getElementById("confirmDeleteModal");
    const botonConfirmarEliminar = document.getElementById("confirmDeleteBtn");
    const botonCancelarEliminar = document.getElementById("cancelDeleteBtn");

    let fechaActual;
    let turnoIdAEliminar = null;

    const parametrosURL = new URLSearchParams(window.location.search);
    fechaActual = parametrosURL.get("fecha");

    if (!fechaActual) {
        alert("Fecha no especificada");
        return;
    }

    entradaFecha.value = fechaActual;
    tituloDia.textContent = `Turnos para ${fechaActual}`;
    mostrarTurnosDelDia();

    function obtenerTurnos() {
        const datos = localStorage.getItem("turnos");
        return datos ? JSON.parse(datos) : [];
    }

    function guardarTurnos(turnos) {
        localStorage.setItem("turnos", JSON.stringify(turnos));
    }

    function mostrarTurnosDelDia() {
        vistaDia.innerHTML = "";
        const turnosDelDia = obtenerTurnos().filter((t) => t.fecha === fechaActual);

        for (let h = 0; h < 24; h++) {
            const etiquetaHora = document.createElement("div");
            etiquetaHora.className = "hour-label";
            etiquetaHora.textContent = `${String(h).padStart(2, "0")}:00`;

            const franjaHora = document.createElement("div");
            franjaHora.className = "hour-slot";

            turnosDelDia
                .filter((t) => parseInt(t.hora_inicio.split(":")[0]) === h)
                .forEach((t) => {
                    const divTurno = document.createElement("div");
                    divTurno.className = "turno";
                    divTurno.textContent = `${t.hora_inicio} - ${t.hora_fin} | ${t.descripcion}`;
                    divTurno.onclick = (e) => {
                        e.stopPropagation();
                        abrirModal(t);
                    };
                    franjaHora.appendChild(divTurno);
                });

            franjaHora.addEventListener("click", () => {
                abrirModal({
                    fecha: fechaActual,
                    hora_inicio: `${String(h).padStart(2, "0")}:00`,
                    hora_fin: "",
                    descripcion: "",
                    id: "",
                });
            });

            vistaDia.appendChild(etiquetaHora);
            vistaDia.appendChild(franjaHora);
        }
    }

    function abrirModal(turno = {}) {
        modalTurno.style.display = "flex";
        document.getElementById("modal-title").textContent = turno.id ? "Editar Turno" : "Nuevo Turno";
        entradaFecha.value = turno.fecha || fechaActual;
        document.getElementById("hora_inicio").value = turno.hora_inicio || "";
        document.getElementById("hora_fin").value = turno.hora_fin || "";
        document.getElementById("descripcion").value = turno.descripcion || "";
        document.getElementById("turno_id").value = turno.id || "";

        botonEliminar.style.display = turno.id ? "inline-block" : "none";
    }

    function cerrarModal() {
        modalTurno.style.display = "none";
        formulario.reset();
        botonEliminar.style.display = "none";
    }

    formulario.addEventListener("submit", function (e) {
        e.preventDefault();
        const turno = {
            id: document.getElementById("turno_id").value || Date.now().toString(),
            fecha: entradaFecha.value,
            hora_inicio: document.getElementById("hora_inicio").value,
            hora_fin: document.getElementById("hora_fin").value,
            descripcion: document.getElementById("descripcion").value,
        };

        let turnos = obtenerTurnos();
        const indice = turnos.findIndex((t) => t.id === turno.id);

        if (indice >= 0) {
            turnos[indice] = turno;
        } else {
            turnos.push(turno);
        }

        guardarTurnos(turnos);
        cerrarModal();
        mostrarTurnosDelDia();
    });

    botonEliminar.addEventListener("click", () => {
        turnoIdAEliminar = document.getElementById("turno_id").value;
        modalConfirmarEliminacion.style.display = "flex";
    });

    botonCancelarEliminar.addEventListener("click", () => {
        modalConfirmarEliminacion.style.display = "none";
        turnoIdAEliminar = null;
    });

    botonConfirmarEliminar.addEventListener("click", () => {
        if (turnoIdAEliminar) {
            let turnos = obtenerTurnos().filter((t) => t.id !== turnoIdAEliminar);
            guardarTurnos(turnos);
            modalConfirmarEliminacion.style.display = "none";
            turnoIdAEliminar = null;
            cerrarModal();
            mostrarTurnosDelDia();
        }
    });

    botonCancelar.addEventListener("click", cerrarModal);

    window.cambiarDia = function (offset) {
        const fechaObj = new Date(fechaActual);
        fechaObj.setDate(fechaObj.getDate() + offset);
        const nuevaFecha = fechaObj.toISOString().slice(0, 10);
        window.location.href = `calendario_dia.html?fecha=${nuevaFecha}`;
    };

    window.volver = function () {
        window.location.href = "calendario_mes.html";
    };
});

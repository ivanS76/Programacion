document.addEventListener("DOMContentLoaded", function () {
    const vistaMes = document.getElementById("month-view");
    const encabezadoMes = document.getElementById("current-month-year");
    let fechaActual = new Date();

    function obtenerTurnos() {
        return JSON.parse(localStorage.getItem("turnos")) || [];
    }

    function mostrarCalendario() {
        vistaMes.innerHTML = "";

        const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
        diasSemana.forEach(dia => {
            const encabezado = document.createElement("div");
            encabezado.className = "weekday-header";
            encabezado.textContent = dia;
            vistaMes.appendChild(encabezado);
        });

        const anio = fechaActual.getFullYear();
        const mes = fechaActual.getMonth();
        const primerDiaSemana = new Date(anio, mes, 1).getDay();
        const diasDelMes = new Date(anio, mes + 1, 0).getDate();

        for (let i = 0; i < primerDiaSemana; i++) {
            const vacio = document.createElement("div");
            vistaMes.appendChild(vacio);
        }

        const turnos = obtenerTurnos();

        for (let dia = 1; dia <= diasDelMes; dia++) {
            const celda = document.createElement("div");
            celda.className = "calendar-day";
            celda.textContent = dia;

            const fechaTexto = `${anio}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

            turnos
                .filter((t) => t.fecha === fechaTexto)
                .forEach((t) => {
                    const divTurno = document.createElement("div");
                    divTurno.className = "turno";
                    divTurno.textContent = `${t.hora_inicio} ${t.descripcion}`;
                    celda.appendChild(divTurno);
                });

            celda.addEventListener("click", () => {
                window.location.href = `calendario_dia.html?fecha=${fechaTexto}`;
            });

            vistaMes.appendChild(celda);
        }

        const opciones = {
            month: "long",
            year: "numeric"
        };

        // "junio de 2025" → "JUNIO 2025"
        const titulo = fechaActual.toLocaleDateString("es-ES", opciones);
        encabezadoMes.textContent = titulo.replace(" de ", " ").toUpperCase();
    }

    document.getElementById("hoy-btn").addEventListener("click", () => {
        fechaActual = new Date();
        mostrarCalendario();
    });

    document.getElementById("anterior-btn").addEventListener("click", () => {
        fechaActual.setMonth(fechaActual.getMonth() - 1);
        mostrarCalendario();
    });

    document.getElementById("siguiente-btn").addEventListener("click", () => {
        fechaActual.setMonth(fechaActual.getMonth() + 1);
        mostrarCalendario();
    });

    mostrarCalendario();
});

document.addEventListener("DOMContentLoaded", function () {
  const monthView = document.getElementById("month-view");
  const currentMonthYear = document.getElementById("current-month-year");
  let currentDate = new Date();

  function getTurnos() {
    return JSON.parse(localStorage.getItem("turnos")) || [];
  }

  function renderCalendar() {
    monthView.innerHTML = "";
    const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    weekDays.forEach(dia => {
      const header = document.createElement("div");
      header.className = "weekday-header";
      header.textContent = dia;
      monthView.appendChild(header);
    });

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement("div");
      monthView.appendChild(empty);
    }

    const turnos = getTurnos();

    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("div");
      cell.className = "calendar-day";
      cell.textContent = day;

      const fechaStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      turnos
        .filter((t) => t.fecha === fechaStr)
        .forEach((t) => {
          const div = document.createElement("div");
          div.className = "turno";
          div.textContent = `${t.hora_inicio} ${t.descripcion}`;
          cell.appendChild(div);
        });

      cell.addEventListener("click", () => {
        window.location.href = `calendario_dia.html?fecha=${fechaStr}`;
      });

      monthView.appendChild(cell);
    }

    const opciones = { month: "long", year: "numeric" };
    currentMonthYear.textContent = currentDate.toLocaleDateString("es-ES", opciones);
  }

  document.getElementById("today-btn").addEventListener("click", () => {
    currentDate = new Date();
    renderCalendar();
  });

  document.getElementById("prev-btn").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  renderCalendar();
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formPaciente");
  const nombreInput = document.getElementById("nombre");
  const apellidoInput = document.getElementById("apellido");
  const dniInput = document.getElementById("dni");
  const tabla = document.getElementById("tablaPacientes");

  let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
  let editandoIndex = null;

  function renderTabla() {
    tabla.innerHTML = "";
    pacientes.forEach((paciente, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${paciente.nombre}</td>
        <td>${paciente.apellido}</td>
        <td>${paciente.dni}</td>
        <td>
          <button onclick="editarPaciente(${index})">Editar</button>
          <button onclick="eliminarPaciente(${index})">Eliminar</button>
        </td>
      `;
      tabla.appendChild(fila);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = nombreInput.value.trim();
    const apellido = apellidoInput.value.trim();
    const dni = dniInput.value.trim();

    // Validaciones
    if (!nombre || !apellido || !dni) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!soloLetras.test(nombre)) {
      alert("El nombre solo puede contener letras.");
      return;
    }

    if (!soloLetras.test(apellido)) {
      alert("El apellido solo puede contener letras.");
      return;
    }

    const soloNumeros = /^\d{7,8}$/;
    if (!soloNumeros.test(dni)) {
      alert("El DNI debe contener solo números (7 u 8 dígitos).");
      return;
    }

    const nuevoPaciente = { nombre, apellido, dni };

    if (editandoIndex === null) {
      pacientes.push(nuevoPaciente);
    } else {
      pacientes[editandoIndex] = nuevoPaciente;
      editandoIndex = null;
    }

    localStorage.setItem("pacientes", JSON.stringify(pacientes));
    form.reset();
    renderTabla();
  });

  window.editarPaciente = (index) => {
    const paciente = pacientes[index];
    nombreInput.value = paciente.nombre;
    apellidoInput.value = paciente.apellido;
    dniInput.value = paciente.dni;
    editandoIndex = index;
  };

  window.eliminarPaciente = (index) => {
    if (confirm("¿Estás seguro de eliminar este paciente?")) {
      pacientes.splice(index, 1);
      localStorage.setItem("pacientes", JSON.stringify(pacientes));
      renderTabla();
    }
  };

  renderTabla();
});

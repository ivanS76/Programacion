// Crear dientes dinámicamente
function crearFila(idContenedor, inicio, fin) {
  const contenedor = document.getElementById(idContenedor);
  const paso = inicio < fin ? 1 : -1;

  for (let i = inicio; paso > 0 ? i <= fin : i >= fin; i += paso) {
    const diente = document.createElement("div");
    diente.className = "diente";

    const numero = document.createElement("div");
    numero.className = "numero";
    numero.textContent = i;
    diente.appendChild(numero);

    const caras = [
      { clase: "vestibular" },
      { clase: "lingual" },
      { clase: "mesial" },
      { clase: "distal" },
      { clase: "oclusal" }
    ];

   caras.forEach(c => {
  const div = document.createElement("div");
  div.className = `cara ${c.clase}`;

  // Alterna los colores al hacer clic
  div.addEventListener("click", () => {
    if (div.classList.contains("azul")) {
      div.classList.remove("azul");
      div.classList.add("rojo");
    } else if (div.classList.contains("rojo")) {
      div.classList.remove("rojo");
    } else {
      div.classList.add("azul");
    }
  });

  diente.appendChild(div);
});


    contenedor.appendChild(diente);
  }
}

// Crear las filas del odontograma
crearFila("fila-superior", 18, 11);
crearFila("fila-superior", 21, 28);
crearFila("fila-inferior", 48, 41);
crearFila("fila-inferior", 31, 38);

// Mostrar datos del paciente
const form = document.getElementById("formularioPaciente");
const datosDiv = document.getElementById("datosPaciente");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const dni = document.getElementById("dni").value;

  document.getElementById("mostrarNombre").textContent = nombre;
  document.getElementById("mostrarApellido").textContent = apellido;
  document.getElementById("mostrarDni").textContent = dni;

  

  localStorage.setItem("paciente", JSON.stringify({ nombre, apellido, dni }));
});

// Mostrar al recargar si hay datos guardados
window.addEventListener("DOMContentLoaded", () => {
  const guardado = localStorage.getItem("paciente");
  if (guardado) {
    const { nombre, apellido, dni } = JSON.parse(guardado);
    document.getElementById("mostrarNombre").textContent = nombre;
    document.getElementById("mostrarApellido").textContent = apellido;
    document.getElementById("mostrarDni").textContent = dni;
    datosDiv.style.display = "block";
  }
});
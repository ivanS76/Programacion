let selectedRow = null;

const selectHora = document.getElementById('turnoHora');
let choicesHora = null; 

function generarOpcionesHora() {
   
    while (selectHora.options.length > 1) {
        selectHora.remove(1);
    }

    for (let hora = 14; hora <= 21; hora++) {
        const minutosPermitidos = (hora === 21) ? [0] : [0, 15, 30, 45];
        for (let minuto of minutosPermitidos) {
            const horaStr = hora.toString().padStart(2, '0');
            const minutoStr = minuto.toString().padStart(2, '0');
            const opcion = document.createElement('option');
            opcion.value = `${horaStr}:${minutoStr}`;
            opcion.textContent = `${horaStr}:${minutoStr}`;
            selectHora.appendChild(opcion);
        }
    }

  
    if (choicesHora) {
        choicesHora.destroy();
    }
    choicesHora = new Choices(selectHora, {
        shouldSort: false,
        searchEnabled: false,
        itemSelectText: '',
    });

    
    selectHora.choicesInstance = choicesHora;
}

document.getElementById("formTurno").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = leerDatos();

    if (!formData.dni || !formData.paciente || !formData.fecha || !formData.hora) {
        mostrarAlerta("Por favor, complete todos los campos obligatorios: DNI, Nombre, Fecha y Hora.", "danger");
        return;
    }

    if (!/^\d{1,11}$/.test(formData.dni)) {
        mostrarAlerta("El DNI debe contener solo números y tener hasta 11 dígitos.", "danger");
        return;
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.paciente)) {
        mostrarAlerta("El nombre solo puede contener letras y espacios. No se permiten números ni caracteres especiales.", "danger");
        return;
    }

    if (turnoYaExiste(formData.fecha, formData.hora)) {
        mostrarAlerta("Turno ya reservado, intente nuevamente.", "warning");
        return;
    }

    if (selectedRow === null) {
        insertarNuevo(formData);
        mostrarAlerta("Turno agregado correctamente.", "success");
    } else {
        actualizarRegistro(formData);
        mostrarAlerta("Turno actualizado correctamente.", "warning");
    }

    guardarTurnosEnLocalStorage();
    resetFormulario();
});

function leerDatos() {
    return {
        dni: document.getElementById("turnoDNI").value.trim(),
        paciente: document.getElementById("turnoPaciente").value.trim(),
        fecha: document.getElementById("turnoFecha").value.trim(),
        hora: document.getElementById("turnoHora").value.trim(),
        estado: document.getElementById("turnoEstado").value.trim()
    };
}

function turnoYaExiste(fecha, hora) {
    const filas = document.querySelectorAll("#storeList tbody tr");
    for (let fila of filas) {
        const fechaExistente = fila.cells[2].innerText;
        const horaExistente = fila.cells[3].innerText;

        if (selectedRow && fila === selectedRow) continue;

        if (fechaExistente === fecha && horaExistente === hora) {
            return true;
        }
    }
    return false;
}

function insertarNuevo(data) {
    const tabla = document.querySelector("#storeList tbody");
    const nuevaFila = tabla.insertRow();

    const celdaDNI = nuevaFila.insertCell(0);
    celdaDNI.setAttribute("data-label", "DNI");
    celdaDNI.innerHTML = data.dni;

    const celdaPaciente = nuevaFila.insertCell(1);
    celdaPaciente.setAttribute("data-label", "Nombre");
    celdaPaciente.innerHTML = data.paciente;

    const celdaFecha = nuevaFila.insertCell(2);
    celdaFecha.setAttribute("data-label", "Fecha");
    celdaFecha.innerHTML = data.fecha;

    const celdaHora = nuevaFila.insertCell(3);
    celdaHora.setAttribute("data-label", "Hora");
    celdaHora.innerHTML = data.hora;

    const celdaEstado = nuevaFila.insertCell(4);
    celdaEstado.setAttribute("data-label", "Estado");
    celdaEstado.innerHTML = data.estado;

    const celdaAcciones = nuevaFila.insertCell(5);
    celdaAcciones.setAttribute("data-label", "Acciones");
    celdaAcciones.innerHTML = `
        <button onclick="editarTurno(this)" class="btn btn-warning btn-sm me-1">Editar</button>
        <button onclick="eliminarTurno(this)" class="btn btn-danger btn-sm">Eliminar</button>
    `;
}

function editarTurno(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("turnoDNI").value = selectedRow.cells[0].innerHTML;
    document.getElementById("turnoPaciente").value = selectedRow.cells[1].innerHTML;
    document.getElementById("turnoFecha").value = selectedRow.cells[2].innerHTML;
    document.getElementById("turnoHora").value = selectedRow.cells[3].innerHTML;
    document.getElementById("turnoEstado").value = selectedRow.cells[4].innerHTML;

    if (selectHora.choicesInstance) {
        selectHora.choicesInstance.setChoiceByValue(selectedRow.cells[3].innerHTML);
    }
}

function actualizarRegistro(data) {
    if (turnoYaExiste(data.fecha, data.hora)) {
        mostrarAlerta("Fecha y hora de turno reservado por otro paciente.", "danger");
        return;
    }

    selectedRow.cells[0].setAttribute("data-label", "DNI");
    selectedRow.cells[0].innerHTML = data.dni;

    selectedRow.cells[1].setAttribute("data-label", "Nombre");
    selectedRow.cells[1].innerHTML = data.paciente;

    selectedRow.cells[2].setAttribute("data-label", "Fecha");
    selectedRow.cells[2].innerHTML = data.fecha;

    selectedRow.cells[3].setAttribute("data-label", "Hora");
    selectedRow.cells[3].innerHTML = data.hora;

    selectedRow.cells[4].setAttribute("data-label", "Estado");
    selectedRow.cells[4].innerHTML = data.estado;

    selectedRow.cells[5].setAttribute("data-label", "Acciones");

    selectedRow = null;
}

function eliminarTurno(td) {
    const fila = td.parentElement.parentElement;
    const modalEl = document.getElementById('modalConfirmacion');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    const btnAceptar = document.getElementById('btnAceptar');
    const btnCancelar = document.getElementById('btnCancelar');

    const nuevoAceptar = btnAceptar.cloneNode(true);
    const nuevoCancelar = btnCancelar.cloneNode(true);

    btnAceptar.parentNode.replaceChild(nuevoAceptar, btnAceptar);
    btnCancelar.parentNode.replaceChild(nuevoCancelar, btnCancelar);

    nuevoAceptar.addEventListener('click', () => {
        document.getElementById("storeList").deleteRow(fila.rowIndex);
        guardarTurnosEnLocalStorage();
        resetFormulario();
        mostrarAlerta("Turno eliminado correctamente.", "danger");
        modal.hide();
    });

    nuevoCancelar.addEventListener('click', () => {
        modal.hide();
    });
}

function resetFormulario() {
    document.getElementById("formTurno").reset();
    selectedRow = null;

    
    if (selectHora.choicesInstance) {
        selectHora.choicesInstance.setChoiceByValue('');
    }
}

function guardarTurnosEnLocalStorage() {
    const filas = document.querySelectorAll("#storeList tbody tr");
    const turnos = [];

    filas.forEach(fila => {
        const turno = {
            dni: fila.cells[0].innerText,
            paciente: fila.cells[1].innerText,
            fecha: fila.cells[2].innerText,
            hora: fila.cells[3].innerText,
            estado: fila.cells[4].innerText
        };
        turnos.push(turno);
    });

    localStorage.setItem("turnosGuardados", JSON.stringify(turnos));
}

function cargarTurnosDesdeLocalStorage() {
    const datos = JSON.parse(localStorage.getItem("turnosGuardados") || "[]");
    datos.forEach(turno => insertarNuevo(turno));
}

function mostrarAlerta(mensaje, tipo) {
    const alerta = document.getElementById("alertaTurno");
    alerta.textContent = mensaje;
    alerta.className = "alert";
    alerta.classList.add(`alert-${tipo}`);
    alerta.classList.remove("d-none");

    setTimeout(() => {
        alerta.classList.add("d-none");
    }, 3500);
}


window.addEventListener("load", () => {
    generarOpcionesHora();
    cargarTurnosDesdeLocalStorage();
});


document.addEventListener("DOMContentLoaded", () => {
    const btnLimpiar = document.getElementById("btnLimpiar");

    btnLimpiar.addEventListener("click", () => {
        selectHora.selectedIndex = 0;

        if (selectHora.choicesInstance) {
            selectHora.choicesInstance.setChoiceByValue('');
        }
    });
});

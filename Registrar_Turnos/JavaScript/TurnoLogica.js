let selectedRow = null;

document.getElementById("formTurno").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = leerDatos();

    
    if (!formData.dni || !formData.paciente || !formData.fecha || !formData.hora) {
        alert("Por favor, complete todos los campos obligatorios: DNI, Nombre, Fecha y Hora.");
        return;
    }

    
    if (!/^\d{1,11}$/.test(formData.dni)) {
        alert("El DNI debe contener solo números y tener hasta 11 dígitos.");
        return;
    }

    
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.paciente)) {
        alert("El nombre solo puede contener letras y espacios. No se permiten números ni caracteres especiales.");
        return;
    }

    
    if (turnoYaExiste(formData.fecha, formData.hora)) {
        alert("Turno ya reservado, intente nuevamente.");
        return;
    }

    if (selectedRow === null) {
        insertarNuevo(formData);
    } else {
        actualizarRegistro(formData);
    }

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
}

function actualizarRegistro(data) {
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
    if (confirm("¿Deseas eliminar este turno?")) {
        const fila = td.parentElement.parentElement;
        document.getElementById("storeList").deleteRow(fila.rowIndex);
        resetFormulario();
    }
}

function resetFormulario() {
    document.getElementById("formTurno").reset();
    selectedRow = null;
}

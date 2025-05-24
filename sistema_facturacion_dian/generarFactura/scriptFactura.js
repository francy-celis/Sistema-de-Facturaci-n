// scriptFactura.js

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar con un producto vacío
  agregarProducto();
});

// Mostrar u ocultar campo dirección
function toggleDireccion() {
  const checkbox = document.getElementById('requiereEnvio');
  const campoDireccion = document.getElementById('campoDireccion');

  if (checkbox.checked) {
    campoDireccion.classList.add('show');
    campoDireccion.classList.remove('hidden');
  } else {
    campoDireccion.classList.remove('show');
    campoDireccion.classList.add('hidden');
    document.getElementById('direccion').value = '';
  }
}

// Agregar una nueva fila producto
function agregarProducto() {
  const tbody = document.querySelector('#tablaProductos tbody');
  const tr = document.createElement('tr');

  tr.innerHTML = `
  <td><input type="text" class="descripcion" placeholder="Nombre o descripción" required></td>
  <td><input type="number" class="cantidad" value="1" min="1" required></td>
  <td><input type="number" class="precio" value="0" min="0" step="0.01" required></td>
  <td class="subtotal">0.00</td>
  <td>
    <button type="button" class="btn-eliminar" aria-label="Eliminar producto" title="Eliminar producto" onclick="eliminarFila(this)">
      🗑
    </button>
  </td>
`;


  tbody.appendChild(tr);

  // Agregar eventos para recalcular
  const cantidadInput = tr.querySelector('.cantidad');
  const precioInput = tr.querySelector('.precio');

  cantidadInput.addEventListener('input', actualizarTotales);
  precioInput.addEventListener('input', actualizarTotales);

  actualizarTotales();
}

// Eliminar fila producto con confirmación
function eliminarFila(boton) {
  if (confirm('¿Seguro que desea eliminar este producto?')) {
    const fila = boton.closest('tr');
    fila.remove();
    actualizarTotales();
  }
}

// Calcular totales
function actualizarTotales() {
  const filas = document.querySelectorAll('#tablaProductos tbody tr');
  let subtotal = 0;

  filas.forEach(fila => {
    const cantidad = parseFloat(fila.querySelector('.cantidad').value) || 0;
    const precio = parseFloat(fila.querySelector('.precio').value) || 0;
    const totalFila = cantidad * precio;

    fila.querySelector('.subtotal').textContent = totalFila.toFixed(2);
    subtotal += totalFila;
  });

  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  document.getElementById('subtotal').textContent = subtotal.toFixed(2);
  document.getElementById('iva').textContent = iva.toFixed(2);
  document.getElementById('total').textContent = total.toFixed(2);
}

// Validar formulario básico antes de generar QR
function validarDatos() {
  const numFactura = document.getElementById('numFactura').value.trim();
  const empresa = document.getElementById('empresa').value.trim();
  const nit = document.getElementById('nit').value.trim();
  const cliente = document.getElementById('cliente').value.trim();

  if (!numFactura) {
    alert('Por favor, ingrese el número de factura.');
    return false;
  }
  if (!empresa) {
    alert('Por favor, ingrese la razón social o empresa.');
    return false;
  }
  if (!nit) {
    alert('Por favor, ingrese el NIT.');
    return false;
  }
  if (!cliente) {
    alert('Por favor, ingrese el nombre del cliente.');
    return false;
  }

  // Validar que haya al menos un producto con descripción
  const descripciones = document.querySelectorAll('.descripcion');
  let tieneProductoValido = false;
  descripciones.forEach(input => {
    if (input.value.trim() !== '') tieneProductoValido = true;
  });

  if (!tieneProductoValido) {
    alert('Por favor, agregue al menos un producto o servicio con descripción.');
    return false;
  }

  return true;
}

// Generar código QR con resumen mínimo
function generarQR() {
  if (!validarDatos()) return;

  const numFactura = document.getElementById('numFactura').value.trim();
  const empresa = document.getElementById('empresa').value.trim();
  const nit = document.getElementById('nit').value.trim();
  const cliente = document.getElementById('cliente').value.trim();
  const total = document.getElementById('total').textContent;

  const qrData = `Factura: ${numFactura}\nEmpresa: ${empresa}\nNIT: ${nit}\nCliente: ${cliente}\nTotal: $${total}`;

  const qr = new QRious({
    element: document.getElementById('codigoQR'),
    value: qrData,
    size: 200,
  });
}

function notacredito() {
  location.href = "nota_credito.html";
}


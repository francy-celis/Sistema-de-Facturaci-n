function agregarProducto() {
  const tbody = document.querySelector("#tablaProductos tbody");
  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td><input type="text" placeholder="Ej: Consultoría QR"></td>
    <td><input type="number" value="1" min="1" onchange="actualizarTotales()"></td>
    <td><input type="number" value="0" min="0" onchange="actualizarTotales()"></td>
    <td class="subtotal">$0</td>
    <td><button onclick="eliminarFila(this)">🗑️</button></td>
  `;

  tbody.appendChild(fila);
  actualizarTotales();
}

function eliminarFila(btn) {
  btn.closest("tr").remove();
  actualizarTotales();
}

function actualizarTotales() {
  const filas = document.querySelectorAll("#tablaProductos tbody tr");
  let suma = 0;

  filas.forEach(fila => {
    const cantidad = parseInt(fila.cells[1].querySelector("input").value);
    const precio = parseFloat(fila.cells[2].querySelector("input").value);
    const subtotal = cantidad * precio;
    fila.cells[3].textContent = "$" + subtotal.toFixed(2);
    suma += subtotal;
  });

  const iva = suma * 0.19;
  const total = suma + iva;

  document.getElementById("subtotal").textContent = suma.toFixed(2);
  document.getElementById("iva").textContent = iva.toFixed(2);
  document.getElementById("total").textContent = total.toFixed(2);
}

function generarQR() {
  const num = document.getElementById("numFactura").value;
  const fecha = document.getElementById("fechaFactura").value;
  const empresa = document.getElementById("empresa").value;
  const nit = document.getElementById("nit").value;
  const cliente = document.getElementById("cliente").value;
  const total = document.getElementById("total").textContent;
  const metodo = document.getElementById("metodoPago").value;

  if (!num || !fecha || !empresa || !cliente || !nit) {
    alert("Completa todos los datos obligatorios antes de generar el QR.");
    return;
  }

  const contenidoQR = `Factura No: ${num}\nFecha: ${fecha}\nEmpresa: ${empresa}\nNIT: ${nit}\nCliente: ${cliente}\nMétodo de pago: ${metodo}\nTotal: $${total}`;

  new QRious({
    element: document.getElementById("codigoQR"),
    value: contenidoQR,
    size: 200
  });
}




// otro escript
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login");

  form.addEventListener("submit", async (e) => {

    
    e.preventDefault(); // Evita envío por defecto

    const usuario = document.getElementById("usuario").value;
    const contrasenia = document.getElementById("password").value;

    try {
      const response = await fetch("https://pru.clarisacloud.com:8443/seguridad/rest/api/v1/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuario: usuario,
          contrasenia: contrasenia
        })
      });

      const data = await response.json();

      if (response.ok && data.success === true) {
          const token = localStorage.getItem("token");
           if (!token) {
             alert("No hay token de sesión. Redirigiendo al login...");
              location.href = "login.html"; // vuelve al login
                }
        alert("Login exitoso: " + data.textResponse);
        localStorage.setItem("token", token); // Opcional: guardar token
        location.href = "factura.html";   // Redirige a siguiente página
      } else {
        alert("Error: " + data.textResponse);
      }

    } catch (error) {
      console.error("Error al conectar con la API:", error);
      alert("No se pudo conectar al servidor.");
    }


    
  });
});

function notacredito(){

location.href = "nota_credito.html";

}


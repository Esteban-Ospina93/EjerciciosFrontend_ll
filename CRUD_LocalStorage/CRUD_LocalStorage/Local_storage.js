document.addEventListener("DOMContentLoaded", () => {
  const d = document;
  const clienteInput = d.querySelector(".cliente");
  const productoInput = d.querySelector(".producto");
  const precioInput = d.querySelector(".precio");
  const imagenInput = d.querySelector(".imagen");
  const observacionInput = d.querySelector(".observacion");
  const btnGuardar = d.querySelector(".btn-guardar");
  const tabla = d.querySelector(".table > tbody");
  const filtroClienteInput = d.querySelector(".filtro-cliente");
  const btnBuscar = d.querySelector(".btn-buscar");
  const btnLimpiar = d.querySelector(".btn-limpiar");
  const listadoPedidos = "Pedidos";

  btnGuardar.addEventListener("click", () => {
    let datos = validarFormulario();
    if (datos) {
      guardarDatos(datos);
      borrarTabla();
      mostrarDatos();
    }
  });

  function validarFormulario() {
    if (!clienteInput.value || !productoInput.value || !precioInput.value || !imagenInput.value) {
      alert("Todos los campos son obligatorios");
      return null;
    }

    const datos = {
      cliente: clienteInput.value,
      producto: productoInput.value,
      precio: precioInput.value,
      imagen: imagenInput.value,
      observacion: observacionInput.value
    };

    clienteInput.value = productoInput.value = precioInput.value = imagenInput.value = observacionInput.value = "";
    return datos;
  }

  function guardarDatos(datos) {
    let pedidos = JSON.parse(localStorage.getItem(listadoPedidos)) || [];
    pedidos.push(datos);
    localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));
    alert("Datos guardados correctamente");
  }

  function mostrarDatos() {
    let pedidos = JSON.parse(localStorage.getItem(listadoPedidos)) || [];
    pedidos.forEach((p, i) => {
      let fila = d.createElement("tr");
      fila.innerHTML = `
        <td>${i + 1}</td>
        <td>${p.cliente}</td>
        <td>${p.producto}</td>
        <td>${p.precio}</td>
        <td><img src="${p.imagen}" width="50%"></td>
        <td>${p.observacion}</td>
        <td>
          <button onclick="actualizarPedido(${i})" class="btn btn-warning">📃</button>
          <button onclick="eliminarPedido(${i})" class="btn btn-danger">✖</button>
        </td>
      `;
      tabla.appendChild(fila);
    });
  }

  function borrarTabla() {
    tabla.innerHTML = "";
  }

  window.eliminarPedido = (pos) => {
    let pedidos = JSON.parse(localStorage.getItem(listadoPedidos)) || [];
    if (confirm("¿Eliminar pedido de " + pedidos[pos].cliente + "?")) {
      pedidos.splice(pos, 1);
      localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));
      borrarTabla();
      mostrarDatos();
    }
  };

  window.actualizarPedido = (pos) => {
    let pedidos = JSON.parse(localStorage.getItem(listadoPedidos)) || [];
    let p = pedidos[pos];
    clienteInput.value = p.cliente;
    productoInput.value = p.producto;
    precioInput.value = p.precio;
    observacionInput.value = p.observacion;

    const btnActualizar = d.querySelector(".btn-actualizar");
    btnActualizar.classList.remove("d-none");
    btnGuardar.classList.add("d-none");

    btnActualizar.onclick = () => {
      p.cliente = clienteInput.value;
      p.producto = productoInput.value;
      p.precio = precioInput.value;
      p.observacion = observacionInput.value;

      localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));
      alert("Pedido actualizado");

      clienteInput.value = productoInput.value = precioInput.value = observacionInput.value = "";
      btnActualizar.classList.add("d-none");
      btnGuardar.classList.remove("d-none");

      borrarTabla();
      mostrarDatos();
    };
  };

  function filtrarPedidos() {
    let filtro = filtroClienteInput.value.toLowerCase().trim();
    borrarTabla();
    let pedidos = JSON.parse(localStorage.getItem(listadoPedidos)) || [];
    pedidos
      .filter(p => p.cliente.toLowerCase().includes(filtro))
      .forEach((p, i) => {
        let fila = d.createElement("tr");
        fila.innerHTML = `
          <td>${i + 1}</td>
          <td>${p.cliente}</td>
          <td>${p.producto}</td>
          <td>${p.precio}</td>
          <td><img src="${p.imagen}" width="50%"></td>
          <td>${p.observacion}</td>
          <td>
            <button onclick="actualizarPedido(${i})" class="btn btn-warning">📃</button>
            <button onclick="eliminarPedido(${i})" class="btn btn-danger">✖</button>
          </td>
        `;
        tabla.appendChild(fila);
      });
  }

  btnBuscar.addEventListener("click", filtrarPedidos);
  filtroClienteInput.addEventListener("input", filtrarPedidos);
  btnLimpiar.addEventListener("click", () => {
    filtroClienteInput.value = "";
    borrarTabla();
    mostrarDatos();
  });
});
const API_CLIENTES = '/api/clientes';
const API_PRODUCTOS = '/api/productos';
const API_VENTAS = '/api/ventas';

let productos = [];
let carrito = [];

const moneda = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0
});

const mensaje = document.querySelector('#mensaje');

function mostrarMensaje(texto, esError = false) {
  mensaje.textContent = texto;
  mensaje.className = `message${esError ? ' error' : ''}`;
  mensaje.style.display = 'block';
  setTimeout(() => mensaje.style.display = 'none', 3500);
}

async function cargarDatosIniciales() {
  const [clientesRes, productosRes] = await Promise.all([
    fetch(API_CLIENTES),
    fetch(API_PRODUCTOS)
  ]);

  const clientes = await clientesRes.json();
  productos = await productosRes.json();

  document.querySelector('#cliente').innerHTML = `
    <option value="">Seleccione...</option>
    ${clientes.map(c => `<option value="${c.id_cliente}">${c.nombre} ${c.apellido}</option>`).join('')}
  `;

  document.querySelector('#producto').innerHTML = `
    <option value="">Seleccione...</option>
    ${productos.map(p => `<option value="${p.id_producto}">${p.nombre} — stock: ${p.stock}</option>`).join('')}
  `;
}

function renderCarrito() {
  const tbody = document.querySelector('#carritoBody');

  tbody.innerHTML = carrito.map((item, index) => `
    <tr>
      <td>${item.nombre}</td>
      <td>${item.cantidad}</td>
      <td>${moneda.format(item.precio)}</td>
      <td>${moneda.format(item.precio * item.cantidad)}</td>
      <td><button class="btn-danger btn-small" onclick="quitarProducto(${index})">Quitar</button></td>
    </tr>
  `).join('');

  const total = carrito.reduce((acum, item) => acum + item.precio * item.cantidad, 0);
  document.querySelector('#totalActual').textContent = moneda.format(total);
}

document.querySelector('#agregarProducto').addEventListener('click', () => {
  const idProducto = Number(document.querySelector('#producto').value);
  const cantidad = Number(document.querySelector('#cantidad').value);
  const producto = productos.find(p => p.id_producto === idProducto);

  if (!producto || !Number.isInteger(cantidad) || cantidad <= 0) {
    return mostrarMensaje('Seleccione un producto y una cantidad válida.', true);
  }

  if (cantidad > producto.stock) {
    return mostrarMensaje('La cantidad supera el stock disponible.', true);
  }

  const existente = carrito.find(item => item.id_producto === idProducto);

  if (existente) {
    if (existente.cantidad + cantidad > producto.stock) {
      return mostrarMensaje('La cantidad acumulada supera el stock.', true);
    }
    existente.cantidad += cantidad;
  } else {
    carrito.push({
      id_producto: producto.id_producto,
      nombre: producto.nombre,
      precio: Number(producto.precio),
      cantidad
    });
  }

  renderCarrito();
});

function quitarProducto(index) {
  carrito.splice(index, 1);
  renderCarrito();
}

document.querySelector('#guardarVenta').addEventListener('click', async () => {
  const id_cliente = Number(document.querySelector('#cliente').value);

  if (!id_cliente || carrito.length === 0) {
    return mostrarMensaje('Seleccione cliente y agregue productos.', true);
  }

  const payload = {
    id_cliente,
    detalles: carrito.map(item => ({
      id_producto: item.id_producto,
      cantidad: item.cantidad
    }))
  };

  const response = await fetch(API_VENTAS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    return mostrarMensaje(data.mensaje || 'No fue posible registrar la venta.', true);
  }

  mostrarMensaje(data.mensaje);
  carrito = [];
  renderCarrito();
  await cargarDatosIniciales();
  await cargarVentas();
});

async function cargarVentas() {
  const response = await fetch(API_VENTAS);
  const ventas = await response.json();

  document.querySelector('#ventasBody').innerHTML = ventas.map(venta => `
    <tr>
      <td>${venta.id_venta}</td>
      <td>${String(venta.fecha).slice(0, 10)}</td>
      <td>${venta.cliente}</td>
      <td>${moneda.format(venta.total)}</td>
      <td><button class="btn-secondary btn-small" onclick="verDetalle(${venta.id_venta})">Ver detalle</button></td>
    </tr>
  `).join('');
}

async function verDetalle(id) {
  const response = await fetch(`${API_VENTAS}/${id}`);
  const venta = await response.json();

  document.querySelector('#detalleContenido').innerHTML = `
    <p><strong>Venta:</strong> #${venta.id_venta}</p>
    <p><strong>Cliente:</strong> ${venta.cliente}</p>
    <p><strong>Fecha:</strong> ${String(venta.fecha).slice(0, 10)}</p>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr></thead>
        <tbody>
          ${venta.detalles.map(d => `
            <tr>
              <td>${d.producto}</td>
              <td>${d.cantidad}</td>
              <td>${moneda.format(d.precio_unitario)}</td>
              <td>${moneda.format(d.subtotal)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <p class="total">Total: ${moneda.format(venta.total)}</p>
  `;

  document.querySelector('#detalleModal').classList.add('open');
}

document.querySelector('#cerrarModal').addEventListener('click', () => {
  document.querySelector('#detalleModal').classList.remove('open');
});

async function iniciar() {
  await cargarDatosIniciales();
  await cargarVentas();
  renderCarrito();
}

iniciar();

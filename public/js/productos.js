const API_PRODUCTOS = '/api/productos';
const API_CATEGORIAS = '/api/categorias';

async function cargarCategorias() {
  const response = await fetch(API_CATEGORIAS);
  const categorias = await response.json();

  document.querySelector('#id_categoria').innerHTML = `
    <option value="">Seleccione...</option>
    ${categorias.map(c =>
      `<option value="${c.id_categoria}">${c.nombre}</option>`
    ).join('')}
  `;
}

async function cargarProductos() {
  const response = await fetch(API_PRODUCTOS);
  const productos = await response.json();

  document.querySelector('#productosBody').innerHTML = productos.map(p => `
    <tr>
      <td>${p.id_producto}</td>
      <td>${p.nombre}</td>
      <td>${p.categoria}</td>
      <td>${p.precio}</td>
      <td>${p.stock}</td>
      <td>
         <button onclick="editarProducto(${p.id_producto})">Editar</button>
         <button onclick="eliminarProducto(${p.id_producto})">Eliminar</button>
      </td>
                                      
    </tr>
  `).join('');
}
async function editarProducto(id) {
  const response = await fetch(`${API_PRODUCTOS}/${id}`);
  const producto = await response.json();

  document.querySelector('#id_producto').value = producto.id_producto;
  document.querySelector('#nombre').value = producto.nombre;
  document.querySelector('#precio').value = producto.precio;
  document.querySelector('#stock').value = producto.stock;
  document.querySelector('#id_categoria').value = producto.id_categoria;
}

async function eliminarProducto(id) {
  if (!confirm('¿Está seguro de eliminar este producto?')) return;

  const response = await fetch(`${API_PRODUCTOS}/${id}`, {
    method: 'DELETE'
  });

  const data = await response.json();
  document.querySelector('#mensaje').textContent = data.mensaje;

  if (response.ok) {
    await cargarProductos();
  }
}

const form = document.querySelector('#productoForm');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const producto = {
    nombre: document.querySelector('#nombre').value.trim(),
    precio: Number(document.querySelector('#precio').value),
    stock: Number(document.querySelector('#stock').value),
    id_categoria: Number(document.querySelector('#id_categoria').value)
  };

  const id = document.querySelector('#id_producto').value;

 const response = await fetch(
  id ? `${API_PRODUCTOS}/${id}` : API_PRODUCTOS,
  {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto)
  }
 );


 

  const data = await response.json();

  if (!response.ok) {
    document.querySelector('#mensaje').textContent = data.mensaje;
    return;
  }

  document.querySelector('#mensaje').textContent = data.mensaje;
  form.reset();
  await cargarProductos();
});


cargarCategorias();
cargarProductos();


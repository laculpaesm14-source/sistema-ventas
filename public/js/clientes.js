const API_CLIENTES = '/api/clientes';

async function cargarClientes() {
  const response = await apiFetch(API_CLIENTES);
  const clientes = await response.json();

  document.querySelector('#clientesBody').innerHTML = clientes.map(c => `
    <tr>
      <td>${c.id_cliente}</td>
      <td>${c.nombre}</td>
      <td>${c.apellido}</td>
      <td>${c.correo}</td>
      <td>${c.telefono}</td>
      <td>
         <button onclick="editarCliente(${c.id_cliente})">Editar</button>
         <button data-roles="dueño administrador" onclick="eliminarCliente(${c.id_cliente})">Eliminar</button>
      </td>
                                      
    </tr>
  `).join('');
  aplicarPermisos();
}
async function editarCliente(id) {
  const response = await apiFetch(`${API_CLIENTES}/${id}`);
  const cliente = await response.json();

  document.querySelector('#id_cliente').value = cliente.id_cliente;
  document.querySelector('#nombre').value = cliente.nombre;
  document.querySelector('#apellido').value = cliente.apellido;
  document.querySelector('#correo').value = cliente.correo;
  document.querySelector('#telefono').value =cliente.telefono;
}

async function eliminarCliente(id) {
  if (!confirm('¿Está seguro de eliminar este cliente?')) return;

  const response = await apiFetch(`${API_CLIENTES}/${id}`, {
    method: 'DELETE'
  });

  const data = await response.json();
  document.querySelector('#mensaje').textContent = data.mensaje;

  if (response.ok) {
    await cargarClientes();
  }
}

const form = document.querySelector('#clienteForm');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const cliente = {
    nombre: document.querySelector('#nombre').value.trim(),
    apellido: document.querySelector('#apellido').value.trim(),
    correo: document.querySelector('#correo').value.trim(),
    telefono: document.querySelector('#telefono').value.trim()
  };

  const id = document.querySelector('#id_cliente').value;

 const response = await apiFetch(
  id ? `${API_CLIENTES}/${id}` : API_CLIENTES,
  {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cliente)
  }
 );

  const data = await response.json();

  if (!response.ok) {
    document.querySelector('#mensaje').textContent = data.mensaje;
    return;
  }

  document.querySelector('#mensaje').textContent = data.mensaje;
  form.reset();
  await cargarClientes();
});

cargarClientes();

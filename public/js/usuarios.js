const API_USUARIOS = '/api/usuarios';
const formulario = document.querySelector('#usuarioForm');
const mensaje = document.querySelector('#mensaje');

function mostrarMensaje(texto, esError = false) {
  mensaje.textContent = texto;
  mensaje.className = `message${esError ? ' error' : ''}`;
  mensaje.style.display = 'block';
  setTimeout(() => mensaje.style.display = 'none', 3500);
}

async function cargarUsuarios() {
  const response = await fetch(API_USUARIOS);
  const usuarios = await response.json();

  if (!response.ok) {
    return mostrarMensaje(usuarios.mensaje || 'No fue posible cargar usuarios.', true);
  }

  document.querySelector('#usuariosBody').innerHTML = usuarios.map((usuario) => `
    <tr>
      <td>${usuario.id_usuario}</td>
      <td>${usuario.nombre}</td>
      <td>${usuario.correo}</td>
      <td>${usuario.rol}</td>
      <td>${usuario.activo ? 'Activo' : 'Inactivo'}</td>
    </tr>
  `).join('');
}

formulario.addEventListener('submit', async (event) => {
  event.preventDefault();

  const usuario = {
    nombre: document.querySelector('#nombre').value.trim(),
    correo: document.querySelector('#correo').value.trim(),
    contrasena: document.querySelector('#contrasena').value,
    rol: document.querySelector('#rol').value
  };

  const response = await fetch(API_USUARIOS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  });
  const data = await response.json();

  if (!response.ok) {
    return mostrarMensaje(data.mensaje || 'No fue posible crear el usuario.', true);
  }

  formulario.reset();
  mostrarMensaje(data.mensaje);
  await cargarUsuarios();
});

cargarUsuarios();

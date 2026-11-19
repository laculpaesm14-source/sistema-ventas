const formularioUsuario = document.querySelector('#usuarioForm');
const mensajeUsuario = document.querySelector('#mensaje');

async function cargarUsuarios() {
  const response = await apiFetch('/api/usuarios');
  const usuarios = await response.json();
  if (!response.ok) {
    mensajeUsuario.textContent = usuarios.mensaje || 'No se pudieron cargar los usuarios.';
    mensajeUsuario.classList.add('error');
    mensajeUsuario.style.display = 'block';
    return;
  }

  document.querySelector('#usuariosBody').innerHTML = usuarios.map(usuario => `
    <tr>
      <td>${usuario.nombre}</td>
      <td>${usuario.correo}</td>
      <td>${usuario.rol}</td>
      <td>${usuario.activo ? 'Sí' : 'No'}</td>
    </tr>
  `).join('');
}

formularioUsuario.addEventListener('submit', async (event) => {
  event.preventDefault();
  const usuario = {
    nombre: document.querySelector('#nombre').value.trim(),
    correo: document.querySelector('#correo').value.trim(),
    contrasena: document.querySelector('#contrasena').value,
    rol: document.querySelector('#rol').value
  };

  const response = await apiFetch('/api/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  });
  const data = await response.json();
  mensajeUsuario.textContent = data.mensaje;
  mensajeUsuario.classList.toggle('error', !response.ok);
  mensajeUsuario.style.display = 'block';

  if (response.ok) {
    formularioUsuario.reset();
    await cargarUsuarios();
  }
});

cargarUsuarios();
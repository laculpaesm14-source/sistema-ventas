const tokenSesion = localStorage.getItem('token');
const rolSesion = localStorage.getItem('rol');
const nombreSesion = localStorage.getItem('usuario');

function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('rol');
  localStorage.removeItem('usuario');
  window.location.href = 'login.html';
}

if (!tokenSesion || !rolSesion) {
  cerrarSesion();
} else {
  const rolesPagina = document.body.dataset.pageRoles;
  if (rolesPagina && !rolesPagina.split(' ').includes(rolSesion)) {
    window.location.href = 'index.html';
  }

  const nombreElemento = document.querySelector('#nombreUsuario');
  if (nombreElemento) {
    nombreElemento.textContent = `${nombreSesion} (${rolSesion})`;
  }

  const botonSalir = document.querySelector('#cerrarSesion');
  if (botonSalir) {
    botonSalir.addEventListener('click', cerrarSesion);
  }
}

function aplicarPermisos() {
  document.querySelectorAll('[data-roles]').forEach((elemento) => {
    const roles = elemento.dataset.roles.split(' ');
    elemento.hidden = !roles.includes(rolSesion);
  });
}

aplicarPermisos();

async function apiFetch(url, opciones = {}) {
  const headers = new Headers(opciones.headers || {});
  headers.set('Authorization', `Bearer ${tokenSesion}`);
  const response = await fetch(url, { ...opciones, headers });

  if (response.status === 401) {
    cerrarSesion();
  }
  return response;
}

window.apiFetch = apiFetch;
window.aplicarPermisos = aplicarPermisos;
window.rolSesion = rolSesion;
const token = localStorage.getItem('token');
const usuario = localStorage.getItem('usuario');
const rol = localStorage.getItem('rol');

if (!token) {
  window.location.href = 'login.html';
} else {
  window.sesionActual = { token, usuario, rol };
  window.encabezadosAutorizados = (extra = {}) => ({
    ...extra,
    Authorization: `Bearer ${token}`
  });

  const fetchOriginal = window.fetch.bind(window);
  window.fetch = (url, opciones = {}) => {
    const encabezados = new Headers(opciones.headers || {});
    encabezados.set('Authorization', `Bearer ${token}`);
    return fetchOriginal(url, { ...opciones, headers: encabezados });
  };

  document.querySelectorAll('[data-roles]').forEach((elemento) => {
    const rolesPermitidos = elemento.dataset.roles.split(' ');
    if (!rolesPermitidos.includes(rol)) elemento.remove();
  });

  const aplicarRoles = (contenedor) => {
    contenedor.querySelectorAll?.('[data-roles]').forEach((elemento) => {
      const rolesPermitidos = elemento.dataset.roles.split(' ');
      if (!rolesPermitidos.includes(rol)) elemento.remove();
    });
  };

  aplicarRoles(document);
  const observador = new MutationObserver((mutaciones) => {
    mutaciones.forEach((mutacion) => {
      mutacion.addedNodes.forEach((nodo) => {
        if (nodo.nodeType === 1) aplicarRoles(nodo);
      });
    });
  });
  observador.observe(document.body, { childList: true, subtree: true });

  const usuarioActual = document.querySelector('#usuarioActual');
  if (usuarioActual) {
    usuarioActual.textContent = `${usuario} - ${rol}`;
  }

  const cerrarSesion = document.querySelector('#cerrarSesion');
  if (cerrarSesion) {
    cerrarSesion.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = 'login.html';
    });
  }
}

const formularioLogin = document.querySelector('#loginForm');
const mensajeLogin = document.querySelector('#mensaje');

if (localStorage.getItem('token')) {
  window.location.href = 'index.html';
}

formularioLogin.addEventListener('submit', async (event) => {
  event.preventDefault();
  mensajeLogin.style.display = 'none';

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        correo: document.querySelector('#correo').value.trim(),
        contrasena: document.querySelector('#contrasena').value
      })
    });
    const data = await response.json();

    if (!response.ok) {
      mensajeLogin.textContent = data.mensaje || 'No se pudo iniciar sesión.';
      mensajeLogin.classList.add('error');
      mensajeLogin.style.display = 'block';
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', data.usuario.nombre);
    localStorage.setItem('rol', data.usuario.rol);
    window.location.href = 'index.html';
  } catch (error) {
    mensajeLogin.textContent = 'No se pudo conectar con el servidor.';
    mensajeLogin.classList.add('error');
    mensajeLogin.style.display = 'block';
  }
});
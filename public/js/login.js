const loginForm = document.querySelector('#loginForm');
const mensaje = document.querySelector('#mensaje');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const datos = {
    correo: document.querySelector('#correo').value.trim(),
    contrasena: document.querySelector('#contrasena').value
  };

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    const data = await response.json();

    if (!response.ok) {
      mensaje.style.display = 'block';
      mensaje.className = 'message error';
      mensaje.textContent = data.mensaje;
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', data.usuario.nombre);
    localStorage.setItem('rol', data.usuario.rol);
    window.location.href = 'index.html';
  } catch (error) {
    mensaje.style.display = 'block';
    mensaje.className = 'message error';
    mensaje.textContent = 'No fue posible iniciar sesión.';
  }
});

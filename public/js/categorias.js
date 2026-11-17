const API_CATEGORIAS = '/api/categorias';
const formulario = document.querySelector('#categoriaForm');
const tbody = document.querySelector('#categoriasBody');
const mensaje = document.querySelector('#mensaje ');

function mostrarMensaje(texto, esError = false) {
  mensaje.textContent = texto;
  mensaje.className = "mensaje ${esError ? 'error' : ''}";
  mensaje.style.display = 'block';
  setTimeout(() => mensaje.style.display = 'none', 3000);
}


async function cargarCategorias() {
  const response = await fetch(API_CATEGORIAS);
  const categorias = await response.json();

  tbody.innerHTML = categorias.map(categoria => `
    <tr>
      <td>${categoria.id_categoria}</td>
      <td>${categoria.nombre}</td>
      <td>${categoria.descripcion}</td>
    </tr>
  `).join('');
}

formulario.addEventListener('submit', async (event) => {
  event.preventDefault();
  const categoria = {
    nombre: document.querySelector('#nombre').value.trim(),
    descripcion: document.querySelector('#descripcion').value.trim()
  };

  try {
    const response = await fetch(API_CATEGORIAS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoria)
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensaje || 'No se pudo guardar la categoría.');
    }

    formulario.reset();
    await cargarCategorias();
    mostrarMensaje(data.mensaje || 'Categoría guardada correctamente.');
  } catch (error) {
    mostrarMensaje(error.message, true);
  }
});

cargarCategorias();

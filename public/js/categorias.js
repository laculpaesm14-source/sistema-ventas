const API_CATEGORIAS = '/api/categorias';
const form = document.querySelector('#categoriaForm');
const tbody = document.querySelector('#categoriasBody');
const mensaje = document.querySelector('#mensaje');

function mostrarMensaje(texto, esError = false){
    mensaje.textContent = texto;
    mensaje.className = `message${esError ? ' error' : ''}`;
    mensaje.style.display = 'block';
    setTimeout(() => mensaje.style.display = 'none', 3000);
}

async function cargarCategorias() {
    const response = await apiFetch(API_CATEGORIAS);
    const categorias = await response.json();

    tbody.innerHTML = categorias.map(categoria => `
        <tr>
            <td>${categoria.id_categoria}</td>
            <td>${categoria.nombre}</td>
            <td>${categoria.descripcion || ''}</td>
        </tr>
    `).join('');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const categoria = {
    nombre: document.querySelector('#nombre').value.trim(),
    descripcion: document.querySelector('#descripcion').value.trim()
  };

  const response = await apiFetch(API_CATEGORIAS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoria)
  });

  const data = await response.json();

  if (!response.ok) {
    return mostrarMensaje(data.mensaje || 'No fue posible guardar.', true);
  }

  mostrarMensaje(data.mensaje);
  form.reset();
  cargarCategorias();
});

cargarCategorias();
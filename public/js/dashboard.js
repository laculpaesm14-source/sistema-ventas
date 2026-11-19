const moneda =new Intl.NumberFormat('es-CO',{
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
});

async function cargarDashboard() {
    try { 
        const [clientesRes, productosRes,ventasRes] = await Promise.all([
            apiFetch('/api/clientes'),
            apiFetch('/api/productos'),
            apiFetch('/api/ventas')

        ]);
        const clientes = await clientesRes.json();
        const productos = await productosRes.json();
        const ventas = await ventasRes.json();

        document.querySelector('#totalClientes').textContent = clientes.length;
        document.querySelector('#totalProductos').textContent = productos.length;
        document.querySelector('#totalVentas').textContent = ventas.length;

        const total = ventas.reduce((acum, venta) => acum + Number(venta.total), 0);
        document.querySelector('#dineroVendido').textContent = moneda.format(total);

    }catch (error){
        console.error(error);
    }
}

cargarDashboard();
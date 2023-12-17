window.onload = () => {
    const { createApp } = Vue;

createApp({
    data() {
        return {
            listaProductos: [],      // Lista de productos obtenidos de la API
            listaCategorias: [],     // Lista de categorías obtenidas de la API
            mostrarIndex: true,      // Variable para mostrar la sección de inicio
            mostrarProductos: false, // Variable para mostrar la sección de productos
            mostrarDetalle: false,   // Variable para mostrar la sección de detalles de producto
            mostrarCarrito: false,   // Variable para mostrar la sección del carrito
            detalle: "",             // Detalles de un producto específico
            cantidadesComprar: 1,    // Cantidad de productos para comprar
            listaCarrito: [],        // Lista de productos en el carrito
            productosCarrito: [],    // Detalles de productos en el carrito
            dineroTotal: 0,          // Precio total del carrito
            tituloCategoria: ""      // Título de la categoría actual
        };
    },
    // Métodos del componente
    methods: {
        // Muestra la sección de productos de una categoría específica
        mostrarCategorias(enlace) {
            this.mostrarIndex = false;
            this.mostrarProductos = true;
            this.mostrarCarrito = false;
            this.mostrarDetalle = false;
            this.tituloCategoria = enlace; // Actualiza el título de la categoría
            // Realiza la llamada a la API para obtener los productos de la categoría
            fetch('https://fakestoreapi.com/products/category/' + enlace)
            .then(res => res.json())
            .then(json => {
                this.listaProductos = json;
            });
        },
        // Obtiene la lista de categorías al cargar la página
        categorias() {
            fetch("https://fakestoreapi.com/products/categories")
            .then(respuesta => respuesta.json())
            .then(json => {
                this.listaCategorias = json;
            });
        },
        // Muestra la sección de inicio
        verIndex() {
            this.mostrarIndex = true;
            this.mostrarProductos = false;
            this.mostrarDetalle = false;
            this.mostrarCarrito = false;
        },
        // Muestra los detalles de un producto específico
        verDetalles(id) {
            this.mostrarIndex = false;
            this.mostrarProductos = false;
            this.mostrarDetalle = true;
            this.mostrarCarrito = false;
            this.cantidadesComprar = 1;

            // Realiza la llamada a la API para obtener los detalles del producto
            fetch('https://fakestoreapi.com/products/' + id)
            .then(res => res.json())
            .then(json => {
                this.detalle = json;
            });
        },
        // Muestra la sección del carrito y realiza el cálculo total
        verCarrito() {
            this.mostrarIndex = false;
            this.mostrarProductos = false;
            this.mostrarDetalle = false;
            this.mostrarCarrito = true;
            this.carrito();                // Actualiza los productos en el carrito
            this.calcularTotalCarrito();   // Calcula el precio total del carrito
        },
        // Incrementa la cantidad de productos para comprar
        sumarCarrito() {
            this.cantidadesComprar++;
        },
        // Decrementa la cantidad de productos para comprar (si es mayor que 1)
        restarCarrito() {
            if (this.cantidadesComprar > 1) {
                this.cantidadesComprar--;
            }
        },
        // Añade un producto al carrito
        añadirCarrito(id) {
            let existe = false;
            // Verifica si el producto ya está en el carrito
            this.listaCarrito.forEach(element => {
                if (element[0] == id) {
                    element[1] += this.cantidadesComprar;
                    existe = true;
                }
            });

            if (!existe) {
                this.listaCarrito.push([id, this.cantidadesComprar]);
            }
        },
        // Obtiene los detalles de los productos en el carrito
        carrito() {
            this.productosCarrito = [];
            this.listaCarrito.forEach(element => {
                // Realiza la llamada a la API para obtener los detalles del producto
                fetch('https://fakestoreapi.com/products/' + element[0])
                .then(res => res.json())
                .then(json => {
                    this.productosCarrito.push([json, element[1]]);
                });
            });
        },
        // Incrementa la cantidad de un producto en el carrito
        sumarCarritoTotal(id) {
            this.productosCarrito.forEach(element => {
                if (element[0].id == id) {
                    element[1]++;
                }
            });
        },
        // Decrementa la cantidad de un producto en el carrito (si es mayor que 1)
        restarCarritoTotal(id) {
            this.productosCarrito.forEach(element => {
                if (element[0].id == id) {
                    if (element[1] > 1) {
                        element[1]--;
                    }
                }
            });
        },
        // Elimina un producto del carrito
        eliminarProductoCarrito(id) {
            const index = this.productosCarrito.findIndex(element => element[0].id === id);
            this.productosCarrito.splice(index, 1);
            this.listaCarrito.splice(index, 1);
        },
        // Calcula el precio total del carrito
        calcularTotalCarrito() {
            // Inicializamos dineroTotal a 0 antes de realizar la suma
            this.dineroTotal = 0;
            
            // Iteramos sobre los productos en el carrito
            this.productosCarrito.forEach(element => {
                for (i = 0; i < element[1]; i++) {
                    this.dineroTotal += element[0].precio; // Suma el precio del producto según su cantidad
                }
            });
            console.log("Dinero total final:", this.dineroTotal);
        }
    },
    mounted() {
        this.categorias();
    }
}).mount('#app');
};

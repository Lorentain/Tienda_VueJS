window.onload = () => {
    const { createApp } = Vue;

createApp({
    data() {
        return {
            listaProductos: [],
            listaCategorias: [],
            mostrarIndex: true,
            mostrarProductos: false,
            mostrarDetalle: false,
            mostrarCarrito: false,
            detalle: "",
            cantidadesComprar: 1,
            listaCarrito: [],
            productosCarrito: [],
            dineroTotal: 0
        };
    },
    methods: {
        mostrarCategorias(enlace) {
            this.mostrarIndex = false;
            this.mostrarProductos = true;
            this.mostrarCarrito = false;
            this.mostrarDetalle = false;
            fetch('https://fakestoreapi.com/products/category/' + enlace)
            .then(res=>res.json())
            .then(json=>{
                this.listaProductos = json;
            });
        },
        categorias() {
            fetch("https://fakestoreapi.com/products/categories")
            .then(respuesta => respuesta.json())
            .then(json => {
                this.listaCategorias = json;
            });
        },
        verIndex() {
            this.mostrarIndex = true;
            this.mostrarProductos = false;
            this.mostrarDetalle = false;
            this.mostrarCarrito = false;
        },
        verDetalles(id) {
            this.mostrarIndex = false;
            this.mostrarProductos = false;
            this.mostrarDetalle = true;
            this.mostrarCarrito = false;
            this.cantidadesComprar = 1;

            fetch('https://fakestoreapi.com/products/' + id)
            .then(res=>res.json())
            .then(json=>{
                this.detalle = json;
            });
        },
        verCarrito() {
            this.mostrarIndex = false;
            this.mostrarProductos = false;
            this.mostrarDetalle = false;
            this.mostrarCarrito = true;
            this.carrito();
        },
        sumarCarrito() {
            this.cantidadesComprar++;
        },
        restarCarrito() {
            if(this.cantidadesComprar > 1) {
                this.cantidadesComprar--;
            }
        },
        añadirCarrito(id) {
            let existe = false;
            this.listaCarrito.forEach(element => {
                if(element[0] == id) {
                    element[1] += this.cantidadesComprar;
                    existe = true;
                }
            });

            if(!existe) {
                this.listaCarrito.push([id,this.cantidadesComprar]);
            }
        },
        carrito() {
            this.productosCarrito = [];
            this.listaCarrito.forEach(element => {
                fetch('https://fakestoreapi.com/products/' + element[0])
                .then(res=>res.json())
                .then(json=>{
                    this.productosCarrito.push([json,element[1]]);
                });
            });
        },
        sumarCarritoTotal(id) {
            this.productosCarrito.forEach(element => {
                if(element[0].id == id) {
                    element[1]++;
                }
            });
        },
        restarCarritoTotal(id) {
            this.productosCarrito.forEach(element => {
                if(element[0].id == id) {
                    if(element[1] > 1) {
                        element[1]--;
                    }
                }
            });
        },
        eliminarProductoCarrito(id) {
            const index = this.productosCarrito.findIndex(element => element[0].id === id);
            this.productosCarrito.splice(index, 1);
            this.listaCarrito.splice(index,1);
        },
        calcularTotalCarrito() {
            // Inicializamos dineroTotal a 0 antes de realizar la suma
            this.dineroTotal = 0;
        
            // Iteramos sobre los productos en el carrito
            this.productosCarrito.forEach(element => {
                // Multiplicamos el precio por la cantidad de productos
                this.dineroTotal += element[0].price * element[1];
            });
        
            console.log("Dinero total final:", this.dineroTotal);
        }
    },
    mounted() {
        this.categorias();
    }
}).mount('#app');
};

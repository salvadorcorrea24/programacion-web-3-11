const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');

btnCart.addEventListener('click', () => {
    containerCartProducts.classList.toggle('hidden-cart');
});

/* ========================= */
const cartInfo = document.querySelector('.cart-product');
const rowProduct = document.querySelector('.row-product');

// Lista de todos los contenedores de productos
const productsList = document.querySelector('.container-items');

// Variable de arreglos de Productos
let allProducts = [];

const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');

// Obtener productos del almacenamiento local al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const productsFromStorage = JSON.parse(localStorage.getItem('cartProducts'));

    if (productsFromStorage) {
        allProducts = productsFromStorage;
        showHTML();
    }
});

productsList.addEventListener('click', e => {
    if (e.target.classList.contains('btn-add-cart')) {
        const product = e.target.parentElement;

        const infoProduct = {
            id: new Date().getTime(),  // ID único para cada producto
            quantity: 1,
            title: product.querySelector('h2').textContent,
            price: product.querySelector('p').textContent,
        };

        const exists = allProducts.some(product => product.title === infoProduct.title);

        if (exists) {
            const products = allProducts.map(product => {
                if (product.title === infoProduct.title) {
                    product.quantity++;
                    return product;
                } else {
                    return product;
                }
            });
            allProducts = [...products];
        } else {
            allProducts = [...allProducts, infoProduct];
        }

        // Guardar productos en el almacenamiento local
        localStorage.setItem('cartProducts', JSON.stringify(allProducts));

        showHTML();
    }
});

rowProduct.addEventListener('click', e => {
    if (e.target.classList.contains('icon-close')) {
        const product = e.target.parentElement;
        const title = product.querySelector('p').textContent;

        const indexToRemove = allProducts.findIndex(item => item.title === title);
        if (indexToRemove !== -1) {
            allProducts.splice(indexToRemove, 1);
        }

        // Guardar productos en el almacenamiento local
        localStorage.setItem('cartProducts', JSON.stringify(allProducts));

        showHTML();
    }
});

// Evento para actualizar la cantidad desde el carrito
rowProduct.addEventListener('change', e => {
    if (e.target.classList.contains('cantidad-producto-carrito')) {
        const productElement = e.target.parentElement;
        const title = productElement.querySelector('.titulo-producto-carrito').textContent;
        const newQuantity = parseInt(e.target.value);

        const productToUpdate = allProducts.find(product => product.title === title);
        if (productToUpdate) {
            productToUpdate.quantity = newQuantity;

            // Guardar productos en el almacenamiento local
            localStorage.setItem('cartProducts', JSON.stringify(allProducts));

            showHTML();
        }
    }
});

// Función para eliminar todos los productos del carrito
document.querySelector('#clear-cart').addEventListener('click', () => {
    allProducts = [];
    localStorage.setItem('cartProducts', JSON.stringify(allProducts));
    showHTML();
});

const showHTML = () => {
    if (!allProducts.length) {
        cartEmpty.classList.remove('hidden');
        rowProduct.classList.add('hidden');
        cartTotal.classList.add('hidden');
    } else {
        cartEmpty.classList.add('hidden');
        rowProduct.classList.remove('hidden');
        cartTotal.classList.remove('hidden');
    }

    // Limpiar HTML
    rowProduct.innerHTML = '';

    let total = 0;
    let totalOfProducts = 0;

    allProducts.forEach(product => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('cart-product');

        containerProduct.innerHTML = `
            <div class="info-cart-product">
                <input type="number" class="cantidad-producto-carrito" value="${product.quantity}" min="1" style="width: 50px;">
                <p class="titulo-producto-carrito">${product.title}</p>
                <span class="precio-producto-carrito">${product.price}</span>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon-close"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        `;

        rowProduct.append(containerProduct);

        total = total + parseInt(product.quantity * product.price.slice(1));
        totalOfProducts = totalOfProducts + product.quantity;
    });

    valorTotal.innerText = `$${total}`;
    countProducts.innerText = totalOfProducts;
};

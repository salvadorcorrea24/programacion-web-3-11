const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector(
	'.container-cart-products'
);

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
			quantity: 1,
			title: product.querySelector('h2').textContent,
			price: product.querySelector('p').textContent,
		};

		const exits = allProducts.some(
			product => product.title === infoProduct.title
		);

		if (exits) {
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
            if (allProducts[indexToRemove].quantity > 1) {
                allProducts[indexToRemove].quantity--;
            } else {
                allProducts.splice(indexToRemove, 1);
            }
        }

        // Guardar productos en el almacenamiento local
        localStorage.setItem('cartProducts', JSON.stringify(allProducts));

        showHTML();
    }
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
                <span class="cantidad-producto-carrito">${product.quantity}</span>
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

		total =
			total + parseInt(product.quantity * product.price.slice(1));
		totalOfProducts = totalOfProducts + product.quantity;
	});

	valorTotal.innerText = `$${total}`;
	countProducts.innerText = totalOfProducts;
};

	document.addEventListener('DOMContentLoaded', () => {
		loadCartItems();
		updateCartSummary();
	
		// Manejar el evento de clic en el botón Eliminar
		document.getElementById('cart-items').addEventListener('click', event => {
			if (event.target.classList.contains('btn-remove-item')) {
				const itemId = parseInt(event.target.getAttribute('data-id'));
				removeCartItem(itemId);
			}
		});
	
		// Manejar el evento de clic en el botón Finalizar Compra
		document.getElementById('checkout-btn').addEventListener('click', () => {
			// Aquí puedes agregar la lógica para finalizar la compra
			// Por ejemplo, redirigir a una página de pago
			alert('¡Compra finalizada! (Esto es solo un ejemplo)');
		});
	});
	
	// Función para cargar los productos del carrito desde el almacenamiento local
	function loadCartItems() {
		const cartProducts = localStorage.getItem('cartProducts');
		if (cartProducts) {
			const cartProductsArray = JSON.parse(cartProducts);
			const cartItemsElement = document.getElementById('cart-items');
			cartItemsElement.innerHTML = '';
			cartProductsArray.forEach(product => {
				const itemElement = document.createElement('div');
				itemElement.classList.add('cart-item');
				itemElement.innerHTML = `
					<div class="item-info">
						<h2>${product.title}</h2>
						<p>Precio: ${product.price}</p>
						<label for="quantity-${product.id}">Cantidad:</label>
						<input type="number" id="quantity-${product.id}" name="quantity" min="1" value="${product.quantity}">
						<button class="btn-remove-item" data-id="${product.id}">Eliminar</button>
					</div>
				`;
				cartItemsElement.appendChild(itemElement);
			});
		}
	}
	
	// Función para actualizar el resumen del carrito
	function updateCartSummary() {
		const cartProducts = localStorage.getItem('cartProducts');
		if (cartProducts) {
			const cartProductsArray = JSON.parse(cartProducts);
			const totalProducts = document.getElementById('total-products');
			const totalAmount = document.getElementById('total-amount');
			let totalQuantity = 0;
			let totalPrice = 0;
			cartProductsArray.forEach(product => {
				totalQuantity += product.quantity;
				totalPrice += product.quantity * parseFloat(product.price.replace('$', ''));
			});
			totalProducts.textContent = totalQuantity;
			totalAmount.textContent = `$${totalPrice.toFixed(2)}`;
		}
	}
	
	// Función para eliminar un producto del carrito
	function removeCartItem(id) {
		let cartProducts = localStorage.getItem('cartProducts');
		if (cartProducts) {
			const cartProductsArray = JSON.parse(cartProducts);
			const updatedCartProducts = cartProductsArray.filter(product => product.id !== id);
			localStorage.setItem('cartProducts', JSON.stringify(updatedCartProducts));
			loadCartItems();
			updateCartSummary();
		}
	}
	
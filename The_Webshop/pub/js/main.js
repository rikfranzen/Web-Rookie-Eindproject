import { addToCart, clearCart, getCart, getCartCount } from './cart.js';
import { placeOrder } from './orders.js';
import { ensureProductsLoaded, getProducts } from './products.js';

const productsGrid = document.querySelector('#productsGrid');
const cartButton = document.querySelector('#cartButton');
const cartList = document.querySelector('#cartList');
const cartTotal = document.querySelector('#cartTotal');
const emptyCartButton = document.querySelector('#emptyCartButton');
const checkoutForm = document.querySelector('#checkoutForm');
const feedback = document.querySelector('#feedback');

function formatPrice(price) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

function updateCartLabel() {
  cartButton.textContent = `Cart (${getCartCount()})`;
}

function findProductById(productId) {
  return getProducts().find((product) => product.id === productId);
}

function renderCart() {
  const cart = getCart();

  if (cart.length === 0) {
    cartList.innerHTML = '<p class="text-sm text-gray-500">Je winkelwagen is leeg.</p>';
    cartTotal.textContent = formatPrice(0);
    return;
  }

  let total = 0;
  const rows = cart.map((entry) => {
    const product = findProductById(entry.productId);
    if (!product) return '';
    total += product.price * entry.quantity;
    return `<li class="flex items-center justify-between border-b border-gray-100 py-2"><span>${product.name}</span><span>${formatPrice(product.price)}</span></li>`;
  });

  cartList.innerHTML = `<ul>${rows.join('')}</ul>`;
  cartTotal.textContent = formatPrice(total);
}

function renderProducts() {
  const products = getProducts();

  productsGrid.innerHTML = products
    .map(
      (product) => `
        <article class="group flex h-full flex-col border border-gray-100 p-3">
          <img class="aspect-[4/5] w-full border border-gray-200 object-cover" src="${product.image}" alt="${product.name}" />
          <div class="mt-4 flex items-start justify-between gap-4">
            <div>
              <h3 class="text-lg font-medium">${product.name}</h3>
              <p class="mt-1 text-sm text-gray-500">${product.description}</p>
            </div>
            <p class="text-lg font-medium">${formatPrice(product.price)}</p>
          </div>
          <button data-product-id="${product.id}" class="add-to-cart mt-4 w-full border border-gray-300 py-3 text-sm font-medium transition hover:border-gray-500">
            Add to cart
          </button>
        </article>
      `
    )
    .join('');

  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      addToCart(button.dataset.productId);
      updateCartLabel();
      renderCart();
    });
  });
}

emptyCartButton.addEventListener('click', () => {
  clearCart();
  updateCartLabel();
  renderCart();
});

checkoutForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const order = placeOrder();
  if (!order) {
    feedback.textContent = 'Je winkelwagen is leeg. Voeg eerst producten toe.';
    feedback.className = 'mt-3 text-sm text-red-600';
    return;
  }

  feedback.textContent = `Bestelling geplaatst. Bevestigingsnummer: ${order.id}`;
  feedback.className = 'mt-3 text-sm text-green-700';
  checkoutForm.reset();
  updateCartLabel();
  renderCart();
});

await ensureProductsLoaded();
renderProducts();
updateCartLabel();
renderCart();

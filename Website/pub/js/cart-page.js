import { getCart, getCartCount, removeFromCart, updateCartItemQuantity } from './cart.js';
import { placeOrder } from './orders.js';
import { ensureProductsLoaded, getProducts } from './products.js';

const cartButton = document.querySelector('#cartButton');
const cartList = document.querySelector('#cartList');
const cartTotal = document.querySelector('#cartTotal');
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

function bindCartActions() {
  document.querySelectorAll('[data-action="increase"]').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      const quantity = Number(button.dataset.quantity);
      updateCartItemQuantity(productId, quantity + 1);
      updateCartLabel();
      renderCart();
    });
  });

  document.querySelectorAll('[data-action="decrease"]').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      const quantity = Number(button.dataset.quantity);
      updateCartItemQuantity(productId, quantity - 1);
      updateCartLabel();
      renderCart();
    });
  });

  document.querySelectorAll('[data-action="remove"]').forEach((button) => {
    button.addEventListener('click', () => {
      removeFromCart(button.dataset.productId);
      updateCartLabel();
      renderCart();
    });
  });
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

    const lineTotal = product.price * entry.quantity;
    total += lineTotal;

    return `
      <li class="border-b border-gray-100 py-3">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="font-medium">${product.name}</p>
            <p class="text-sm text-gray-500">${formatPrice(product.price)} per stuk</p>
            <p class="text-sm text-gray-700">Subtotaal: ${formatPrice(lineTotal)}</p>
          </div>
          <div class="flex items-center gap-2">
            <button data-action="decrease" data-product-id="${entry.productId}" data-quantity="${entry.quantity}" class="border border-gray-300 px-2 py-1 text-sm">-</button>
            <span class="min-w-6 text-center text-sm">${entry.quantity}</span>
            <button data-action="increase" data-product-id="${entry.productId}" data-quantity="${entry.quantity}" class="border border-gray-300 px-2 py-1 text-sm">+</button>
            <button data-action="remove" data-product-id="${entry.productId}" class="ml-2 border border-red-300 px-2 py-1 text-xs text-red-700">Verwijder</button>
          </div>
        </div>
      </li>
    `;
  });

  cartList.innerHTML = `<ul>${rows.join('')}</ul>`;
  cartTotal.textContent = formatPrice(total);
  bindCartActions();
}

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
updateCartLabel();
renderCart();

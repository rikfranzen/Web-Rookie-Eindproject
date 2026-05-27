import { addToCart, getCartCount } from './cart.js';
import { ensureProductsLoaded, getProducts } from './products.js';

const cartButton = document.querySelector('#cartButton');
const featuredProductsGrid = document.querySelector('#featuredProductsGrid');

function formatPrice(price) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

function updateCartLabel() {
  if (!cartButton) return;
  cartButton.textContent = `Cart (${getCartCount()})`;
}

function renderFeaturedProducts() {
  if (!featuredProductsGrid) return;

  const products = getProducts().slice(0, 4);

  featuredProductsGrid.innerHTML = products
    .map(
      (product) => `
        <article class="group flex h-full flex-col">
          <img class="aspect-[4/5] w-full border border-gray-200 object-cover" src="${product.image}" alt="${product.name}" />
          <div class="mt-4 flex items-start justify-between gap-4">
            <div>
              <h3 class="text-lg font-medium">${product.name}</h3>
              <p class="mt-1 text-sm text-gray-500">${product.description}</p>
            </div>
            <p class="text-lg font-medium">${formatPrice(product.price)}</p>
          </div>
          <button data-product-id="${product.id}" class="add-to-cart mt-4 w-full border border-gray-300 py-3 text-sm font-medium transition hover:border-sky-200 hover:bg-sky-50">Add to cart</button>
        </article>
      `
    )
    .join('');

  featuredProductsGrid.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      addToCart(button.dataset.productId);
      updateCartLabel();
    });
  });
}

if (cartButton) {
  cartButton.addEventListener('click', () => {
    window.location.href = 'cart.html';
  });
}

await ensureProductsLoaded();
renderFeaturedProducts();
updateCartLabel();

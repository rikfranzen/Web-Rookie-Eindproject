import { addToCart, getCartCount } from './cart.js';
import { ensureProductsLoaded, getProducts } from './products.js';

const productsGrid = document.querySelector('#productsGrid');
const cartButton = document.querySelector('#cartButton');
const resultsInfo = document.querySelector('#resultsInfo');
const browseTitle = document.querySelector('#browseTitle');
const searchInput = document.querySelector('#searchInput');
const categorySelect = document.querySelector('#categorySelect');
const minPriceInput = document.querySelector('#minPriceInput');
const maxPriceInput = document.querySelector('#maxPriceInput');
const sortSelect = document.querySelector('#sortSelect');
const clearFiltersButton = document.querySelector('#clearFiltersButton');
const CATEGORY_KEYWORDS = {
  basses: ['bass', '4-string', '5-string', '4 string', '5 string', 'j-bass', 'p-bass'],
  amplification: ['amp', 'combo', 'cab', 'cable', 'amplification', 'vermogen', 'luidspreker'],
  accessories: ['string set', 'strap', 'pedal', 'accessor', 'tuner', 'pick', 'kabel', 'cable']
};
const CATEGORY_LABELS = {
  basses: 'Basses',
  amplification: 'Amplification',
  accessories: 'Accessories'
};
const CATEGORY_TITLES = {
  basses: 'All basses',
  amplification: 'All amps',
  accessories: 'All accessories'
};
const CATEGORY_ID_PREFIXES = {
  basses: 'bass-',
  amplification: 'amp-',
  accessories: 'accessory-'
};

const initialCategory = new URLSearchParams(window.location.search).get('category')?.toLowerCase() || '';
if (CATEGORY_KEYWORDS[initialCategory]) {
  categorySelect.value = initialCategory;
}

function formatPrice(price) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

function updateCartLabel() {
  cartButton.textContent = `Cart (${getCartCount()})`;
}

function getFilters() {
  return {
    category: categorySelect.value,
    search: searchInput.value.trim().toLowerCase(),
    minPrice: Number(minPriceInput.value) || 0,
    maxPrice: Number(maxPriceInput.value) || Number.POSITIVE_INFINITY,
    sort: sortSelect.value
  };
}

function applyFiltersAndSort(products, filters) {
  const filtered = products.filter((product) => {
    const combinedText = `${product.name} ${product.description}`.toLowerCase();
    const categoryKeywords = CATEGORY_KEYWORDS[filters.category] || [];
    const categoryIdPrefix = CATEGORY_ID_PREFIXES[filters.category] || '';
    const matchesIdPrefix = categoryIdPrefix ? product.id.toLowerCase().startsWith(categoryIdPrefix) : false;
    const hasExplicitCategory = typeof product.category === 'string' && product.category.length > 0;
    const matchesExplicitCategory = hasExplicitCategory && product.category.toLowerCase() === filters.category;
    const matchesCategory =
      categoryKeywords.length === 0
        ? true
        : hasExplicitCategory
          ? matchesExplicitCategory
          : matchesIdPrefix || categoryKeywords.some((keyword) => combinedText.includes(keyword));

    const matchesSearch =
      filters.search.length === 0 ||
      combinedText.includes(filters.search);

    const inPriceRange = product.price >= filters.minPrice && product.price <= filters.maxPrice;

    return matchesCategory && matchesSearch && inPriceRange;
  });

  switch (filters.sort) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name, 'nl-NL'));
      break;
    case 'name-desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name, 'nl-NL'));
      break;
    default:
      break;
  }

  return filtered;
}

function renderProducts() {
  const allProducts = getProducts();
  const filters = getFilters();
  const visibleProducts = applyFiltersAndSort(allProducts, filters);
  const categoryText = CATEGORY_LABELS[filters.category]
    ? ` · Categorie: ${CATEGORY_LABELS[filters.category]}`
    : '';

  browseTitle.textContent = CATEGORY_TITLES[filters.category] || 'All gear';
  resultsInfo.textContent = `${visibleProducts.length} van ${allProducts.length} producten${categoryText}`;

  if (visibleProducts.length === 0) {
    productsGrid.innerHTML =
      '<p class="border border-gray-200 p-5 text-sm text-gray-600">Geen producten gevonden met deze filters.</p>';
    return;
  }

  productsGrid.innerHTML = visibleProducts
    .map(
      (product) => `
      <article class="w-full border border-gray-200 p-4">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex min-w-0 flex-1 gap-4">
            <img class="h-24 w-24 shrink-0 object-cover" src="${product.image}" alt="${product.name}" />
            <div class="min-w-0">
              <h2 class="text-lg font-medium">${product.name}</h2>
              <p class="mt-1 text-sm text-gray-500">${product.description}</p>
            </div>
          </div>
          <div class="flex w-full items-center justify-between gap-3 sm:w-auto sm:flex-col sm:items-end">
            <p class="text-lg font-medium">${formatPrice(product.price)}</p>
            <button data-product-id="${product.id}" class="add-to-cart border border-gray-300 px-4 py-2 text-sm font-medium transition hover:border-sky-200 hover:bg-sky-50">Add to cart</button>
          </div>
        </div>
      </article>
    `
    )
    .join('');

  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      addToCart(button.dataset.productId);
      updateCartLabel();
    });
  });
}

function resetFilters() {
  categorySelect.value = '';
  searchInput.value = '';
  minPriceInput.value = '';
  maxPriceInput.value = '';
  sortSelect.value = 'featured';
  renderProducts();
}

[categorySelect, searchInput, minPriceInput, maxPriceInput, sortSelect].forEach((element) => {
  element.addEventListener('input', renderProducts);
  element.addEventListener('change', renderProducts);
});

clearFiltersButton.addEventListener('click', resetFilters);

await ensureProductsLoaded();
renderProducts();
updateCartLabel();

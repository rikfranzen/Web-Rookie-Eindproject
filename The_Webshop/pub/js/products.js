import { STORAGE_KEYS } from './constants.js';
import { readStorage, writeStorage } from './storage.js';

const PRODUCTS_JSON_PATH = './data/products.json';

export async function ensureProductsLoaded() {
  // Always sync with the JSON source so file changes are directly visible in all pages.
  return resetProductsToDefault();
}

export function getProducts() {
  return readStorage(STORAGE_KEYS.products, []);
}

export function saveProducts(products) {
  writeStorage(STORAGE_KEYS.products, products);
}

export async function resetProductsToDefault() {
  const response = await fetch(PRODUCTS_JSON_PATH);
  const products = await response.json();
  saveProducts(products);
  return products;
}

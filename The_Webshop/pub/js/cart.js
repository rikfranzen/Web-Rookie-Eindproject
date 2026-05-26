import { STORAGE_KEYS } from './constants.js';
import { readStorage, writeStorage } from './storage.js';

function normalizeCart(cart) {
  const merged = new Map();

  for (const item of cart) {
    if (!item?.productId) continue;
    const quantity = Number(item.quantity) || 1;
    const current = merged.get(item.productId) || 0;
    merged.set(item.productId, current + quantity);
  }

  return [...merged.entries()].map(([productId, quantity]) => ({ productId, quantity }));
}

export function getCart() {
  const cart = readStorage(STORAGE_KEYS.cart, []);
  return normalizeCart(Array.isArray(cart) ? cart : []);
}

export function saveCart(cart) {
  writeStorage(STORAGE_KEYS.cart, normalizeCart(cart));
}

export function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }

  saveCart(cart);
}

export function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.productId !== productId);
  saveCart(cart);
}

export function updateCartItemQuantity(productId, quantity) {
  const nextQuantity = Number(quantity);

  if (nextQuantity <= 0) {
    removeFromCart(productId);
    return;
  }

  const cart = getCart().map((item) =>
    item.productId === productId ? { ...item, quantity: nextQuantity } : item
  );

  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}

export function getCartCount() {
  return getCart().reduce((count, item) => count + item.quantity, 0);
}

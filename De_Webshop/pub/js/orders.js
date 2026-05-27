import { STORAGE_KEYS } from './constants.js';
import { clearCart, getCart } from './cart.js';
import { readStorage, writeStorage } from './storage.js';

const ORDER_SOURCE = 'checkout_v2';

export function getOrders() {
  const orders = readStorage(STORAGE_KEYS.orders, []);

  return orders.filter(
    (order) =>
      order &&
      order.source === ORDER_SOURCE &&
      typeof order.id === 'string' &&
      Array.isArray(order.items)
  );
}

export function placeOrder() {
  const cart = getCart();
  if (cart.length === 0) return null;

  const order = {
    id: `order-${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: ORDER_SOURCE,
    items: cart
  };

  const orders = getOrders();
  orders.push(order);
  writeStorage(STORAGE_KEYS.orders, orders);
  clearCart();

  return order;
}

export function clearOrders() {
  writeStorage(STORAGE_KEYS.orders, []);
}

export function updateOrder(previousOrderId, updatedOrder) {
  const orders = getOrders();
  const nextOrders = orders.map((order) =>
    order.id === previousOrderId
      ? {
          ...order,
          ...updatedOrder,
          source: ORDER_SOURCE
        }
      : order
  );

  writeStorage(STORAGE_KEYS.orders, nextOrders);
}

export function deleteOrder(orderId) {
  const orders = getOrders();
  const filteredOrders = orders.filter((order) => order.id !== orderId);
  writeStorage(STORAGE_KEYS.orders, filteredOrders);
}

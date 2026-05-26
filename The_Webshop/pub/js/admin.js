import { clearOrders, deleteOrder, getOrders, updateOrder } from './orders.js';
import { ensureProductsLoaded, getProducts, resetProductsToDefault, saveProducts } from './products.js';
import { validateProductForm } from './validation.js';

const productList = document.querySelector('#productList');
const ordersList = document.querySelector('#ordersList');
const productForm = document.querySelector('#productForm');
const resetButton = document.querySelector('#resetProductsButton');
const clearOrdersButton = document.querySelector('#clearOrdersButton');
const adminFeedback = document.querySelector('#adminFeedback');

const editProductModal = document.querySelector('#editProductModal');
const editProductForm = document.querySelector('#editProductForm');
const closeEditModalButton = document.querySelector('#closeEditModalButton');

const editOrderModal = document.querySelector('#editOrderModal');
const editOrderForm = document.querySelector('#editOrderForm');
const editOrderIdInput = document.querySelector('#editOrderIdInput');
const editOrderCreatedAtInput = document.querySelector('#editOrderCreatedAtInput');
const editOrderItems = document.querySelector('#editOrderItems');
const editOrderTotal = document.querySelector('#editOrderTotal');
const addOrderItemButton = document.querySelector('#addOrderItemButton');
const closeEditOrderModalButton = document.querySelector('#closeEditOrderModalButton');

let activeEditProductId = null;
let activeEditOrderId = null;

function formatPrice(price) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

function setFeedback(message, isError = false) {
  adminFeedback.textContent = message;
  adminFeedback.className = `mt-3 text-sm ${isError ? 'text-red-600' : 'text-green-700'}`;
}

function getProductNameById(productId) {
  return getProducts().find((product) => product.id === productId)?.name || productId;
}

function getProductPriceById(productId) {
  return getProducts().find((product) => product.id === productId)?.price || 0;
}

function openEditModal(productId) {
  const products = getProducts();
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  activeEditProductId = productId;
  editProductForm.name.value = product.name;
  editProductForm.description.value = product.description;
  editProductForm.price.value = String(product.price);
  editProductForm.image.value = product.image;
  editProductModal.classList.remove('hidden');
  editProductModal.classList.add('flex');
}

function closeEditModal() {
  activeEditProductId = null;
  editProductForm.reset();
  editProductModal.classList.add('hidden');
  editProductModal.classList.remove('flex');
}

function toDatetimeLocalValue(isoString) {
  const date = new Date(isoString);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

function createOrderItemRow(productId = '', quantity = 1) {
  const productOptions = getProducts()
    .map(
      (product) =>
        `<option value="${product.id}" ${product.id === productId ? 'selected' : ''}>${product.name}</option>`
    )
    .join('');

  const row = document.createElement('div');
  row.className = 'rounded border border-gray-200 p-3';
  row.innerHTML = `
    <div class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_120px_96px]">
      <select class="order-item-product border border-gray-300 bg-white px-3 py-2 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100" required>
        <option value="">Kies product</option>
        ${productOptions}
      </select>
      <input type="number" min="1" step="1" value="${quantity}" class="order-item-quantity border border-gray-300 px-3 py-2 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100" required />
      <button type="button" class="remove-order-item border border-red-300 px-3 py-2 text-xs text-red-700">Verwijder</button>
    </div>
    <p class="order-item-price mt-2 text-xs text-gray-500">Regel totaal: ${formatPrice(0)}</p>
  `;

  row.querySelector('.remove-order-item').addEventListener('click', () => {
    row.remove();
    recalculateOrderTotal();
  });

  row.querySelector('.order-item-product').addEventListener('change', recalculateOrderTotal);
  row.querySelector('.order-item-quantity').addEventListener('input', recalculateOrderTotal);

  return row;
}

function recalculateOrderTotal() {
  const rows = [...editOrderItems.querySelectorAll('.rounded.border')];

  let total = 0;
  rows.forEach((row) => {
    const productId = row.querySelector('.order-item-product').value;
    const quantity = Math.max(0, Math.floor(Number(row.querySelector('.order-item-quantity').value) || 0));
    const lineTotal = getProductPriceById(productId) * quantity;
    total += lineTotal;
    row.querySelector('.order-item-price').textContent = `Regel totaal: ${formatPrice(lineTotal)}`;
  });

  editOrderTotal.textContent = `Bestelling totaal: ${formatPrice(total)}`;
}

function openEditOrderModal(orderId) {
  const order = getOrders().find((item) => item.id === orderId);
  if (!order) return;

  activeEditOrderId = orderId;
  editOrderIdInput.value = order.id;
  editOrderCreatedAtInput.value = toDatetimeLocalValue(order.createdAt);

  editOrderItems.innerHTML = '';
  order.items.forEach((item) => {
    editOrderItems.appendChild(createOrderItemRow(item.productId, item.quantity));
  });

  recalculateOrderTotal();

  editOrderModal.classList.remove('hidden');
  editOrderModal.classList.add('flex');
}

function closeEditOrderModal() {
  activeEditOrderId = null;
  editOrderForm.reset();
  editOrderItems.innerHTML = '';
  editOrderTotal.textContent = '';
  editOrderModal.classList.add('hidden');
  editOrderModal.classList.remove('flex');
}

function updateProduct(productId, formData) {
  const products = getProducts();
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const errors = validateProductForm(formData);
  if (errors.length > 0) {
    setFeedback(errors.join(' '), true);
    return;
  }

  const updatedProducts = products.map((item) =>
    item.id === productId
      ? {
          ...item,
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: Number(formData.price),
          image: formData.image.trim()
        }
      : item
  );

  saveProducts(updatedProducts);
  setFeedback('Product aangepast.');
  renderProducts();
  renderOrders();
}

function renderProducts() {
  const products = getProducts();

  productList.innerHTML = products
    .map(
      (product) => `
        <li class="rounded border border-gray-200 p-3">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="font-semibold">${product.name}</p>
              <p class="text-sm text-gray-500">${product.description}</p>
              <p class="text-sm font-medium">${formatPrice(product.price)}</p>
            </div>
            <div class="flex gap-2">
              <button data-edit-id="${product.id}" class="border border-gray-300 px-2 py-1 text-xs">Wijzig</button>
              <button data-delete-id="${product.id}" class="border border-red-300 px-2 py-1 text-xs text-red-700">Verwijder</button>
            </div>
          </div>
        </li>
      `
    )
    .join('');

  document.querySelectorAll('[data-delete-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const filtered = getProducts().filter((product) => product.id !== button.dataset.deleteId);
      saveProducts(filtered);
      setFeedback('Product verwijderd.');
      renderProducts();
      renderOrders();
    });
  });

  document.querySelectorAll('[data-edit-id]').forEach((button) => {
    button.addEventListener('click', () => {
      openEditModal(button.dataset.editId);
    });
  });
}

function renderOrders() {
  const orders = getOrders();

  if (orders.length === 0) {
    ordersList.innerHTML = '<p class="text-sm text-gray-500">Nog geen bestellingen.</p>';
    return;
  }

  ordersList.innerHTML = orders
    .map((order) => {
      const itemCount = order.items.reduce((count, item) => count + item.quantity, 0);
      const totalPrice = order.items.reduce(
        (total, item) => total + getProductPriceById(item.productId) * item.quantity,
        0
      );

      return `
        <li class="rounded border border-gray-200 p-3">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="font-semibold">${order.id}</p>
              <p class="text-sm text-gray-600">${new Date(order.createdAt).toLocaleString('nl-NL')}</p>
              <p class="text-sm text-gray-600">Aantal producten: ${itemCount}</p>
              <p class="text-sm font-medium text-gray-800">Totaalprijs: ${formatPrice(totalPrice)}</p>
            </div>
            <div class="flex gap-2">
              <button data-edit-order-id="${order.id}" class="border border-gray-300 px-2 py-1 text-xs">Wijzig</button>
              <button data-delete-order-id="${order.id}" class="border border-red-300 px-2 py-1 text-xs text-red-700">Verwijder</button>
            </div>
          </div>
          <ul class="mt-3 space-y-1 text-xs text-gray-600">
            ${order.items
              .map(
                (item) =>
                  `<li>${getProductNameById(item.productId)} · ${item.quantity}x · ${formatPrice(
                    getProductPriceById(item.productId) * item.quantity
                  )}</li>`
              )
              .join('')}
          </ul>
        </li>
      `;
    })
    .join('');

  document.querySelectorAll('[data-edit-order-id]').forEach((button) => {
    button.addEventListener('click', () => {
      openEditOrderModal(button.dataset.editOrderId);
    });
  });

  document.querySelectorAll('[data-delete-order-id]').forEach((button) => {
    button.addEventListener('click', () => {
      deleteOrder(button.dataset.deleteOrderId);
      setFeedback('Bestelling verwijderd.');
      renderOrders();
    });
  });
}

productForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = {
    name: productForm.name.value,
    description: productForm.description.value,
    price: productForm.price.value,
    image: productForm.image.value
  };

  const errors = validateProductForm(formData);
  if (errors.length > 0) {
    setFeedback(errors.join(' '), true);
    return;
  }

  const products = getProducts();
  products.push({
    id: `${formData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
    name: formData.name.trim(),
    description: formData.description.trim(),
    price: Number(formData.price),
    image: formData.image.trim()
  });

  saveProducts(products);
  productForm.reset();
  setFeedback('Product opgeslagen.');
  renderProducts();
});

resetButton.addEventListener('click', async () => {
  await resetProductsToDefault();
  setFeedback('Producten teruggezet naar JSON-bron.');
  renderProducts();
  renderOrders();
});

clearOrdersButton.addEventListener('click', () => {
  clearOrders();
  setFeedback('Bestellingen gewist.');
  renderOrders();
});

editProductForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!activeEditProductId) return;

  const formData = {
    name: editProductForm.name.value,
    description: editProductForm.description.value,
    price: editProductForm.price.value,
    image: editProductForm.image.value
  };

  updateProduct(activeEditProductId, formData);
  closeEditModal();
});

addOrderItemButton.addEventListener('click', () => {
  editOrderItems.appendChild(createOrderItemRow());
  recalculateOrderTotal();
});

editOrderForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!activeEditOrderId) return;

  const nextOrderId = editOrderIdInput.value.trim();
  if (!nextOrderId) {
    setFeedback('Order ID is verplicht.', true);
    return;
  }

  const duplicateOrder = getOrders().find(
    (order) => order.id === nextOrderId && order.id !== activeEditOrderId
  );
  if (duplicateOrder) {
    setFeedback('Order ID bestaat al.', true);
    return;
  }

  const updatedItems = [...editOrderItems.querySelectorAll('.rounded.border')]
    .map((row) => ({
      productId: row.querySelector('.order-item-product').value,
      quantity: Math.max(0, Math.floor(Number(row.querySelector('.order-item-quantity').value) || 0))
    }))
    .filter((item) => item.productId && item.quantity > 0);

  if (updatedItems.length === 0) {
    setFeedback('Een bestelling moet minimaal 1 product bevatten.', true);
    return;
  }

  const createdAtDate = new Date(editOrderCreatedAtInput.value);
  if (Number.isNaN(createdAtDate.getTime())) {
    setFeedback('Ongeldige datum/tijd.', true);
    return;
  }
  const createdAtIso = createdAtDate.toISOString();

  updateOrder(activeEditOrderId, {
    id: nextOrderId,
    createdAt: createdAtIso,
    items: updatedItems
  });

  setFeedback('Bestelling aangepast.');
  closeEditOrderModal();
  renderOrders();
});

closeEditModalButton.addEventListener('click', closeEditModal);
editProductModal.addEventListener('click', (event) => {
  if (event.target === editProductModal) {
    closeEditModal();
  }
});

closeEditOrderModalButton.addEventListener('click', closeEditOrderModal);
editOrderModal.addEventListener('click', (event) => {
  if (event.target === editOrderModal) {
    closeEditOrderModal();
  }
});

await ensureProductsLoaded();
renderProducts();
renderOrders();

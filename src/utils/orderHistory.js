const KEY = 'restaurant_orders'

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch (e) {
    return []
  }
}

function saveAll(orders) {
  localStorage.setItem(KEY, JSON.stringify(orders))
}

export function addOrder(username, order) {
  const orders = loadAll()
  orders.unshift({
    id: 'ORD-' + Date.now(),
    username,
    createdAt: new Date().toISOString(),
    status: 'در حال آماده‌سازی',
    ...order,
  })
  saveAll(orders)
  return orders
}

export function getOrdersForUser(username) {
  return loadAll().filter((o) => o.username === username)
}

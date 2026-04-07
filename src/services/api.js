const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('mk_admin_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Don't set Content-Type for FormData — browser sets it with boundary
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// ─── Products ──────────────────────────────────────────
export const productApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products?${query}`);
  },
  getPublic: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/products/public?${query}`).then(r => r.json());
  },
  getById: (id) => fetch(`${API_BASE}/products/${id}`).then(r => r.json()),
  create: (formData) => request('/products', { method: 'POST', body: formData }),
  update: (id, formData) => request(`/products/${id}`, { method: 'PUT', body: formData }),
  toggle: (id) => request(`/products/${id}/toggle`, { method: 'PATCH' }),
  delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
};

// ─── Categories ────────────────────────────────────────
export const categoryApi = {
  getAll: (search = '') => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return fetch(`${API_BASE}/categories${query}`).then(r => r.json());
  },
  getById: (id) => fetch(`${API_BASE}/categories/${id}`).then(r => r.json()),
  create: (formData) => request('/categories', { method: 'POST', body: formData }),
  update: (id, formData) => request(`/categories/${id}`, { method: 'PUT', body: formData }),
  delete: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
  addSubcategory: (id, name) =>
    request(`/categories/${id}/subcategory`, { method: 'POST', body: JSON.stringify({ name }) }),
  updateSubcategory: (id, subId, name) =>
    request(`/categories/${id}/subcategory/${subId}`, { method: 'PUT', body: JSON.stringify({ name }) }),
  removeSubcategory: (id, subId) =>
    request(`/categories/${id}/subcategory/${subId}`, { method: 'DELETE' }),
};

// ─── Banners ───────────────────────────────────────────
export const bannerApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/banners/admin?${query}`);
  },
  getPublic: (type) => {
    const query = type ? `?type=${type}` : '';
    return fetch(`${API_BASE}/banners${query}`).then(r => r.json());
  },
  create: (formData) => request('/banners', { method: 'POST', body: formData }),
  update: (id, formData) => request(`/banners/${id}`, { method: 'PUT', body: formData }),
  toggle: (id) => request(`/banners/${id}/toggle`, { method: 'PATCH' }),
  delete: (id) => request(`/banners/${id}`, { method: 'DELETE' }),
};

// ─── Orders ────────────────────────────────────────────
export const orderApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/orders/admin/all?${query}`);
  },
  getById: (id) => request(`/orders/${id}`),
  updateStatus: (id, body) =>
    request(`/orders/admin/${id}/status`, { method: 'PATCH', body: JSON.stringify(body) }),
};

// ─── Attribute Variants ────────────────────────────────
export const attributeVariantApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/attribute-variants?${query}`);
  },
  create: (data) => request('/attribute-variants', { method: 'POST', body: JSON.stringify(data) }),
  bulkCreate: (variants) =>
    request('/attribute-variants/bulk', { method: 'POST', body: JSON.stringify({ variants }) }),
  update: (id, data) =>
    request(`/attribute-variants/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggle: (id) => request(`/attribute-variants/${id}/toggle`, { method: 'PATCH' }),
  delete: (id) => request(`/attribute-variants/${id}`, { method: 'DELETE' }),
};

// ─── Staff / Teams ─────────────────────────────────────
export const staffApi = {
  getAll: () => request('/staff'),
  create: (data) => request('/staff', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggle: (id) => request(`/staff/${id}/toggle`, { method: 'PATCH' }),
  delete: (id) => request(`/staff/${id}`, { method: 'DELETE' }),
};

// ─── Dashboard ─────────────────────────────────────────
export const dashboardApi = {
  getStats: () => request('/dashboard/stats'),
  getOrdersChart: () => request('/dashboard/orders-chart'),
};

// ─── Customers (Users) ─────────────────────────────────
export const customerApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/auth/users?${query}`);
  },
};

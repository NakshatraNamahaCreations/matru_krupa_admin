const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("mk_admin_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Don't set Content-Type for FormData — browser sets it with boundary
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
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
    return fetch(`${API_BASE}/products/public?${query}`).then((r) => r.json());
  },
  getById: (id) => fetch(`${API_BASE}/products/${id}`).then((r) => r.json()),
  create: (formData) =>
    request("/products", { method: "POST", body: formData }),
  update: (id, formData) =>
    request(`/products/${id}`, { method: "PUT", body: formData }),
  toggle: (id) => request(`/products/${id}/toggle`, { method: "PATCH" }),
  delete: (id) => request(`/products/${id}`, { method: "DELETE" }),
};

// ─── Categories ────────────────────────────────────────
export const categoryApi = {
  getAll: (search = "") => {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    return fetch(`${API_BASE}/categories${query}`).then((r) => r.json());
  },
  getById: (id) => fetch(`${API_BASE}/categories/${id}`).then((r) => r.json()),
  create: (formData) =>
    request("/categories", { method: "POST", body: formData }),
  update: (id, formData) =>
    request(`/categories/${id}`, { method: "PUT", body: formData }),
  delete: (id) => request(`/categories/${id}`, { method: "DELETE" }),
  addSubcategory: (id, name) =>
    request(`/categories/${id}/subcategory`, {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  updateSubcategory: (id, subId, name) =>
    request(`/categories/${id}/subcategory/${subId}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    }),
  removeSubcategory: (id, subId) =>
    request(`/categories/${id}/subcategory/${subId}`, { method: "DELETE" }),
};

// ─── Banners ───────────────────────────────────────────
export const bannerApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/banners/admin?${query}`);
  },
  getPublic: (type) => {
    const query = type ? `?type=${type}` : "";
    return fetch(`${API_BASE}/banners${query}`).then((r) => r.json());
  },
  create: (formData) => request("/banners", { method: "POST", body: formData }),
  update: (id, formData) =>
    request(`/banners/${id}`, { method: "PUT", body: formData }),
  toggle: (id) => request(`/banners/${id}/toggle`, { method: "PATCH" }),
  delete: (id) => request(`/banners/${id}`, { method: "DELETE" }),
};

// ─── Orders ────────────────────────────────────────────
export const orderApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/orders/admin/all?${query}`);
  },
  getById: (id) => request(`/orders/${id}`),
  updateStatus: (id, body) =>
    request(`/orders/admin/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};

// ─── Attribute Variants ────────────────────────────────
export const attributeVariantApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/attribute-variants?${query}`);
  },
  create: (data) =>
    request("/attribute-variants", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  bulkCreate: (variants) =>
    request("/attribute-variants/bulk", {
      method: "POST",
      body: JSON.stringify({ variants }),
    }),
  update: (id, data) =>
    request(`/attribute-variants/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  toggle: (id) =>
    request(`/attribute-variants/${id}/toggle`, { method: "PATCH" }),
  delete: (id) => request(`/attribute-variants/${id}`, { method: "DELETE" }),
};

// ─── Staff / Teams ─────────────────────────────────────
export const staffApi = {
  getAll: () => request("/staff"),
  create: (data) =>
    request("/staff", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/staff/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  toggle: (id) => request(`/staff/${id}/toggle`, { method: "PATCH" }),
  delete: (id) => request(`/staff/${id}`, { method: "DELETE" }),
};

// ─── Dashboard ─────────────────────────────────────────
export const dashboardApi = {
  getStats: () => request("/dashboard/stats"),
  getOrdersChart: () => request("/dashboard/orders-chart"),
};

// ─── Franchise Applications (website submissions) ─────
export const franchiseApplicationApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/franchise-applications${query ? `?${query}` : ""}`);
  },
  getById: (id) => request(`/franchise-applications/${id}`),
  update: (id, data) =>
    request(`/franchise-applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id) => request(`/franchise-applications/${id}`, { method: "DELETE" }),
};

// ─── Onboarded Franchises ─────────────────────────────
export const franchiseApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/franchises${query ? `?${query}` : ""}`);
  },
  getById: (id) => request(`/franchises/${id}`),
  create: (data) =>
    request("/franchises", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/franchises/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  toggle: (id) => request(`/franchises/${id}/toggle`, { method: "PATCH" }),
  delete: (id) => request(`/franchises/${id}`, { method: "DELETE" }),
  onboardFromApplication: (appId) =>
    request(`/franchises/from-application/${appId}`, { method: "POST" }),
};

// ─── Customers (Users) ─────────────────────────────────
export const customerApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/auth/users?${query}`);
  },
};

// ─── Hierarchy ────────────────────────────────────────
export const hierarchyAdminApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/hierarchy/admins?${query}`);
  },
  getById: (id) => request(`/hierarchy/admins/${id}`),
  create: (data) =>
    request("/hierarchy/admins", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/hierarchy/admins/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  toggle: (id) =>
    request(`/hierarchy/admins/${id}/toggle`, { method: "PATCH" }),
  delete: (id) => request(`/hierarchy/admins/${id}`, { method: "DELETE" }),
};

export const shopApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/hierarchy/shops?${query}`);
  },
  create: (data) =>
    request("/hierarchy/shops", { method: "POST", body: JSON.stringify(data) }),
  delete: (id) => request(`/hierarchy/shops/${id}`, { method: "DELETE" }),
  getHobliStats: () => request("/hierarchy/shops/hobli-stats"),
};

export const commissionRuleApi = {
  getAll: () => request("/hierarchy/commission-rules"),
  update: (id, data) =>
    request(`/hierarchy/commission-rules/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export const districtSplitApi = {
  get: (district) =>
    request(
      `/hierarchy/district-splits?district=${encodeURIComponent(district)}`,
    ),
  save: (data) =>
    request("/hierarchy/district-splits", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ─── Promoter Sales ──────────────────────────────────
export const promoterSaleApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/hierarchy/promoter-sales${query ? `?${query}` : ""}`);
  },
  create: (data) =>
    request("/hierarchy/promoter-sales", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateStatus: (id, status) =>
    request(`/hierarchy/promoter-sales/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  delete: (id) =>
    request(`/hierarchy/promoter-sales/${id}`, { method: "DELETE" }),
};

// ─── Locations (Districts / Taluks / Hoblis) ───────────
export const districtApi = {
  getAll: () => request("/hierarchy/districts"),
  create: (data) =>
    request("/hierarchy/districts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/hierarchy/districts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) => request(`/hierarchy/districts/${id}`, { method: "DELETE" }),
};

export const talukApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/hierarchy/taluks${query ? `?${query}` : ""}`);
  },
  create: (data) =>
    request("/hierarchy/taluks", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/hierarchy/taluks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) => request(`/hierarchy/taluks/${id}`, { method: "DELETE" }),
};

export const hobliApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/hierarchy/hoblis${query ? `?${query}` : ""}`);
  },
  create: (data) =>
    request("/hierarchy/hoblis", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/hierarchy/hoblis/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) => request(`/hierarchy/hoblis/${id}`, { method: "DELETE" }),
};

// ─── Inventory / Warehouse ───────────────────────────

export const centralStockApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/inventory/central-stock${query ? `?${query}` : ""}`);
  },
};

export const reservationApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/inventory/reservations${query ? `?${query}` : ""}`);
  },
  create: (data) =>
    request("/inventory/reservations", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/inventory/reservations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) => request(`/inventory/reservations/${id}`, { method: "DELETE" }),
};

export const reorderSuggestionApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/inventory/reorder-suggestions${query ? `?${query}` : ""}`);
  },
  create: (data) =>
    request("/inventory/reorder-suggestions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/inventory/reorder-suggestions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  toggle: (id) =>
    request(`/inventory/reorder-suggestions/${id}/toggle`, { method: "PATCH" }),
  delete: (id) =>
    request(`/inventory/reorder-suggestions/${id}`, { method: "DELETE" }),
};

export const binRackApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/inventory/bin-rack${query ? `?${query}` : ""}`);
  },
  create: (data) =>
    request("/inventory/bin-rack", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/inventory/bin-rack/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) => request(`/inventory/bin-rack/${id}`, { method: "DELETE" }),
};

// ─── Pricing ──────────────────────────────────────────

export const centralPriceApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/pricing/central${query ? `?${query}` : ""}`);
  },
  create: (data) =>
    request("/pricing/central", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/pricing/central/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) => request(`/pricing/central/${id}`, { method: "DELETE" }),
};

export const franchiseTierApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/pricing/franchise${query ? `?${query}` : ""}`);
  },
  create: (data) =>
    request("/pricing/franchise", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/pricing/franchise/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) => request(`/pricing/franchise/${id}`, { method: "DELETE" }),
};

export const damageReportApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/inventory/damage-reports${query ? `?${query}` : ""}`);
  },
  create: (data) =>
    request("/inventory/damage-reports", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/inventory/damage-reports/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  updateStatus: (id, status) =>
    request(`/inventory/damage-reports/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  delete: (id) =>
    request(`/inventory/damage-reports/${id}`, { method: "DELETE" }),
};

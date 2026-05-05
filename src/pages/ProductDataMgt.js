import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdFilterList, MdAdd, MdDelete, MdEdit, MdKeyboardArrowDown, MdClose, MdCloudUpload } from 'react-icons/md';
import { productApi, categoryApi } from '../services/api';
import Loader from '../components/Loader';
import './ProductDataMgt.css';

const API_URL = process.env.REACT_APP_API_URL ? '' : 'http://localhost:5000';

const emptyForm = {
  productName: '',
  category: '',
  brand: '',
  stock: '',
  skuCode: '',
  hsnCode: '',
  gst: '',
  price: '',
  originalPrice: '',
  description: '',
};

export default function ProductDataMgt() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Basic form
  const [form, setForm] = useState({ ...emptyForm });

  // Multiple images: new files + existing URLs
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // Key features
  const [keyFeatures, setKeyFeatures] = useState([]);

  // Specifications: array of { group, fields: [{key, value}] }
  const [specGroups, setSpecGroups] = useState([]);

  // Overview sections
  const [overview, setOverview] = useState([]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      const data = await productApi.getAll(params);
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err.message);
    }
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(), 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const toggleActive = async (id) => {
    setTogglingId(id);
    try {
      const updated = await productApi.toggle(id);
      setProducts((prev) => prev.map((p) => (p._id === updated._id ? { ...p, active: updated.active } : p)));
    } catch (err) { alert(err.message); }
    finally { setTogglingId(null); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setDeletingId(id);
    try {
      await productApi.delete(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) { alert(err.message); }
    finally { setDeletingId(null); }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFiles = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const removeNewImage = (idx) => setNewImages((prev) => prev.filter((_, i) => i !== idx));
  const removeExistingImage = (idx) => setExistingImages((prev) => prev.filter((_, i) => i !== idx));

  const resetForm = () => {
    setForm({ ...emptyForm });
    setNewImages([]);
    setExistingImages([]);
    setKeyFeatures([]);
    setSpecGroups([]);
    setOverview([]);
    setEditingProduct(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = async (product) => {
    // Fetch full product data
    try {
      const full = await productApi.getById(product._id);
      const p = full.product || full;
      setEditingProduct(p);
      setForm({
        productName: p.name || '',
        category: p.category?._id || p.category || '',
        brand: p.brand || '',
        stock: String(p.stock || 0),
        skuCode: p.skuCode || '',
        hsnCode: p.hsnCode || '',
        gst: String(p.gst || 0),
        price: String(p.price || ''),
        originalPrice: String(p.originalPrice || ''),
        description: p.description || '',
      });
      setExistingImages(p.images?.length ? [...p.images] : p.image ? [p.image] : []);
      setNewImages([]);
      setKeyFeatures(p.keyFeatures?.length ? [...p.keyFeatures] : []);

      // Convert specs object to editable array
      if (p.specifications && typeof p.specifications === 'object') {
        const groups = Object.entries(p.specifications).map(([group, fields]) => ({
          group,
          fields: Object.entries(fields).map(([key, value]) => ({ key, value: String(value) })),
        }));
        setSpecGroups(groups);
      } else {
        setSpecGroups([]);
      }

      setOverview(p.overview?.length ? p.overview.map(o => ({ heading: o.heading || '', body: o.body || '' })) : []);
      setShowModal(true);
    } catch (err) {
      alert('Failed to load product details: ' + err.message);
    }
  };

  const handleSave = async () => {
    if (!form.productName.trim() || !form.skuCode.trim() || !form.price.trim()) {
      alert('Product Name, SKU Code, and Price are required');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.productName);
      formData.append('category', form.category);
      formData.append('brand', form.brand);
      formData.append('stock', form.stock || '0');
      formData.append('skuCode', form.skuCode);
      formData.append('hsnCode', form.hsnCode);
      formData.append('gst', form.gst || '0');
      formData.append('price', form.price);
      formData.append('originalPrice', form.originalPrice || '0');
      formData.append('description', form.description);

      // Images
      newImages.forEach((file) => formData.append('images', file));
      formData.append('existingImages', JSON.stringify(existingImages));

      // Key features
      const cleanFeatures = keyFeatures.filter(f => f.trim());
      formData.append('keyFeatures', JSON.stringify(cleanFeatures));

      // Specifications: convert array back to nested object
      const specsObj = {};
      specGroups.forEach((g) => {
        if (!g.group.trim()) return;
        specsObj[g.group.trim()] = {};
        g.fields.forEach((f) => {
          if (f.key.trim()) specsObj[g.group.trim()][f.key.trim()] = f.value;
        });
      });
      formData.append('specifications', JSON.stringify(specsObj));

      // Overview
      const cleanOverview = overview.filter(o => o.heading.trim() || o.body.trim());
      formData.append('overview', JSON.stringify(cleanOverview));

      let result;
      if (editingProduct) {
        result = await productApi.update(editingProduct._id, formData);
      } else {
        result = await productApi.create(formData);
      }

      if (editingProduct) {
        setProducts((prev) => prev.map((p) => (p._id === result._id ? result : p)));
      } else {
        setProducts((prev) => [result, ...prev]);
      }
      resetForm();
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => { resetForm(); setShowModal(false); };

  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/60x60/cccccc/ffffff?text=IMG';
    if (img.startsWith('http')) return img;
    return `${API_URL}${img}`;
  };

  // ── Key features helpers ──
  const addFeature = () => setKeyFeatures(prev => [...prev, '']);
  const updateFeature = (idx, val) => setKeyFeatures(prev => prev.map((f, i) => i === idx ? val : f));
  const removeFeature = (idx) => setKeyFeatures(prev => prev.filter((_, i) => i !== idx));

  // ── Spec group helpers ──
  const addSpecGroup = () => setSpecGroups(prev => [...prev, { group: '', fields: [{ key: '', value: '' }] }]);
  const removeSpecGroup = (idx) => setSpecGroups(prev => prev.filter((_, i) => i !== idx));
  const updateSpecGroup = (idx, val) => setSpecGroups(prev => prev.map((g, i) => i === idx ? { ...g, group: val } : g));
  const addSpecField = (gIdx) => setSpecGroups(prev => prev.map((g, i) => i === gIdx ? { ...g, fields: [...g.fields, { key: '', value: '' }] } : g));
  const removeSpecField = (gIdx, fIdx) => setSpecGroups(prev => prev.map((g, i) => i === gIdx ? { ...g, fields: g.fields.filter((_, j) => j !== fIdx) } : g));
  const updateSpecField = (gIdx, fIdx, field, val) => setSpecGroups(prev => prev.map((g, i) =>
    i === gIdx ? { ...g, fields: g.fields.map((f, j) => j === fIdx ? { ...f, [field]: val } : f) } : g
  ));

  // ── Overview helpers ──
  const addOverview = () => setOverview(prev => [...prev, { heading: '', body: '' }]);
  const removeOverview = (idx) => setOverview(prev => prev.filter((_, i) => i !== idx));
  const updateOverview = (idx, field, val) => setOverview(prev => prev.map((o, i) => i === idx ? { ...o, [field]: val } : o));

  return (
    <div className="pdm-page">
      <h1 className="pdm-title">PRODUCT & MASTER DATA MANAGEMENT</h1>

      {/* Toolbar */}
      <div className="pdm-toolbar">
        <div className="pdm-toolbar-left">
          <button className="pdm-filter-btn">
            <MdFilterList /> Filter <MdKeyboardArrowDown />
          </button>
          <div className="pdm-search">
            <MdSearch className="pdm-search-icon" />
            <input type="text" placeholder="Search by Product" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="pdm-toolbar-right">
          <button className="pdm-add-btn" onClick={openAddModal}> Add Product <MdAdd /></button>
          <button className="pdm-add-btn outline" onClick={() => navigate('/products/attributes')}>Add Attribute & Variants</button>
          <button className="pdm-add-btn outline" onClick={() => navigate('/products/categories')}>Category / Subcategory</button>
        </div>
      </div>

      {error && <div style={{ color: '#ef4444', padding: '8px 0' }}>{error}</div>}

      {/* Table */}
      <div className="pdm-table-wrapper">
        <table className="pdm-table">
          <thead>
            <tr>
              <th>Sl. No</th><th>Product Name</th><th>Category</th><th>Brand</th><th>Product Image</th>
              <th>SKU Code</th><th>HSN Code</th><th>Stock</th><th>GST %</th><th>MRP</th><th>Price</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="12"><Loader overlay={false} /></td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="12" className="pdm-empty">No products found.</td></tr>
            ) : (
              products.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.category?.name || '-'}</td>
                  <td>{product.brand}</td>
                  <td><img src={getImageUrl(product.image)} alt={product.name} className="pdm-product-img" /></td>
                  <td>{product.skuCode}</td>
                  <td>{product.hsnCode}</td>
                  <td>{product.stock}</td>
                  <td>{product.gst}%</td>
                  <td>{product.originalPrice ? `₹${product.originalPrice.toLocaleString('en-IN')}` : '-'}</td>
                  <td>₹{product.price?.toLocaleString('en-IN')}</td>
                  <td>
                    <div className="pdm-actions">
                      <button className="pdm-edit-btn" onClick={() => openEditModal(product)} title="Edit">
                        <MdEdit />
                      </button>
                      <label className="pdm-toggle">
                        <input type="checkbox" checked={product.active} onChange={() => toggleActive(product._id)} disabled={togglingId === product._id} />
                        <span className={`pdm-toggle-slider ${togglingId === product._id ? 'pdm-toggle-loading' : ''}`} />
                      </label>
                      <button className="pdm-delete-btn" onClick={() => deleteProduct(product._id)} disabled={deletingId === product._id}>
                        {deletingId === product._id ? <Loader size="small" /> : <MdDelete />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="pdm-modal-overlay">
          <div className="pdm-modal pdm-modal--wide">
            {saving && <Loader />}
            <div className="pdm-modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button className="pdm-modal-close" onClick={handleCancel}><MdClose /></button>
            </div>
            <div className="pdm-modal-body">
              {/* Section: Basic Info */}
              <h3 className="pdm-section-title">Basic Information</h3>
              <div className="pdm-modal-grid">
                <div className="pdm-modal-field">
                  <label>Product Name *</label>
                  <input type="text" name="productName" placeholder="Enter product name" value={form.productName} onChange={handleFormChange} />
                </div>
                <div className="pdm-modal-field">
                  <label>Category *</label>
                  <select name="category" value={form.category} onChange={handleFormChange}>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                  </select>
                </div>
                <div className="pdm-modal-field">
                  <label>Brand</label>
                  <input type="text" name="brand" placeholder="Enter brand" value={form.brand} onChange={handleFormChange} />
                </div>
                <div className="pdm-modal-field">
                  <label>SKU Code *</label>
                  <input type="text" name="skuCode" placeholder="Enter SKU code" value={form.skuCode} onChange={handleFormChange} />
                </div>
                <div className="pdm-modal-field">
                  <label>HSN Code</label>
                  <input type="text" name="hsnCode" placeholder="Enter HSN code" value={form.hsnCode} onChange={handleFormChange} />
                </div>
                <div className="pdm-modal-field">
                  <label>Stock Available</label>
                  <input type="number" name="stock" placeholder="0" value={form.stock} onChange={handleFormChange} />
                </div>
              </div>

              {/* Section: Pricing */}
              <h3 className="pdm-section-title">Pricing</h3>
              <div className="pdm-modal-grid">
                <div className="pdm-modal-field">
                  <label>Selling Price *</label>
                  <input type="text" name="price" placeholder="Enter selling price" value={form.price} onChange={handleFormChange} />
                </div>
                <div className="pdm-modal-field">
                  <label>Original Price (MRP)</label>
                  <input type="text" name="originalPrice" placeholder="Enter MRP" value={form.originalPrice} onChange={handleFormChange} />
                </div>
                <div className="pdm-modal-field">
                  <label>GST %</label>
                  <input type="text" name="gst" placeholder="Enter GST %" value={form.gst} onChange={handleFormChange} />
                </div>
              </div>

              {/* Section: Images */}
              <h3 className="pdm-section-title">Product Images</h3>
              <div className="pdm-images-row">
                {existingImages.map((url, i) => (
                  <div key={`ex-${i}`} className="pdm-img-thumb">
                    <img src={url} alt={`Img ${i + 1}`} />
                    <button className="pdm-img-remove" onClick={() => removeExistingImage(i)}><MdClose /></button>
                  </div>
                ))}
                {newImages.map((file, i) => (
                  <div key={`new-${i}`} className="pdm-img-thumb">
                    <img src={URL.createObjectURL(file)} alt={file.name} />
                    <button className="pdm-img-remove" onClick={() => removeNewImage(i)}><MdClose /></button>
                  </div>
                ))}
                <label className="pdm-img-add">
                  <MdCloudUpload size={24} />
                  <span>Add Images</span>
                  <input type="file" accept="image/*" multiple hidden onChange={handleImageFiles} />
                </label>
              </div>

              {/* Section: Description */}
              <h3 className="pdm-section-title">Description</h3>
              <textarea
                className="pdm-textarea"
                name="description"
                placeholder="Enter product description..."
                value={form.description}
                onChange={handleFormChange}
                rows={3}
              />

              {/* Section: Key Features */}
              <div className="pdm-section-header">
                <h3 className="pdm-section-title">Key Features</h3>
                <button type="button" className="pdm-add-small" onClick={addFeature}><MdAdd /> Add</button>
              </div>
              {keyFeatures.map((feat, i) => (
                <div key={i} className="pdm-inline-row">
                  <input type="text" placeholder={`Feature ${i + 1}`} value={feat} onChange={(e) => updateFeature(i, e.target.value)} />
                  <button className="pdm-remove-sm" onClick={() => removeFeature(i)}><MdClose /></button>
                </div>
              ))}

              {/* Section: Specifications */}
              <div className="pdm-section-header">
                <h3 className="pdm-section-title">Specifications</h3>
                <button type="button" className="pdm-add-small" onClick={addSpecGroup}><MdAdd /> Add Group</button>
              </div>
              {specGroups.map((grp, gIdx) => (
                <div key={gIdx} className="pdm-spec-group">
                  <div className="pdm-spec-group-header">
                    <input type="text" className="pdm-spec-group-name" placeholder="Group name (e.g. Screen Specifications)" value={grp.group} onChange={(e) => updateSpecGroup(gIdx, e.target.value)} />
                    <button className="pdm-remove-sm" onClick={() => removeSpecGroup(gIdx)}><MdClose /></button>
                  </div>
                  {grp.fields.map((field, fIdx) => (
                    <div key={fIdx} className="pdm-spec-field-row">
                      <input type="text" placeholder="Key" value={field.key} onChange={(e) => updateSpecField(gIdx, fIdx, 'key', e.target.value)} />
                      <input type="text" placeholder="Value" value={field.value} onChange={(e) => updateSpecField(gIdx, fIdx, 'value', e.target.value)} />
                      <button className="pdm-remove-sm" onClick={() => removeSpecField(gIdx, fIdx)}><MdClose /></button>
                    </div>
                  ))}
                  <button type="button" className="pdm-add-field" onClick={() => addSpecField(gIdx)}>+ Add Field</button>
                </div>
              ))}

              {/* Section: Overview */}
              <div className="pdm-section-header">
                <h3 className="pdm-section-title">Overview Sections</h3>
                <button type="button" className="pdm-add-small" onClick={addOverview}><MdAdd /> Add</button>
              </div>
              {overview.map((ov, i) => (
                <div key={i} className="pdm-overview-block">
                  <div className="pdm-inline-row">
                    <input type="text" placeholder="Section heading" value={ov.heading} onChange={(e) => updateOverview(i, 'heading', e.target.value)} />
                    <button className="pdm-remove-sm" onClick={() => removeOverview(i)}><MdClose /></button>
                  </div>
                  <textarea className="pdm-textarea" placeholder="Section body..." value={ov.body} onChange={(e) => updateOverview(i, 'body', e.target.value)} rows={2} />
                </div>
              ))}
            </div>
            <div className="pdm-modal-footer">
              <button className="pdm-modal-btn cancel" onClick={handleCancel} disabled={saving}>Cancel</button>
              <button className="pdm-modal-btn save" onClick={handleSave} disabled={saving}>
                {saving ? <><Loader size="small" /> {editingProduct ? 'Updating...' : 'Saving...'}</> : editingProduct ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

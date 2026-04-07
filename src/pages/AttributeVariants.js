import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdDelete, MdCloudUpload, MdArrowBack } from 'react-icons/md';
import { attributeVariantApi, productApi } from '../services/api';
import Loader from '../components/Loader';
import './AttributeVariants.css';

export default function AttributeVariants() {
  const navigate = useNavigate();
  const [attributes, setAttributes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState({
    product: '',
    size: '',
    color: '',
    specification: '',
  });
  const [bulkFile, setBulkFile] = useState(null);

  const fetchVariants = useCallback(async (searchTerm = '') => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      const data = await attributeVariantApi.getAll(params);
      setAttributes(data);
    } catch (err) {
      setError('Failed to load attribute variants. Please try again.');
      console.error('fetchVariants error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const data = await productApi.getAll();
      setProducts(data.products || []);
    } catch (err) {
      console.error('fetchProducts error:', err);
    }
  }, []);

  useEffect(() => {
    fetchVariants();
    fetchProducts();
  }, [fetchVariants, fetchProducts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVariants(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, fetchVariants]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    if (!form.product) {
      setError('Please select a product.');
      return;
    }
    const selectedProduct = products.find((p) => p._id === form.product);
    if (!selectedProduct) {
      setError('Selected product not found.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await attributeVariantApi.create({
        product: selectedProduct._id,
        productName: selectedProduct.name,
        size: form.size,
        color: form.color,
        specification: form.specification,
      });
      setForm({ product: '', size: '', color: '', specification: '' });
      fetchVariants(search);
    } catch (err) {
      setError(err.message || 'Failed to add attribute variant.');
      console.error('handleAdd error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleBulkAdd = () => {
    if (bulkFile) {
      alert('Bulk upload via CSV is coming soon!');
      setBulkFile(null);
    }
  };

  const toggleActive = async (id) => {
    setTogglingId(id);
    try {
      await attributeVariantApi.toggle(id);
      setAttributes((prev) =>
        prev.map((a) => (a._id === id ? { ...a, active: !a.active } : a))
      );
    } catch (err) {
      setError('Failed to update status. Please try again.');
      console.error('toggleActive error:', err);
    } finally {
      setTogglingId(null);
    }
  };

  const deleteAttribute = async (id) => {
    if (!window.confirm('Are you sure you want to delete this attribute variant?')) {
      return;
    }
    setDeletingId(id);
    try {
      await attributeVariantApi.delete(id);
      setAttributes((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      setError('Failed to delete attribute variant. Please try again.');
      console.error('deleteAttribute error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="av-page">
      {saving && <Loader />}

      <div className="av-header-row">
        <button className="av-back-btn" onClick={() => navigate('/products')}>
          <MdArrowBack />
        </button>
        <h1 className="av-title">PRODUCT & MASTER DATA MANAGEMENT</h1>
      </div>

      {error && (
        <div className="av-error" style={{ color: '#d32f2f', padding: '8px 16px', margin: '0 16px' }}>
          {error}
        </div>
      )}

      <div className="av-content">
        {/* Left Panel */}
        <div className="av-left-panel">
          <div className="av-card">
            <h3 className="av-card-title">Add Attribute & Variants</h3>
            <div className="av-form">
              <div className="av-field">
                <label>Product Name</label>
                <select
                  name="product"
                  value={form.product}
                  onChange={handleFormChange}
                >
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="av-field">
                <label>Size</label>
                <input
                  type="text"
                  name="size"
                  placeholder="Enter size"
                  value={form.size}
                  onChange={handleFormChange}
                />
              </div>
              <div className="av-field">
                <label>Color</label>
                <input
                  type="text"
                  name="color"
                  placeholder="Enter color"
                  value={form.color}
                  onChange={handleFormChange}
                />
              </div>
              <div className="av-field">
                <label>Specification</label>
                <input
                  type="text"
                  name="specification"
                  placeholder="Enter specification"
                  value={form.specification}
                  onChange={handleFormChange}
                />
              </div>
              <button className="av-add-btn" onClick={handleAdd} disabled={saving}>
                {saving ? <><Loader size="small" /> Adding...</> : 'Add'}
              </button>
            </div>

            <div className="av-bulk-section">
              <h4 className="av-bulk-title">Add Bulk Upload</h4>
              <a href="#!" className="av-bulk-link">
                *Bulk through EXS/CSV
              </a>
              <div className="av-file-input-wrapper">
                <MdCloudUpload className="av-file-icon" />
                <span>{bulkFile ? bulkFile.name : 'Choose file'}</span>
                <input
                  type="file"
                  accept=".xls,.xlsx,.csv"
                  onChange={(e) => setBulkFile(e.target.files[0] || null)}
                />
              </div>
              <button className="av-add-btn" onClick={handleBulkAdd}>
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="av-right-panel">
          <div className="av-card">
            <div className="av-table-header">
              <h3 className="av-card-title">Attributes & Variants</h3>
              <div className="av-search">
                <MdSearch className="av-search-icon" />
                <input
                  type="text"
                  placeholder="Search by Product Name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="av-table-wrapper">
              {loading ? (
                <Loader overlay={false} />
              ) : (
                <table className="av-table">
                  <thead>
                    <tr>
                      <th>Sl.No</th>
                      <th>Product Name</th>
                      <th>Size</th>
                      <th>Color</th>
                      <th>Specification</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attributes.map((attr, index) => (
                      <tr key={attr._id}>
                        <td>{index + 1}</td>
                        <td>{attr.productName}</td>
                        <td>{attr.size}</td>
                        <td>{attr.color}</td>
                        <td className="av-spec-cell">{attr.specification}</td>
                        <td>
                          <div className="av-actions">
                            <label className="av-toggle">
                              <input
                                type="checkbox"
                                checked={attr.active}
                                onChange={() => toggleActive(attr._id)}
                                disabled={togglingId === attr._id}
                              />
                              <span className={`av-toggle-slider ${togglingId === attr._id ? 'av-toggle-loading' : ''}`} />
                            </label>
                            <button
                              className="av-delete-btn"
                              onClick={() => deleteAttribute(attr._id)}
                              disabled={deletingId === attr._id}
                            >
                              {deletingId === attr._id ? <Loader size="small" /> : <MdDelete />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {attributes.length === 0 && (
                      <tr>
                        <td colSpan="6" className="av-empty">
                          No attributes found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

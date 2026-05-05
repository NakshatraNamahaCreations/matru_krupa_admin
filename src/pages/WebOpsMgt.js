import React, { useState, useEffect, useRef } from 'react';
import {
  MdEdit,
  MdDelete,
  MdVisibility,
  MdCloudUpload,
  MdAdd,
  MdArrowBack,
} from 'react-icons/md';
import { bannerApi } from '../services/api';
import Loader from '../components/Loader';
import './WebOpsMgt.css';

/* ==============================
   SAMPLE DATA
   ============================== */

const initialCategories = [
  { id: 1, title: 'Featured Electronics', categories: 'Television, Laptop, Refrigerator', layout: 'Carousel', visibility: 'Website', status: 'Active' },
  { id: 2, title: 'Shop By Category', categories: 'Desktops, Laptop, Smart Watch', layout: 'Grid', visibility: 'Website', status: 'Active' },
  { id: 3, title: 'Explore Now', categories: 'Headphones, Home Audio, Camera & Accessories', layout: 'Grid', visibility: 'Website', status: 'Active' },
];

const initialCollections = [
  { id: 1, name: "Best of Tv's", products: 12, tags: 'TV Deals', visibility: 'Website', status: 'Active' },
  { id: 2, name: 'Featured For You', products: 30, tags: 'Flash Sale', visibility: 'Website', status: 'Active' },
  { id: 3, name: 'Home Appliances Sale', products: 18, tags: 'Hot Deals', visibility: 'Website', status: 'Active' },
];

const initialPopups = [
  { id: 1, name: 'New Year Sale', type: 'Offer', validFrom: '27/12/2025', validTo: '02/01/2025', visibility: 'Website', status: 'Scheduled' },
  { id: 2, name: 'Christmas Sale', type: 'Offer', validFrom: '20/12/2025', validTo: '27/12/2025', visibility: 'Website', status: 'Active' },
  { id: 3, name: 'Welcome Offer', type: 'Banner', validFrom: '19/11/2025', validTo: '03/12/2025', visibility: 'Website', status: 'Inactive' },
];

/* ==============================
   STATUS BADGE
   ============================== */

function StatusBadge({ status }) {
  let cls = 'webops-badge ';
  if (status === 'Active') cls += 'webops-badge-green';
  else if (status === 'Scheduled') cls += 'webops-badge-orange';
  else if (status === 'Inactive') cls += 'webops-badge-red';
  return <span className={cls}>{status}</span>;
}

/* ==============================
   TAB 1 — HOME BANNERS
   ============================== */

function HomeBannersTab() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState({ title: '', type: 'hero' });
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('No File Chosen');
  const fileRef = useRef();

  useEffect(() => {
    bannerApi.getAll({ type: 'hero' })
      .then(setBanners)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setFileName(f.name); }
  };

  const handleUpload = async () => {
    if (!file || !form.title) return alert('Please add a title and select an image.');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('title', form.title);
      fd.append('type', form.type);
      const created = await bannerApi.create(fd);
      setBanners((prev) => [created, ...prev]);
      setFile(null); setFileName('No File Chosen'); setForm({ title: '', type: 'hero' });
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleToggle = async (id) => {
    setTogglingId(id);
    try {
      const updated = await bannerApi.toggle(id);
      setBanners((prev) => prev.map((b) => (b._id === id ? updated : b)));
    } catch (err) { alert(err.message); }
    finally { setTogglingId(null); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    setDeletingId(id);
    try {
      await bannerApi.delete(id);
      setBanners((prev) => prev.filter((b) => b._id !== id));
    } catch (err) { alert(err.message); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="webops-banners-layout">
      {uploading && <Loader />}

      {/* Left: Add Banner */}
      <div className="webops-card webops-banner-add">
        <h3 className="webops-card-title">Add Banner</h3>
        <label className="webops-label">Banner Title *</label>
        <input
          className="webops-input"
          placeholder="e.g. Summer Sale Banner"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{ marginBottom: 12 }}
        />
        <label className="webops-label">Banner Type</label>
        <select className="webops-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ marginBottom: 12 }}>
          <option value="hero">Hero Slider</option>
          <option value="promo">Promo Banner</option>
          <option value="deal">Deal Banner</option>
        </select>
        <label className="webops-label">Banner Image</label>
        <p className="webops-hint">(Recommended: 1440 x 500px)</p>
        <div className="webops-file-chooser">
          <label className="webops-file-label">
            Choose File
            <input type="file" accept="image/*" hidden ref={fileRef} onChange={handleFileChange} />
          </label>
          <span className="webops-file-name">{fileName}</span>
        </div>
        {file && <img src={URL.createObjectURL(file)} alt="preview" style={{ width: '100%', borderRadius: 8, marginTop: 10, maxHeight: 120, objectFit: 'cover' }} />}
        <button className="webops-btn webops-btn-blue" onClick={handleUpload} disabled={uploading} style={{ marginTop: 12 }}>
          {uploading
            ? <><Loader size="small" /> Uploading...</>
            : <><MdCloudUpload style={{ marginRight: 6 }} />Upload to Cloudinary</>
          }
        </button>
      </div>

      {/* Right: Banner List */}
      <div className="webops-card webops-banner-list">
        <h3 className="webops-card-title">Banner List</h3>
        {loading ? (
          <Loader overlay={false} />
        ) : (
          <table className="webops-table">
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>Banner Image</th>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((b, i) => (
                <tr key={b._id}>
                  <td>{i + 1}</td>
                  <td>
                    {b.image
                      ? <img src={b.image} alt={b.title} style={{ width: 80, height: 44, objectFit: 'cover', borderRadius: 6 }} />
                      : <div className="webops-banner-placeholder" style={{ background: '#ccc' }}>{b.title}</div>
                    }
                  </td>
                  <td>{b.title}</td>
                  <td style={{ textTransform: 'capitalize' }}>{b.type}</td>
                  <td><StatusBadge status={b.active ? 'Active' : 'Inactive'} /></td>
                  <td>
                    <button
                      className="webops-icon-btn"
                      onClick={() => handleToggle(b._id)}
                      title="Toggle"
                      disabled={togglingId === b._id}
                    >
                      {togglingId === b._id ? <Loader size="small" /> : b.active ? '🟢' : '🔴'}
                    </button>
                    <button
                      className="webops-icon-btn webops-icon-orange"
                      onClick={() => handleDelete(b._id)}
                      disabled={deletingId === b._id}
                    >
                      {deletingId === b._id ? <Loader size="small" /> : <MdDelete />}
                    </button>
                  </td>
                </tr>
              ))}
              {banners.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8' }}>No banners yet. Upload your first banner.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ==============================
   TAB 2 — CATEGORY SECTION
   ============================== */

function CategorySectionTab() {
  const [data, setData] = useState(initialCategories);
  const [formVisible, setFormVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: '', categories: '', layout: 'Grid', visibility: 'Website', status: 'Active' });

  const openAdd = () => {
    setEditItem(null);
    setForm({ title: '', categories: '', layout: 'Grid', visibility: 'Website', status: 'Active' });
    setFormVisible(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ title: item.title, categories: item.categories, layout: item.layout, visibility: item.visibility, status: item.status });
    setFormVisible(true);
  };

  const handleSave = () => {
    if (editItem) {
      setData((prev) => prev.map((d) => (d.id === editItem.id ? { ...d, ...form } : d)));
    } else {
      setData((prev) => [...prev, { id: Date.now(), ...form }]);
    }
    setFormVisible(false);
  };

  const handleDelete = (id) => setData((prev) => prev.filter((d) => d.id !== id));

  if (formVisible) {
    return (
      <div className="webops-card">
        <h3 className="webops-card-title">
          <MdArrowBack className="webops-back-icon" onClick={() => setFormVisible(false)} />
          {editItem ? 'Edit Category Section' : 'Add Category Section'}
        </h3>
        <div className="webops-form">
          <div className="webops-form-row webops-form-full">
            <label className="webops-label">Section Title</label>
            <input className="webops-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="webops-form-row webops-form-half">
            <div className="webops-form-group">
              <label className="webops-label">Categories</label>
              <select className="webops-select" value={form.categories} onChange={(e) => setForm({ ...form, categories: e.target.value })}>
                <option value="">Select</option>
                <option value="Television, Laptop, Refrigerator">Television, Laptop, Refrigerator</option>
                <option value="Desktops, Laptop, Smart Watch">Desktops, Laptop, Smart Watch</option>
                <option value="Headphones, Home Audio, Camera & Accessories">Headphones, Home Audio, Camera & Accessories</option>
              </select>
            </div>
            <div className="webops-form-group">
              <label className="webops-label">Visibility</label>
              <select className="webops-select" value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}>
                <option value="Website">Website</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </div>
          <div className="webops-form-row webops-form-half">
            <div className="webops-form-group">
              <label className="webops-label">Layout</label>
              <select className="webops-select" value={form.layout} onChange={(e) => setForm({ ...form, layout: e.target.value })}>
                <option value="Grid">Grid</option>
                <option value="Carousel">Carousel</option>
                <option value="List">List</option>
              </select>
            </div>
            <div className="webops-form-group">
              <label className="webops-label">Status</label>
              <select className="webops-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="webops-form-actions">
            <button className="webops-btn webops-btn-blue" onClick={handleSave}>Save</button>
            <button className="webops-btn webops-btn-red" onClick={() => setFormVisible(false)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="webops-card">
      <div className="webops-card-header">
        <h3 className="webops-card-title">Category Sections</h3>
        <button className="webops-btn webops-btn-blue" onClick={openAdd}><MdAdd style={{ marginRight: 4 }} />Add</button>
      </div>
      <table className="webops-table webops-table-blue">
        <thead>
          <tr>
            <th>Sl.No</th>
            <th>Section Title</th>
            <th>Categories</th>
            <th>Layout</th>
            <th>Visibility</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={d.id}>
              <td>{i + 1}</td>
              <td>{d.title}</td>
              <td>{d.categories}</td>
              <td>{d.layout}</td>
              <td>{d.visibility}</td>
              <td><StatusBadge status={d.status} /></td>
              <td className="webops-action-cell">
                <button className="webops-icon-btn webops-icon-blue" onClick={() => openEdit(d)}><MdEdit /></button>
                <button className="webops-icon-btn webops-icon-orange" onClick={() => handleDelete(d.id)}><MdDelete /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ==============================
   TAB 3 — COLLECTIONS
   ============================== */

function CollectionsTab() {
  const [data, setData] = useState(initialCollections);
  const [formVisible, setFormVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', products: '', tags: '', visibility: 'Website', status: 'Active' });

  const openAdd = () => {
    setEditItem(null);
    setForm({ name: '', products: '', tags: '', visibility: 'Website', status: 'Active' });
    setFormVisible(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, products: String(item.products), tags: item.tags, visibility: item.visibility, status: item.status });
    setFormVisible(true);
  };

  const handleSave = () => {
    if (editItem) {
      setData((prev) => prev.map((d) => (d.id === editItem.id ? { ...d, ...form, products: Number(form.products) || 0 } : d)));
    } else {
      setData((prev) => [...prev, { id: Date.now(), ...form, products: Number(form.products) || 0 }]);
    }
    setFormVisible(false);
  };

  const handleDelete = (id) => setData((prev) => prev.filter((d) => d.id !== id));

  if (formVisible) {
    return (
      <div className="webops-card">
        <h3 className="webops-card-title">
          <MdArrowBack className="webops-back-icon" onClick={() => setFormVisible(false)} />
          {editItem ? 'Edit Collection' : 'Add Collection'}
        </h3>
        <div className="webops-form">
          <div className="webops-form-row webops-form-full">
            <label className="webops-label">Collection Name</label>
            <input className="webops-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="webops-form-row webops-form-half">
            <div className="webops-form-group">
              <label className="webops-label">Products</label>
              <input className="webops-input" value={form.products} onChange={(e) => setForm({ ...form, products: e.target.value })} />
            </div>
            <div className="webops-form-group">
              <label className="webops-label">Visibility</label>
              <select className="webops-select" value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}>
                <option value="Website">Website</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </div>
          <div className="webops-form-row webops-form-full">
            <label className="webops-label">Tags</label>
            <input className="webops-input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>
          <div className="webops-form-row webops-form-half">
            <div className="webops-form-group">
              <label className="webops-label">Status</label>
              <select className="webops-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="webops-form-group" />
          </div>
          <div className="webops-form-actions">
            <button className="webops-btn webops-btn-blue" onClick={handleSave}>Save</button>
            <button className="webops-btn webops-btn-red" onClick={() => setFormVisible(false)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="webops-card">
      <div className="webops-card-header">
        <h3 className="webops-card-title">Collections</h3>
        <button className="webops-btn webops-btn-dark" onClick={openAdd}><MdAdd style={{ marginRight: 4 }} />Add Collection</button>
      </div>
      <table className="webops-table">
        <thead>
          <tr>
            <th>Collection Name</th>
            <th>Products</th>
            <th>Tags</th>
            <th>Visibility</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.products}</td>
              <td>{d.tags}</td>
              <td>{d.visibility}</td>
              <td><StatusBadge status={d.status} /></td>
              <td className="webops-action-cell">
                <button className="webops-icon-btn webops-icon-blue" onClick={() => openEdit(d)}><MdEdit /></button>
                <button className="webops-icon-btn webops-icon-orange" onClick={() => handleDelete(d.id)}><MdDelete /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ==============================
   TAB 4 — POPUPS / OFFER SCHEDULING
   ============================== */

function PopupsTab() {
  const [data, setData] = useState(initialPopups);
  const [formVisible, setFormVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', type: 'Offer', visibility: 'Website', image: null, validFrom: '', validTo: '', status: 'Active' });

  const openAdd = () => {
    setEditItem(null);
    setForm({ name: '', type: 'Offer', visibility: 'Website', image: null, validFrom: '', validTo: '', status: 'Active' });
    setFormVisible(true);
  };

  const openView = (item) => {
    setEditItem(item);
    setForm({ name: item.name, type: item.type, visibility: item.visibility, image: null, validFrom: item.validFrom, validTo: item.validTo, status: item.status });
    setFormVisible(true);
  };

  const handleSave = () => {
    if (editItem) {
      setData((prev) => prev.map((d) => (d.id === editItem.id ? { ...d, name: form.name, type: form.type, visibility: form.visibility, validFrom: form.validFrom, validTo: form.validTo, status: form.status } : d)));
    } else {
      setData((prev) => [...prev, { id: Date.now(), name: form.name, type: form.type, visibility: form.visibility, validFrom: form.validFrom, validTo: form.validTo, status: form.status }]);
    }
    setFormVisible(false);
  };

  const handleDelete = (id) => setData((prev) => prev.filter((d) => d.id !== id));

  if (formVisible) {
    return (
      <div className="webops-card">
        <h3 className="webops-card-title">
          <MdArrowBack className="webops-back-icon" onClick={() => setFormVisible(false)} />
          {editItem ? 'Edit Popup' : 'Create Popup'}
        </h3>
        <div className="webops-form">
          <div className="webops-form-row webops-form-full">
            <label className="webops-label">Popup Name</label>
            <input className="webops-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="webops-form-row webops-form-half">
            <div className="webops-form-group">
              <label className="webops-label">Type</label>
              <select className="webops-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="Offer">Offer</option>
                <option value="Banner">Banner</option>
                <option value="Announcement">Announcement</option>
              </select>
            </div>
            <div className="webops-form-group">
              <label className="webops-label">Visibility</label>
              <select className="webops-select" value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}>
                <option value="Website">Website</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </div>
          <div className="webops-form-row webops-form-full">
            <label className="webops-label">Upload Image</label>
            <div className="webops-file-chooser">
              <label className="webops-file-label">
                Choose File
                <input type="file" accept="image/*" hidden onChange={(e) => setForm({ ...form, image: e.target.files[0] || null })} />
              </label>
              <span className="webops-file-name">{form.image ? form.image.name : 'No File Chosen'}</span>
            </div>
          </div>
          <div className="webops-form-row webops-form-half">
            <div className="webops-form-group">
              <label className="webops-label">Valid From</label>
              <input className="webops-input" type="date" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} />
            </div>
            <div className="webops-form-group">
              <label className="webops-label">Valid To</label>
              <input className="webops-input" type="date" value={form.validTo} onChange={(e) => setForm({ ...form, validTo: e.target.value })} />
            </div>
          </div>
          <div className="webops-form-row webops-form-half">
            <div className="webops-form-group">
              <label className="webops-label">Status</label>
              <select className="webops-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="Active">Active</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="webops-form-group" />
          </div>
          <div className="webops-form-actions">
            <button className="webops-btn webops-btn-blue" onClick={handleSave}>Save</button>
            <button className="webops-btn webops-btn-red" onClick={() => setFormVisible(false)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="webops-card">
      <div className="webops-card-header">
        <h3 className="webops-card-title">Popups / Offer Scheduling</h3>
        <button className="webops-btn webops-btn-blue" onClick={openAdd}><MdAdd style={{ marginRight: 4 }} />Create Popup</button>
      </div>
      <table className="webops-table">
        <thead>
          <tr>
            <th>Popup Name</th>
            <th>Type</th>
            <th>Valid From</th>
            <th>Valid To</th>
            <th>Visibility</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.type}</td>
              <td>{d.validFrom}</td>
              <td>{d.validTo}</td>
              <td>{d.visibility}</td>
              <td><StatusBadge status={d.status} /></td>
              <td className="webops-action-cell">
                <button className="webops-icon-btn webops-icon-green" onClick={() => openView(d)}><MdVisibility /></button>
                <button className="webops-icon-btn webops-icon-orange" onClick={() => handleDelete(d.id)}><MdDelete /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ==============================
   MAIN PAGE COMPONENT
   ============================== */

const TABS = [
  { key: 'banners', label: 'Home Banners' },
  { key: 'categories', label: 'Category Section' },
  { key: 'collections', label: 'Collections' },
  { key: 'popups', label: 'Popups/Offer Scheduling' },
];

export default function WebOpsMgt() {
  const [activeTab, setActiveTab] = useState('banners');

  return (
    <div className="webops-page">
      <h1 className="webops-page-title">Web Operations Management</h1>

      <div className="webops-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`webops-tab ${activeTab === t.key ? 'webops-tab-active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="webops-tab-content">
        {activeTab === 'banners' && <HomeBannersTab />}
        {activeTab === 'categories' && <CategorySectionTab />}
        {activeTab === 'collections' && <CollectionsTab />}
        {activeTab === 'popups' && <PopupsTab />}
      </div>
    </div>
  );
}

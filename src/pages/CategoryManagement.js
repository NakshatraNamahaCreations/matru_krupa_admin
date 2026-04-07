import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdCloudUpload, MdArrowBack, MdEdit, MdDelete, MdClose, MdAdd } from 'react-icons/md';
import { categoryApi } from '../services/api';
import Loader from '../components/Loader';
import './CategoryManagement.css';

const API_URL = process.env.REACT_APP_API_URL ? '' : 'http://localhost:5000';

export default function CategoryManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('category');
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [formMode, setFormMode] = useState('category'); // 'category' | 'subcategory'
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Category / subcategory form
  const [form, setForm] = useState({
    newCategoryName: '',
    parentCategory: '',
    subcategory: '',
    image: null,
  });

  // Filters state: array of { label, options: [] }
  const [filters, setFilters] = useState([]);

  // Editorial state
  const [editorial, setEditorial] = useState({
    title: '',
    intro: '',
    sections: [],
  });

  const fetchCategories = useCallback(async (searchTerm = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await categoryApi.getAll(searchTerm);
      setCategories(data);
    } catch (err) {
      setError(err.message || 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  useEffect(() => {
    const timer = setTimeout(() => fetchCategories(search), 400);
    return () => clearTimeout(timer);
  }, [search, fetchCategories]);

  const getImageUrl = (image) => {
    if (!image) return 'https://via.placeholder.com/120x100/e2e8f0/475569?text=No+Image';
    if (image.startsWith('/uploads/')) return `${API_URL}${image}`;
    return image;
  };

  const allSubcategories = categories.flatMap((cat) =>
    (cat.subcategories || []).map((sub) => ({
      _id: sub._id,
      categoryId: cat._id,
      categoryName: cat.name,
      name: sub.name,
      image: cat.image,
    }))
  );

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm((prev) => ({ ...prev, image: files[0] || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setForm({ newCategoryName: '', parentCategory: '', subcategory: '', image: null });
    setFilters([]);
    setEditorial({ title: '', intro: '', sections: [] });
    setEditingCategory(null);
    setEditingSubcategory(null);
  };

  const handleEditCategory = (cat) => {
    setFormMode('category');
    setEditingCategory(cat);
    setEditingSubcategory(null);
    setForm({ newCategoryName: cat.name, parentCategory: '', subcategory: '', image: null });
    setFilters(cat.filters?.length ? cat.filters.map(f => ({ label: f.label, options: [...f.options] })) : []);
    setEditorial({
      title: cat.editorial?.title || '',
      intro: cat.editorial?.intro || '',
      sections: cat.editorial?.sections?.length
        ? cat.editorial.sections.map(s => ({ heading: s.heading, body: s.body }))
        : [],
    });
    setError('');
  };

  const handleEditSubcategory = (sub) => {
    setFormMode('subcategory');
    setEditingSubcategory({ categoryId: sub.categoryId, sub });
    setEditingCategory(null);
    setForm({ newCategoryName: '', parentCategory: sub.categoryId, subcategory: sub.name, image: null });
    setFilters([]);
    setEditorial({ title: '', intro: '', sections: [] });
    setError('');
  };

  const handleDeleteClick = (type, id, subId, name) => {
    setDeleteConfirm({ type, id, subId, name });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      if (deleteConfirm.type === 'category') {
        await categoryApi.delete(deleteConfirm.id);
      } else {
        await categoryApi.removeSubcategory(deleteConfirm.id, deleteConfirm.subId);
      }
      setDeleteConfirm(null);
      resetForm();
      await fetchCategories(search);
    } catch (err) {
      setError(err.message || 'Failed to delete.');
      setDeleteConfirm(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      if (formMode === 'category') {
        if (!form.newCategoryName.trim()) { setError('Please enter a category name.'); setSaving(false); return; }

        const formData = new FormData();
        formData.append('name', form.newCategoryName.trim());
        if (form.image) formData.append('image', form.image);

        // Add filters (only non-empty)
        const cleanFilters = filters
          .filter(f => f.label.trim())
          .map(f => ({ label: f.label.trim(), options: f.options.filter(o => o.trim()) }));
        formData.append('filters', JSON.stringify(cleanFilters));

        // Add editorial
        const cleanEditorial = {
          title: editorial.title.trim(),
          intro: editorial.intro.trim(),
          sections: editorial.sections
            .filter(s => s.heading.trim() || s.body.trim())
            .map(s => ({ heading: s.heading.trim(), body: s.body.trim() })),
        };
        formData.append('editorial', JSON.stringify(cleanEditorial));

        if (editingCategory) {
          await categoryApi.update(editingCategory._id, formData);
        } else {
          await categoryApi.create(formData);
        }
      } else {
        if (editingSubcategory) {
          if (!form.subcategory.trim()) { setError('Please enter a subcategory name.'); setSaving(false); return; }
          await categoryApi.updateSubcategory(editingSubcategory.categoryId, editingSubcategory.sub._id, form.subcategory.trim());
        } else {
          if (!form.parentCategory) { setError('Please select a parent category.'); setSaving(false); return; }
          if (!form.subcategory.trim()) { setError('Please enter a subcategory name.'); setSaving(false); return; }
          await categoryApi.addSubcategory(form.parentCategory, form.subcategory.trim());
        }
      }
      resetForm();
      await fetchCategories(search);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => { resetForm(); setError(''); };

  // ── Filter helpers ──
  const addFilter = () => setFilters(prev => [...prev, { label: '', options: [''] }]);
  const removeFilter = (idx) => setFilters(prev => prev.filter((_, i) => i !== idx));
  const updateFilterLabel = (idx, val) => setFilters(prev => prev.map((f, i) => i === idx ? { ...f, label: val } : f));
  const addFilterOption = (idx) => setFilters(prev => prev.map((f, i) => i === idx ? { ...f, options: [...f.options, ''] } : f));
  const removeFilterOption = (fIdx, oIdx) => setFilters(prev => prev.map((f, i) => i === fIdx ? { ...f, options: f.options.filter((_, j) => j !== oIdx) } : f));
  const updateFilterOption = (fIdx, oIdx, val) => setFilters(prev => prev.map((f, i) => i === fIdx ? { ...f, options: f.options.map((o, j) => j === oIdx ? val : o) } : f));

  // ── Editorial helpers ──
  const addSection = () => setEditorial(prev => ({ ...prev, sections: [...prev.sections, { heading: '', body: '' }] }));
  const removeSection = (idx) => setEditorial(prev => ({ ...prev, sections: prev.sections.filter((_, i) => i !== idx) }));
  const updateSection = (idx, field, val) => setEditorial(prev => ({
    ...prev,
    sections: prev.sections.map((s, i) => i === idx ? { ...s, [field]: val } : s),
  }));

  const isEditing = editingCategory || editingSubcategory;

  return (
    <div className="cm-page">
      {saving && <Loader />}

      <div className="cm-header-row">
        <button className="cm-back-btn" onClick={() => navigate('/products')}>
          <MdArrowBack />
        </button>
        <h1 className="cm-title">PRODUCT & MASTER DATA MANAGEMENT</h1>
      </div>

      <div className="cm-content">
        {/* Left Panel */}
        <div className="cm-left-panel">
          <div className="cm-card">
            <h3 className="cm-card-title">
              {editingCategory ? 'Edit Category' : editingSubcategory ? 'Edit Subcategory' : 'Add Category / Subcategory'}
            </h3>

            {!isEditing && (
              <div className="cm-mode-toggle">
                <button className={`cm-mode-btn ${formMode === 'category' ? 'active' : ''}`} onClick={() => { setFormMode('category'); setError(''); }}>
                  New Category
                </button>
                <button className={`cm-mode-btn ${formMode === 'subcategory' ? 'active' : ''}`} onClick={() => { setFormMode('subcategory'); setError(''); }}>
                  Add Subcategory
                </button>
              </div>
            )}

            <div className="cm-form">
              {formMode === 'category' ? (
                <>
                  <div className="cm-field">
                    <label>Category Name</label>
                    <input type="text" name="newCategoryName" placeholder="Enter category name" value={form.newCategoryName} onChange={handleFormChange} />
                  </div>
                  <div className="cm-field">
                    <label>{editingCategory ? 'Change Image (optional)' : 'Upload Image'}</label>
                    <div className="cm-file-input-wrapper">
                      <MdCloudUpload className="cm-file-icon" />
                      <span>{form.image ? form.image.name : 'Choose file'}</span>
                      <input type="file" name="image" accept="image/*" onChange={handleFormChange} />
                    </div>
                  </div>

                  {/* ── Filters Section ── */}
                  <div className="cm-section-divider">
                    <span>Filters</span>
                    <button type="button" className="cm-add-small-btn" onClick={addFilter} title="Add filter">
                      <MdAdd /> Add Filter
                    </button>
                  </div>

                  {filters.map((filter, fIdx) => (
                    <div key={fIdx} className="cm-filter-block">
                      <div className="cm-filter-header">
                        <input
                          type="text"
                          className="cm-filter-label-input"
                          placeholder="Filter label (e.g. Display Type)"
                          value={filter.label}
                          onChange={(e) => updateFilterLabel(fIdx, e.target.value)}
                        />
                        <button type="button" className="cm-remove-btn" onClick={() => removeFilter(fIdx)} title="Remove filter">
                          <MdClose />
                        </button>
                      </div>
                      <div className="cm-filter-options">
                        {filter.options.map((opt, oIdx) => (
                          <div key={oIdx} className="cm-filter-option-row">
                            <input
                              type="text"
                              placeholder={`Option ${oIdx + 1}`}
                              value={opt}
                              onChange={(e) => updateFilterOption(fIdx, oIdx, e.target.value)}
                            />
                            <button type="button" className="cm-remove-btn-sm" onClick={() => removeFilterOption(fIdx, oIdx)} title="Remove option">
                              <MdClose />
                            </button>
                          </div>
                        ))}
                        <button type="button" className="cm-add-option-btn" onClick={() => addFilterOption(fIdx)}>
                          + Add Option
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* ── Editorial Section ── */}
                  <div className="cm-section-divider">
                    <span>Editorial / SEO Content</span>
                  </div>

                  <div className="cm-field">
                    <label>Editorial Title</label>
                    <input type="text" placeholder="e.g. Buy Televisions Online" value={editorial.title} onChange={(e) => setEditorial(prev => ({ ...prev, title: e.target.value }))} />
                  </div>
                  <div className="cm-field">
                    <label>Intro Paragraph</label>
                    <textarea
                      className="cm-textarea"
                      placeholder="Brief introduction about this category..."
                      value={editorial.intro}
                      onChange={(e) => setEditorial(prev => ({ ...prev, intro: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="cm-section-sub-header">
                    <span>Sections</span>
                    <button type="button" className="cm-add-small-btn" onClick={addSection}>
                      <MdAdd /> Add Section
                    </button>
                  </div>

                  {editorial.sections.map((sec, sIdx) => (
                    <div key={sIdx} className="cm-editorial-block">
                      <div className="cm-filter-header">
                        <input
                          type="text"
                          className="cm-filter-label-input"
                          placeholder="Section heading"
                          value={sec.heading}
                          onChange={(e) => updateSection(sIdx, 'heading', e.target.value)}
                        />
                        <button type="button" className="cm-remove-btn" onClick={() => removeSection(sIdx)} title="Remove section">
                          <MdClose />
                        </button>
                      </div>
                      <textarea
                        className="cm-textarea"
                        placeholder="Section body content..."
                        value={sec.body}
                        onChange={(e) => updateSection(sIdx, 'body', e.target.value)}
                        rows={3}
                      />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="cm-field">
                    <label>Parent Category</label>
                    <select name="parentCategory" value={form.parentCategory} onChange={handleFormChange} disabled={!!editingSubcategory}>
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="cm-field">
                    <label>Subcategory Name</label>
                    <input type="text" name="subcategory" placeholder="Enter subcategory name" value={form.subcategory} onChange={handleFormChange} />
                  </div>
                </>
              )}

              {error && <p className="cm-form-error">{error}</p>}

              <div className="cm-form-actions">
                <button className="cm-save-btn" onClick={handleSave} disabled={saving}>
                  {saving ? <><Loader size="small" /> {isEditing ? 'Updating...' : 'Saving...'}</> : isEditing ? 'Update' : 'Save'}
                </button>
                {isEditing && (
                  <button className="cm-cancel-btn" onClick={handleCancelEdit} disabled={saving}>Cancel</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="cm-right-panel">
          <div className="cm-card">
            <div className="cm-tabs-row">
              <div className="cm-tabs">
                <button className={`cm-tab ${activeTab === 'category' ? 'active' : ''}`} onClick={() => setActiveTab('category')}>
                  Category
                </button>
                <button className={`cm-tab ${activeTab === 'subcategory' ? 'active' : ''}`} onClick={() => setActiveTab('subcategory')}>
                  Subcategory
                </button>
              </div>
              <div className="cm-search">
                <MdSearch className="cm-search-icon" />
                <input type="text" placeholder="Search by category name" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>

            {loading ? (
              <Loader overlay={false} />
            ) : (
              <>
                {activeTab === 'category' && (
                  <div className="cm-grid">
                    {categories.map((cat) => (
                      <div key={cat._id} className="cm-grid-card">
                        <div className="cm-card-actions">
                          <button className="cm-action-btn cm-edit-btn" title="Edit" onClick={() => handleEditCategory(cat)}><MdEdit /></button>
                          <button className="cm-action-btn cm-delete-btn" title="Delete" onClick={() => handleDeleteClick('category', cat._id, null, cat.name)}><MdDelete /></button>
                        </div>
                        <img src={getImageUrl(cat.image)} alt={cat.name} className="cm-grid-img" />
                        <span className="cm-grid-label">{cat.name}</span>
                        {cat.filters?.length > 0 && (
                          <span className="cm-grid-meta">{cat.filters.length} filter{cat.filters.length > 1 ? 's' : ''}</span>
                        )}
                      </div>
                    ))}
                    {categories.length === 0 && <p className="cm-empty">No categories found.</p>}
                  </div>
                )}

                {activeTab === 'subcategory' && (
                  <div className="cm-grid">
                    {allSubcategories.map((sub) => (
                      <div key={sub._id} className="cm-grid-card">
                        <div className="cm-card-actions">
                          <button className="cm-action-btn cm-edit-btn" title="Edit" onClick={() => handleEditSubcategory(sub)}><MdEdit /></button>
                          <button className="cm-action-btn cm-delete-btn" title="Delete" onClick={() => handleDeleteClick('subcategory', sub.categoryId, sub._id, sub.name)}><MdDelete /></button>
                        </div>
                        <img src={getImageUrl(sub.image)} alt={sub.name} className="cm-grid-img" />
                        <span className="cm-grid-label">{sub.categoryName} / {sub.name}</span>
                      </div>
                    ))}
                    {allSubcategories.length === 0 && <p className="cm-empty">No subcategories found.</p>}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="cm-modal-overlay">
          <div className="cm-modal">
            <button className="cm-modal-close" onClick={() => !deleting && setDeleteConfirm(null)} disabled={deleting}><MdClose /></button>
            <h3 className="cm-modal-title">Delete {deleteConfirm.type}</h3>
            <p className="cm-modal-text">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?
              {deleteConfirm.type === 'category' && ' This will also remove all its subcategories.'}
            </p>
            <div className="cm-modal-actions">
              <button className="cm-modal-cancel" onClick={() => setDeleteConfirm(null)} disabled={deleting}>Cancel</button>
              <button className="cm-modal-delete" onClick={handleDeleteConfirm} disabled={deleting}>
                {deleting ? <><Loader size="small" /> Deleting...</> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../utils/hooks';
import { categoryService } from '../services/api';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    backgroundColor: '#1f2937',
    color: 'white',
  },
  logo: {
    fontSize: '20px',
    fontWeight: '700',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  button: {
    padding: '8px 12px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  userName: {
    fontSize: '14px',
  },
};

export const Header = ({ onLogout, onCreateCategory, onManageCategories, showCreateCategory }) => {
  const { user } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.logo}>💰 Budget App</div>
      <div style={styles.rightSection}>
        <span style={styles.userName}>Welcome, {user?.name}</span>
        {showCreateCategory && (
          <>
            <button style={styles.button} onClick={onCreateCategory}>
              + Add Category
            </button>
            <button style={styles.button} onClick={onManageCategories}>
              Manage Categories
            </button>
          </>
        )}
        <button style={styles.button} onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export const CreateCategoryForm = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: '📁',
    color: '#3b82f6',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await categoryService.createCategory(formData);
      onSuccess();
      onCancel();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        margin: '20px auto',
      }}
    >
      <h2 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        Create Category
      </h2>

      {error && (
        <div
          style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
            Category Name *
          </label>
          <input
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Food, Transport"
            required
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
            Icon
          </label>
          <input
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
            type="text"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            placeholder="e.g., 🍔"
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
            Color
          </label>
          <input
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
            type="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '10px 16px',
              backgroundColor: '#e5e7eb',
              color: '#374151',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: '10px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useBudget } from '../utils/hooks';

const styles = {
  container: {
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    margin: '20px auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    padding: '8px 12px',
    backgroundColor: '#e5e7eb',
    color: '#374151',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  categoryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    borderLeft: '4px solid',
  },
  categoryInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  categoryIcon: {
    fontSize: '24px',
  },
  categoryName: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#1f2937',
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#6b7280',
  },
};

export const CategoryList = ({ onClose }) => {
  const { categories, fetchCategories, deleteCategory, loading } = useBudget();
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (categoryId, categoryName) => {
    if (window.confirm(`Delete category "${categoryName}"? This cannot be undone.`)) {
      setDeletingId(categoryId);
      await deleteCategory(categoryId);
      setDeletingId(null);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Manage Categories</h2>
        <button style={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>

      {loading && categories.length === 0 ? (
        <div style={styles.emptyState}>Loading...</div>
      ) : categories.length === 0 ? (
        <div style={styles.emptyState}>
          No categories yet. Create one to get started!
        </div>
      ) : (
        <div style={styles.categoryList}>
          {categories.map((category) => (
            <div
              key={category._id}
              style={{
                ...styles.categoryItem,
                borderLeftColor: category.color,
              }}
            >
              <div style={styles.categoryInfo}>
                <span style={styles.categoryIcon}>{category.icon}</span>
                <span style={styles.categoryName}>{category.name}</span>
              </div>
              <button
                onClick={() => handleDelete(category._id, category.name)}
                disabled={deletingId === category._id}
                style={{
                  ...styles.deleteButton,
                  cursor: deletingId === category._id ? 'not-allowed' : 'pointer',
                  opacity: deletingId === category._id ? 0.7 : 1,
                }}
              >
                {deletingId === category._id ? 'Deleting...' : '🗑️ Delete'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

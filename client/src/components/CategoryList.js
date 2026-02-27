import React, { useEffect, useState } from 'react';
import { useBudget } from '../utils/hooks';
import { CreateCategoryForm } from './Header';

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
  editButton: {
    padding: '6px 12px',
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
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
  const [editingCategory, setEditingCategory] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (categoryId) => {
    setDeletingId(categoryId);
    await deleteCategory(categoryId);
    setDeletingId(null);
    setConfirmDeleteId(null);
  };

  const handleEditSuccess = () => {
    fetchCategories();
    setEditingCategory(null);
  };

  if (editingCategory) {
    return (
      <CreateCategoryForm
        initialCategory={editingCategory}
        onCancel={() => setEditingCategory(null)}
        onSuccess={handleEditSuccess}
      />
    );
  }

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
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setEditingCategory(category)}
                  style={styles.editButton}
                >
                  Edit
                </button>
                {confirmDeleteId === category._id ? (
                  <>
                    <button
                      onClick={() => handleDelete(category._id)}
                      disabled={deletingId === category._id}
                      style={{
                        ...styles.deleteButton,
                        backgroundColor: '#dc2626',
                        color: 'white',
                        cursor: deletingId === category._id ? 'not-allowed' : 'pointer',
                        opacity: deletingId === category._id ? 0.7 : 1,
                      }}
                    >
                      {deletingId === category._id ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      disabled={deletingId === category._id}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#e5e7eb',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(category._id)}
                    disabled={deletingId === category._id}
                    style={{
                      ...styles.deleteButton,
                      cursor: deletingId === category._id ? 'not-allowed' : 'pointer',
                      opacity: deletingId === category._id ? 0.7 : 1,
                    }}
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

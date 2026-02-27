import React, { useState } from 'react';
import { useAuth } from '../utils/hooks';
import { categoryService } from '../services/api';

const CATEGORY_EMOJI_MAP = [
  { emoji: '🍕', keywords: ['food', 'restaurant', 'dining', 'lunch', 'dinner', 'breakfast', 'meal', 'groceries', 'grocery'] },
  { emoji: '☕', keywords: ['coffee', 'cafe'] },
  { emoji: '🍺', keywords: ['bar', 'drinks', 'alcohol'] },
  { emoji: '🚗', keywords: ['transport', 'car', 'taxi', 'uber', 'fuel', 'gas', 'petrol', 'parking'] },
  { emoji: '🚌', keywords: ['bus', 'train', 'metro', 'subway', 'tram', 'public transport'] },
  { emoji: '🏠', keywords: ['home', 'rent', 'housing', 'mortgage', 'utilities', 'electricity', 'water', 'internet'] },
  { emoji: '🛍️', keywords: ['shopping', 'clothes', 'fashion', 'mall'] },
  { emoji: '🎬', keywords: ['entertainment', 'movies', 'cinema', 'games', 'gaming'] },
  { emoji: '🏥', keywords: ['health', 'medical', 'doctor', 'pharmacy', 'medicine'] },
  { emoji: '💪', keywords: ['gym', 'fitness', 'workout', 'sport', 'sports'] },
  { emoji: '📚', keywords: ['education', 'school', 'books', 'study', 'course'] },
  { emoji: '💼', keywords: ['work', 'business', 'office'] },
  { emoji: '✈️', keywords: ['travel', 'flight', 'vacation', 'holiday', 'trip', 'hotel'] },
  { emoji: '🎁', keywords: ['gift', 'gifts', 'donation', 'charity'] },
  { emoji: '🐶', keywords: ['pet', 'pets', 'dog', 'cat', 'veterinary'] },
  { emoji: '👶', keywords: ['baby', 'kids', 'children', 'childcare'] },
  { emoji: '💳', keywords: ['debt', 'loan', 'credit card', 'payment'] },
  { emoji: '💰', keywords: ['savings', 'saving', 'investment', 'investing'] },
];

const suggestCategoryEmoji = (categoryName) => {
  const normalizedName = categoryName.trim().toLowerCase();
  if (!normalizedName) return '📁';

  for (const entry of CATEGORY_EMOJI_MAP) {
    if (entry.keywords.some((keyword) => normalizedName.includes(keyword))) {
      return entry.emoji;
    }
  }

  return '📁';
};

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

export const CreateCategoryForm = ({ onCancel, onSuccess, initialCategory = null }) => {
  const [formData, setFormData] = useState({
    name: initialCategory?.name || '',
    icon: initialCategory?.icon || '📁',
    color: initialCategory?.color || '#3b82f6',
  });
  const [iconManuallyEdited, setIconManuallyEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditMode = !!initialCategory;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'icon') {
      setIconManuallyEdited(true);
      setFormData((prev) => ({ ...prev, icon: value }));
      return;
    }

    if (name === 'name') {
      setFormData((prev) => {
        const next = { ...prev, name: value };
        if (!iconManuallyEdited) {
          next.icon = suggestCategoryEmoji(value);
        }
        return next;
      });
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditMode) {
        await categoryService.updateCategory(initialCategory._id, formData);
      } else {
        await categoryService.createCategory(formData);
      }
      onSuccess();
      onCancel();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (isEditMode ? 'Failed to update category' : 'Failed to create category')
      );
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
        {isEditMode ? 'Edit Category' : 'Create Category'}
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '8px 10px',
              backgroundColor: '#fff',
            }}
          >
            <input
              style={{
                width: '36px',
                height: '28px',
                border: 'none',
                padding: 0,
                background: 'none',
                cursor: 'pointer',
              }}
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
            <div
              style={{
                flex: 1,
                height: '12px',
                borderRadius: '999px',
                backgroundColor: formData.color,
                border: '1px solid rgba(0,0,0,0.08)',
              }}
            />
            <span style={{ fontSize: '12px', color: '#6b7280', minWidth: '64px', textAlign: 'right' }}>
              {formData.color.toUpperCase()}
            </span>
          </div>
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
            {loading ? (isEditMode ? 'Saving...' : 'Creating...') : isEditMode ? 'Save' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

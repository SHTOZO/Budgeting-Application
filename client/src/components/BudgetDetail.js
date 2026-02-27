import React, { useState, useEffect } from 'react';
import { useBudget } from '../utils/hooks';
import { categoryService, budgetService } from '../services/api';
import { formatCurrency, calculateBudgetProgress } from '../utils/helpers';

const styles = {
  container: {
    padding: '20px',
  },
  header: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '24px',
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '12px',
  },
  headerSubtitle: {
    color: '#6b7280',
    fontSize: '14px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  categoryCard: {
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  categoryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  categoryName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    transition: 'width 0.3s',
  },
  categoryStats: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#6b7280',
  },
  button: {
    padding: '8px 12px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    marginRight: '8px',
  },
};

export const BudgetDetail = ({ budget, onBack, onAddExpense }) => {
  const { deleteExpense, deleteBudget } = useBudget();
  const [categories, setCategories] = useState([]);
  const [budgetExpenses, setBudgetExpenses] = useState([]);
  const [currentBudget, setCurrentBudget] = useState(budget);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteBudget = async () => {
    if (window.confirm(`Are you sure you want to delete "${currentBudget.name}" and all its expenses? This cannot be undone.`)) {
      setDeleting(true);
      const success = await deleteBudget(budget._id);
      setDeleting(false);
      if (success) {
        onBack();
      }
    }
  };

  // Refetch budget to ensure we have latest expenses
  useEffect(() => {
    const fetchBudgetDetails = async () => {
      setLoading(true);
      try {
        const response = await budgetService.getBudget(budget._id);
        setCurrentBudget(response.data.data);
        setBudgetExpenses(response.data.data.expenses || []);
      } catch (err) {
        console.error('Failed to fetch budget details:', err);
        setCurrentBudget(budget);
        setBudgetExpenses(budget.expenses || []);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBudgetDetails();
    
    categoryService.getCategories().then((res) => {
      setCategories(res.data.data);
    });
  }, [budget._id]);

  const totalSpent = budgetExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = currentBudget.totalAmount - totalSpent;

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <button
          onClick={onBack}
          style={{
            padding: '8px 12px',
            backgroundColor: '#e5e7eb',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
        <button
          onClick={handleDeleteBudget}
          disabled={deleting || loading}
          style={{
            padding: '8px 12px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            border: 'none',
            borderRadius: '6px',
            cursor: deleting ? 'not-allowed' : 'pointer',
            fontWeight: '600',
          }}
        >
          {deleting ? 'Deleting...' : '🗑️ Delete Budget'}
        </button>
      </div>

      <div style={styles.header}>
        <h1 style={styles.headerTitle}>{currentBudget.name}</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <p style={{ color: '#6b7280', fontSize: '12px' }}>Total Budget</p>
            <p style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>
              {formatCurrency(currentBudget.totalAmount)}
            </p>
          </div>
          <div>
            <p style={{ color: '#6b7280', fontSize: '12px' }}>Total Spent</p>
            <p style={{ fontSize: '20px', fontWeight: '700', color: '#ef4444' }}>
              {formatCurrency(totalSpent)}
            </p>
          </div>
          <div>
            <p style={{ color: '#6b7280', fontSize: '12px' }}>Remaining</p>
            <p
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: remaining > 0 ? '#10b981' : '#ef4444',
              }}
            >
              {formatCurrency(remaining)}
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={onAddExpense}
          style={{
            ...styles.button,
            marginRight: 0,
            padding: '10px 16px',
            fontSize: '14px',
          }}
        >
          + Add Expense
        </button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
          Categories
        </h2>

        <div style={styles.grid}>
          {currentBudget.categories.map((cat) => {
            const categoryExpenses = budgetExpenses.filter((e) => 
              e.categoryId._id === cat.categoryId || 
              e.categoryId._id?.toString() === cat.categoryId?.toString() ||
              e.categoryId === cat.categoryId
            );
            const spent = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
            const progress = calculateBudgetProgress(spent, cat.allocatedAmount);

            return (
              <div key={cat.categoryId} style={styles.categoryCard}>
                <div style={styles.categoryHeader}>
                  <span style={styles.categoryName}>
                    {categories.find((c) => c._id === cat.categoryId)?.icon}{' '}
                    {categories.find((c) => c._id === cat.categoryId)?.name}
                  </span>
                </div>

                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${progress}%`,
                      backgroundColor: progress > 100 ? '#ef4444' : '#10b981',
                    }}
                  />
                </div>

                <div style={styles.categoryStats}>
                  <span>{formatCurrency(spent)}</span>
                  <span>{formatCurrency(cat.allocatedAmount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
          Expenses ({budgetExpenses.length})
        </h2>
        {budgetExpenses.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No expenses yet</p>
        ) : (
          <div>
            {budgetExpenses.map((expense) => (
              <div
                key={expense._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <div>
                  <p style={{ fontWeight: '500', color: '#1f2937' }}>{expense.description}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <p style={{ fontWeight: '600', color: '#1f2937' }}>
                    {formatCurrency(expense.amount)}
                  </p>
                  <button
                    onClick={() => deleteExpense(expense._id)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

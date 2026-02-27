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
  const [showChart, setShowChart] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmDeleteExpenseId, setConfirmDeleteExpenseId] = useState(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState(null);

  const handleDeleteBudget = async () => {
    setDeleting(true);
    const success = await deleteBudget(budget._id);
    setDeleting(false);
    if (success) {
      onBack();
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    setDeletingExpenseId(expenseId);
    await deleteExpense(expenseId);
    setBudgetExpenses((prev) => prev.filter((expense) => expense._id !== expenseId));
    setDeletingExpenseId(null);
    setConfirmDeleteExpenseId(null);
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

  const categorySpendingMap = {};
  budgetExpenses.forEach((expense) => {
    const categoryId = expense.categoryId?._id || expense.categoryId;
    if (!categorySpendingMap[categoryId]) {
      categorySpendingMap[categoryId] = {
        categoryId,
        spent: 0,
        expensesCount: 0,
      };
    }
    categorySpendingMap[categoryId].spent += expense.amount;
    categorySpendingMap[categoryId].expensesCount += 1;
  });

  const categorySpending = Object.values(categorySpendingMap).map((item) => {
    const category = categories.find((c) => c._id === item.categoryId);
    return {
      ...item,
      name: category?.name || 'Unknown',
      icon: category?.icon || '📁',
      color: category?.color || '#3b82f6',
      percentage: totalSpent > 0 ? (item.spent / totalSpent) * 100 : 0,
    };
  });

  let currentPercent = 0;
  const chartSlices = categorySpending.map((item) => {
    const start = currentPercent;
    const end = currentPercent + item.percentage;
    currentPercent = end;
    return `${item.color} ${start}% ${end}%`;
  });

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
          onClick={() => setShowDeleteConfirm(true)}
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

      {showDeleteConfirm && (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '16px',
            marginBottom: '16px',
            border: '1px solid #fecaca',
          }}
        >
          <p style={{ color: '#991b1b', fontWeight: '600', marginBottom: '12px' }}>
            Delete "{currentBudget.name}" and all its expenses?
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              style={{
                padding: '8px 12px',
                backgroundColor: '#e5e7eb',
                color: '#374151',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteBudget}
              style={{
                padding: '8px 12px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: deleting ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                opacity: deleting ? 0.7 : 1,
              }}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      )}

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>Spending by Category</h2>
          {categorySpending.length > 0 && (
            <button
              onClick={() => setShowChart((prev) => !prev)}
              style={{
                ...styles.button,
                marginRight: 0,
                padding: '8px 12px',
                fontSize: '12px',
              }}
            >
              {showChart ? 'Hide Chart' : 'Show Chart'}
            </button>
          )}
        </div>

        {categorySpending.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>
            No expenses yet. Click "+ Add Expense" to start tracking.
          </p>
        ) : (
          <>
            {showChart && (
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  padding: '16px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div
                    style={{
                      width: '180px',
                      height: '180px',
                      borderRadius: '50%',
                      background: `conic-gradient(${chartSlices.join(', ')})`,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    {categorySpending.map((item) => (
                      <div
                        key={item.categoryId}
                        style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}
                      >
                        <span style={{ color: '#374151' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              width: '10px',
                              height: '10px',
                              borderRadius: '999px',
                              backgroundColor: item.color,
                              marginRight: '8px',
                            }}
                          />
                          {item.icon} {item.name}
                        </span>
                        <span style={{ color: '#1f2937', fontWeight: '600' }}>
                          {Math.round(item.percentage)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div style={styles.grid}>
              {categorySpending.map((item) => (
                <div key={item.categoryId} style={styles.categoryCard}>
                  <div style={styles.categoryHeader}>
                    <span style={styles.categoryName}>
                      {item.icon} {item.name}
                    </span>
                  </div>

                  <div style={styles.categoryStats}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                      {item.expensesCount} expense{item.expensesCount !== 1 ? 's' : ''}
                    </span>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>
                      {formatCurrency(item.spent)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
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
                  {confirmDeleteExpenseId === expense._id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleDeleteExpense(expense._id)}
                        disabled={deletingExpenseId === expense._id}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: deletingExpenseId === expense._id ? 'not-allowed' : 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                          opacity: deletingExpenseId === expense._id ? 0.7 : 1,
                        }}
                      >
                        {deletingExpenseId === expense._id ? 'Deleting...' : 'Confirm Delete'}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteExpenseId(null)}
                        disabled={deletingExpenseId === expense._id}
                        style={{
                          padding: '4px 8px',
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
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteExpenseId(expense._id)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

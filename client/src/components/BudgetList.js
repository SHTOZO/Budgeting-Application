import React, { useEffect, useState } from 'react';
import { useBudget } from '../utils/hooks';
import { formatCurrency, formatDate } from '../utils/helpers';

const styles = {
  container: {
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1f2937',
  },
  button: {
    padding: '10px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '8px',
  },
  cardAmountSection: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '12px',
  },
  cardAmount: {
    flex: 1,
  },
  amountLabel: {
    fontSize: '10px',
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: '4px',
  },
  amountValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#3b82f6',
  },
  amountValueWarning: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ef4444',
  },
  cardDate: {
    fontSize: '12px',
    color: '#6b7280',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#6b7280',
  },
};

export const BudgetList = ({ onCreateBudget, onSelectBudget, refreshTrigger }) => {
  const { budgets, fetchBudgets, deleteBudget, loading } = useBudget();
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets, refreshTrigger]);

  const handleDeleteBudget = async (e, budgetId, budgetName) => {
    e.stopPropagation();
    setDeletingId(budgetId);
    await deleteBudget(budgetId);
    setDeletingId(null);
    setConfirmDeleteId(null);
  };

  if (loading) return <div style={styles.container}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>My Budgets</h2>
        <button style={styles.button} onClick={onCreateBudget}>
          Create Budget
        </button>
      </div>

      {budgets.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No budgets yet. Create one to get started!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {budgets.map((budget) => {
            const spent = budget.expenses ? budget.expenses.reduce((sum, e) => sum + e.amount, 0) : 0;
            const remaining = budget.totalAmount - spent;
            const isOverBudget = remaining < 0;

            return (
              <div
                key={budget._id}
                style={{
                  ...styles.card,
                  cursor: 'pointer',
                  borderLeft: `4px solid ${isOverBudget ? '#ef4444' : '#10b981'}`,
                }}
                onClick={() => onSelectBudget(budget)}
              >
                <h3 style={styles.cardTitle}>{budget.name}</h3>
                <div style={styles.cardAmountSection}>
                  <div style={styles.cardAmount}>
                    <div style={styles.amountLabel}>Left</div>
                    <div style={isOverBudget ? styles.amountValueWarning : styles.amountValue}>
                      {formatCurrency(remaining)}
                    </div>
                  </div>
                  <div style={styles.cardAmount}>
                    <div style={styles.amountLabel}>Total</div>
                    <div style={styles.amountValue}>{formatCurrency(budget.totalAmount)}</div>
                  </div>
                </div>
                <p style={styles.cardDate}>
                  {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px', marginBottom: '12px' }}>
                  {budget.categories.length} categories • {budget.expenses?.length || 0} expenses
                </p>
                {confirmDeleteId === budget._id ? (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={(e) => handleDeleteBudget(e, budget._id, budget.name)}
                      disabled={deletingId === budget._id}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: deletingId === budget._id ? 'not-allowed' : 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        opacity: deletingId === budget._id ? 0.7 : 1,
                      }}
                    >
                      {deletingId === budget._id ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteId(null);
                      }}
                      disabled={deletingId === budget._id}
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
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDeleteId(budget._id);
                    }}
                    disabled={deletingId === budget._id}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: deletingId === budget._id ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                      opacity: deletingId === budget._id ? 0.7 : 1,
                    }}
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

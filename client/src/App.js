import React, { useState, useEffect } from 'react';
import { useAuth } from './utils/hooks';
import { LoginForm, RegisterForm } from './components/AuthForms';
import { Header, CreateCategoryForm } from './components/Header';
import { BudgetList } from './components/BudgetList';
import { BudgetDetail } from './components/BudgetDetail';
import { CreateBudgetForm } from './components/CreateBudgetForm';
import { CreateExpenseForm } from './components/ExpenseForm';
import { categoryService, budgetService } from './services/api';

const styles = {
  mainContainer: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
};

function App() {
  const { logout, isAuthenticated } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [currentView, setCurrentView] = useState('budgets'); // 'budgets', 'budget-detail', 'create-budget'
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [showCreateBudget, setShowCreateBudget] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // AuthContext handles token and user from localStorage automatically

  // Fetch categories when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      categoryService
        .getCategories()
        .then((res) => setCategories(res.data.data))
        .catch((err) => console.error('Failed to fetch categories'));
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    setCurrentView('budgets');
    setSelectedBudget(null);
  };

  const handleSelectBudget = (budget) => {
    setSelectedBudget(budget);
    setCurrentView('budget-detail');
  };

  const handleBackFromDetail = () => {
    setCurrentView('budgets');
    setSelectedBudget(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCreateBudgetSuccess = () => {
    setCurrentView('budgets');
    setShowCreateBudget(false);
  };

  const handleAddExpenseSuccess = async () => {
    // Refetch the updated budget and expenses
    if (selectedBudget) {
      try {
        const budgetResponse = await budgetService.getBudget(selectedBudget._id);
        setSelectedBudget(budgetResponse.data.data);
        setShowAddExpense(false);
        setRefreshTrigger(prev => prev + 1);
      } catch (err) {
        console.error('Failed to refresh budget:', err);
      }
    }
  };

  const handleCreateCategorySuccess = () => {
    categoryService
      .getCategories()
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error('Failed to fetch categories'));
  };

  // Not authenticated views
  if (!isAuthenticated) {
    return (
      <div style={styles.mainContainer}>
        {showRegister ? (
          <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
        )}
      </div>
    );
  }

  // Authenticated views
  return (
    <div style={styles.mainContainer}>
      <Header
        onLogout={handleLogout}
        onCreateCategory={() => setShowCreateCategory(true)}
        showCreateCategory={currentView === 'budgets' || currentView === 'budget-detail'}
      />

      <div style={styles.content}>
        {showCreateCategory && (
          <CreateCategoryForm
            onCancel={() => setShowCreateCategory(false)}
            onSuccess={handleCreateCategorySuccess}
          />
        )}

        {showCreateBudget ? (
          <CreateBudgetForm
            onCancel={() => setShowCreateBudget(false)}
            onSuccess={handleCreateBudgetSuccess}
          />
        ) : showAddExpense && selectedBudget ? (
          <CreateExpenseForm
            budgetId={selectedBudget._id}
            categories={categories}
            onCancel={() => setShowAddExpense(false)}
            onSuccess={handleAddExpenseSuccess}
          />
        ) : currentView === 'budget-detail' && selectedBudget ? (
          <BudgetDetail
            budget={selectedBudget}
            onBack={handleBackFromDetail}
            onAddExpense={() => setShowAddExpense(true)}
          />
        ) : (
          <BudgetList
            onCreateBudget={() => setShowCreateBudget(true)}
            onSelectBudget={handleSelectBudget}
            refreshTrigger={refreshTrigger}
          />
        )}
      </div>
    </div>
  );
}

export default App;

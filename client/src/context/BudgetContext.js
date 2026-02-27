import React, { createContext, useState, useCallback } from 'react';
import { budgetService, expenseService, categoryService } from '../services/api';

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await budgetService.getBudgets();
      setBudgets(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBudget = useCallback(async (budgetData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await budgetService.createBudget(budgetData);
      setBudgets([...budgets, response.data.data]);
      return response.data.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create budget');
      return null;
    } finally {
      setLoading(false);
    }
  }, [budgets]);

  const updateBudget = useCallback(
    async (budgetId, budgetData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await budgetService.updateBudget(budgetId, budgetData);
        setBudgets(budgets.map((b) => (b._id === budgetId ? response.data.data : b)));
        return response.data.data;
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to update budget');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [budgets]
  );

  const deleteBudget = useCallback(
    async (budgetId) => {
      setLoading(true);
      setError(null);
      try {
        await budgetService.deleteBudget(budgetId);
        setBudgets(budgets.filter((b) => b._id !== budgetId));
        return true;
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete budget');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [budgets]
  );

  const fetchExpenses = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await expenseService.getExpenses(filters);
      setExpenses(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }, []);

  const createExpense = useCallback(async (expenseData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await expenseService.createExpense(expenseData);
      setExpenses([...expenses, response.data.data]);
      return response.data.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create expense');
      return null;
    } finally {
      setLoading(false);
    }
  }, [expenses]);

  const deleteExpense = useCallback(
    async (expenseId) => {
      setLoading(true);
      setError(null);
      try {
        await expenseService.deleteExpense(expenseId);
        setExpenses(expenses.filter((e) => e._id !== expenseId));
        return true;
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete expense');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [expenses]
  );

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(
    async (categoryId) => {
      setLoading(true);
      setError(null);
      try {
        await categoryService.deleteCategory(categoryId);
        setCategories(categories.filter((c) => c._id !== categoryId));
        return true;
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete category');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [categories]
  );

  const value = {
    budgets,
    expenses,
    categories,
    loading,
    error,
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    fetchExpenses,
    createExpense,
    deleteExpense,
    fetchCategories,
    deleteCategory,
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
};

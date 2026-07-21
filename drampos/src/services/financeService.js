import { API_BASE_URL } from '../api/endpoints';

const fetchFinanceApi = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Finance service request failed');
    }
    return response.json();
};

// Expense Categories
export const getExpenseCategories = async () => fetchFinanceApi('/finance/expense-categories', { method: 'GET' });
export const createExpenseCategory = async (data) => fetchFinanceApi('/finance/expense-categories', { method: 'POST', body: JSON.stringify(data) });

// Expenses
export const getExpenses = async () => fetchFinanceApi('/finance/expenses', { method: 'GET' });
export const createExpense = async (data) => fetchFinanceApi('/finance/expenses', { method: 'POST', body: JSON.stringify(data) });
export const deleteExpense = async (id) => fetchFinanceApi(`/finance/expenses/${id}`, { method: 'DELETE' });

// Income Categories
export const getIncomeCategories = async () => fetchFinanceApi('/finance/income-categories', { method: 'GET' });
export const createIncomeCategory = async (data) => fetchFinanceApi('/finance/income-categories', { method: 'POST', body: JSON.stringify(data) });

// Incomes
export const getIncomes = async () => fetchFinanceApi('/finance/incomes', { method: 'GET' });
export const createIncome = async (data) => fetchFinanceApi('/finance/incomes', { method: 'POST', body: JSON.stringify(data) });
export const deleteIncome = async (id) => fetchFinanceApi(`/finance/incomes/${id}`, { method: 'DELETE' });

// Bank Accounts
export const getBankAccounts = async () => fetchFinanceApi('/finance/bank-accounts', { method: 'GET' });
export const createBankAccount = async (data) => fetchFinanceApi('/finance/bank-accounts', { method: 'POST', body: JSON.stringify(data) });
export const deleteBankAccount = async (id) => fetchFinanceApi(`/finance/bank-accounts/${id}`, { method: 'DELETE' });

// Money Transfers
export const getMoneyTransfers = async () => fetchFinanceApi('/finance/transfers', { method: 'GET' });
export const createMoneyTransfer = async (data) => fetchFinanceApi('/finance/transfers', { method: 'POST', body: JSON.stringify(data) });

// Reports Summary
export const getFinancialSummary = async () => fetchFinanceApi('/finance/summary', { method: 'GET' });

const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');

// Expense Categories & Expenses
router.get('/expense-categories', financeController.getExpenseCategories);
router.post('/expense-categories', financeController.createExpenseCategory);
router.get('/expenses', financeController.getExpenses);
router.post('/expenses', financeController.createExpense);
router.delete('/expenses/:id', financeController.deleteExpense);

// Income Categories & Incomes
router.get('/income-categories', financeController.getIncomeCategories);
router.post('/income-categories', financeController.createIncomeCategory);
router.get('/incomes', financeController.getIncomes);
router.post('/incomes', financeController.createIncome);
router.delete('/incomes/:id', financeController.deleteIncome);

// Bank Accounts
router.get('/bank-accounts', financeController.getBankAccounts);
router.post('/bank-accounts', financeController.createBankAccount);
router.delete('/bank-accounts/:id', financeController.deleteBankAccount);

// Money Transfers
router.get('/transfers', financeController.getMoneyTransfers);
router.post('/transfers', financeController.createMoneyTransfer);

// Reports Summary
router.get('/summary', financeController.getFinancialSummary);

module.exports = router;

const ExpenseCategory = require('../models/ExpenseCategory');
const Expense = require('../models/Expense');
const IncomeCategory = require('../models/IncomeCategory');
const Income = require('../models/Income');
const BankAccount = require('../models/BankAccount');
const MoneyTransfer = require('../models/MoneyTransfer');
const Sale = require('../models/Sale');
const Purchase = require('../models/Purchase');

// --- EXPENSE CATEGORY ---
exports.getExpenseCategories = async (req, res) => {
    try {
        const cats = await ExpenseCategory.find().sort({ createdAt: -1 });
        res.json({ success: true, data: cats });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createExpenseCategory = async (req, res) => {
    try {
        const cat = new ExpenseCategory(req.body);
        await cat.save();
        res.status(201).json({ success: true, data: cat });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

// --- EXPENSES ---
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find().populate('category').sort({ createdAt: -1 });
        res.json({ success: true, data: expenses });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createExpense = async (req, res) => {
    try {
        const expense = new Expense(req.body);
        await expense.save();
        res.status(201).json({ success: true, data: expense });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Expense deleted' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// --- INCOME CATEGORY ---
exports.getIncomeCategories = async (req, res) => {
    try {
        const cats = await IncomeCategory.find().sort({ createdAt: -1 });
        res.json({ success: true, data: cats });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createIncomeCategory = async (req, res) => {
    try {
        const cat = new IncomeCategory(req.body);
        await cat.save();
        res.status(201).json({ success: true, data: cat });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

// --- INCOMES ---
exports.getIncomes = async (req, res) => {
    try {
        const incomes = await Income.find().populate('category').sort({ createdAt: -1 });
        res.json({ success: true, data: incomes });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createIncome = async (req, res) => {
    try {
        const income = new Income(req.body);
        await income.save();
        res.status(201).json({ success: true, data: income });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.deleteIncome = async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Income deleted' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// --- BANK ACCOUNTS ---
exports.getBankAccounts = async (req, res) => {
    try {
        const accounts = await BankAccount.find().sort({ createdAt: -1 });
        res.json({ success: true, data: accounts });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createBankAccount = async (req, res) => {
    try {
        const account = new BankAccount(req.body);
        await account.save();
        res.status(201).json({ success: true, data: account });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.deleteBankAccount = async (req, res) => {
    try {
        await BankAccount.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Bank account deleted' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// --- MONEY TRANSFERS ---
exports.getMoneyTransfers = async (req, res) => {
    try {
        const transfers = await MoneyTransfer.find()
            .populate('fromAccount', 'accountName bankName')
            .populate('toAccount', 'accountName bankName')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: transfers });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createMoneyTransfer = async (req, res) => {
    try {
        const transfer = new MoneyTransfer(req.body);
        await transfer.save();

        // Update balances
        const fromAcc = await BankAccount.findById(transfer.fromAccount);
        const toAcc = await BankAccount.findById(transfer.toAccount);
        if (fromAcc) {
            fromAcc.balance = Math.max(0, fromAcc.balance - transfer.amount);
            await fromAcc.save();
        }
        if (toAcc) {
            toAcc.balance += transfer.amount;
            await toAcc.save();
        }

        res.status(201).json({ success: true, data: transfer });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

// --- FINANCIAL REPORTS (BALANCE SHEET, CASH FLOW, ETC) ---
exports.getFinancialSummary = async (req, res) => {
    try {
        const sales = await Sale.aggregate([{ $group: { _id: null, total: { $sum: '$grandTotal' } } }]);
        const purchases = await Purchase.aggregate([{ $group: { _id: null, total: { $sum: '$grandTotal' } } }]);
        const expenses = await Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
        const incomes = await Income.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);

        const totalSales = sales[0]?.total || 0;
        const totalPurchases = purchases[0]?.total || 0;
        const totalExpenses = expenses[0]?.total || 0;
        const totalIncomes = incomes[0]?.total || 0;

        const netProfit = (totalSales + totalIncomes) - (totalPurchases + totalExpenses);

        // Aggregate monthly sales & purchases
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlySales = await Sale.aggregate([
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    total: { $sum: '$grandTotal' }
                }
            }
        ]);
        const monthlyPurchases = await Purchase.aggregate([
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    total: { $sum: '$grandTotal' }
                }
            }
        ]);

        const monthlyExpenses = await Expense.aggregate([
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    total: { $sum: '$amount' }
                }
            }
        ]);
        const monthlyIncomes = await Income.aggregate([
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const salesMap = {};
        const purchaseMap = {};
        const expenseMap = {};
        const incomeMap = {};

        monthlySales.forEach(item => { salesMap[item._id] = item.total; });
        monthlyPurchases.forEach(item => { purchaseMap[item._id] = item.total; });
        monthlyExpenses.forEach(item => { expenseMap[item._id] = item.total; });
        monthlyIncomes.forEach(item => { incomeMap[item._id] = item.total; });

        const monthlyTrends = [];
        const revenueExpenseTrends = [];

        for (let m = 1; m <= 12; m++) {
            const rev = (salesMap[m] || 0) + (incomeMap[m] || 0);
            const exp = expenseMap[m] || 0;

            monthlyTrends.push({
                name: monthNames[m - 1],
                sales: salesMap[m] || 0,
                purchase: purchaseMap[m] || 0,
                monthIndex: m
            });

            revenueExpenseTrends.push({
                name: monthNames[m - 1],
                revenue: rev,
                expense: -exp // Negative value for downward bar representation
            });
        }

        res.json({
            success: true,
            data: {
                totalSales,
                totalPurchases,
                totalExpenses,
                totalIncomes,
                netProfit,
                monthlyTrends,
                revenueExpenseTrends
            }
        });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

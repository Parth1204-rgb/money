const CURRENCIES = {
  USD: { symbol: '$', locale: 'en-US' },
  EUR: { symbol: '€', locale: 'de-DE' },
  GBP: { symbol: '£', locale: 'en-GB' },
  INR: { symbol: '₹', locale: 'en-IN' },
  JPY: { symbol: '¥', locale: 'ja-JP' },
  CNY: { symbol: '¥', locale: 'zh-CN' },
  AUD: { symbol: 'A$', locale: 'en-AU' },
  CAD: { symbol: 'C$', locale: 'en-CA' },
};


const amountInput = document.getElementById('amount');
const currencySelect = document.getElementById('currency');
const categoryInput = document.getElementById('category');
const descriptionInput = document.getElementById('description');
const addExpenseBtn = document.getElementById('add-expense');
const expenseList = document.getElementById('expense-list');
const clearBtn = document.querySelector('.clear-btn');
const totalAmount = document.getElementById('total-amount');

// Initialize expenses array from localStorage
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let currentCurrency = localStorage.getItem('currentCurrency') || 'USD';

// Set initial currency
currencySelect.value = currentCurrency;

// Format currency based on selected currency
const formatCurrency = (amount, currencyCode = currentCurrency) => {
    const currencyInfo = CURRENCIES[currencyCode];
    return new Intl.NumberFormat(currencyInfo.locale, {
        style: 'currency',
        currency: currencyCode
    }).format(amount);
};

// Format date
const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(date));
};

// Calculate and display total
const updateTotal = () => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmount.textContent = formatCurrency(total);
};

// Display expenses in the list
const displayExpenses = () => {
    expenseList.innerHTML = '';
    
    expenses.forEach((expense, index) => {
        const expenseItem = document.createElement('div');
        expenseItem.className = 'expense-item';
        expenseItem.innerHTML = `
            <span class="amount">${formatCurrency(expense.amount, expense.currency)}</span>
            <span class="category">${expense.category}</span>
            <span class="description">${expense.description}</span>
            <span class="date">${formatDate(expense.date)}</span>
            <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>
        `;
        expenseList.appendChild(expenseItem);
    });
    
    updateTotal();
};

// Add a new expense
const addExpense = () => {
    const amount = parseFloat(amountInput.value);
    const currency = currencySelect.value;
    const category = categoryInput.value;
    const description = descriptionInput.value;

    if (isNaN(amount) || amount <= 0 || category.trim() === '' || description.trim() === '') {
        alert('Please fill in all fields with valid values.');
        return;
    }

    const newExpense = {
        amount,
        currency,
        category,
        description,
        date: new Date().toISOString()
    };

    expenses.unshift(newExpense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    // Reset form
    amountInput.value = '';
    categoryInput.value = '';
    descriptionInput.value = '';
    
    displayExpenses();
};

// Delete an expense
const deleteExpense = (index) => {
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses.splice(index, 1);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        displayExpenses();
    }
};

// Clear all expenses
const clearExpenses = () => {
    if (confirm('Are you sure you want to clear all expenses?')) {
        expenses = [];
        localStorage.setItem('expenses', JSON.stringify(expenses));
        displayExpenses();
    }
};

// Handle currency change
const handleCurrencyChange = (e) => {
    currentCurrency = e.target.value;
    localStorage.setItem('currentCurrency', currentCurrency);
    displayExpenses();
};

// Event listeners
addExpenseBtn.addEventListener('click', addExpense);
clearBtn.addEventListener('click', clearExpenses);
currencySelect.addEventListener('change', handleCurrencyChange);

// Initial display
displayExpenses();
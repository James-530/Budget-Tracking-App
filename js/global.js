const STORAGE_KEYS = {
    BUDGETS: 'budget_tracker_categories',
    TRANSACTIONS: 'budget_tracker_transactions'
};

if (!localStorage.getItem(STORAGE_KEYS.BUDGETS)) {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify([]));
}

if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
}

const getBudgets = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.BUDGETS)) || [];
const saveBudgets = (data) => localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(data));

const getTransactions = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) || [];
const saveTransactions = (data) => localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(data));

const formatPeso = (amount) => {
    return '₱' + Math.abs(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebarClose = document.getElementById("sidebarClose");
const overlay = document.getElementById("sidebarOverlay");
const themeToggle = document.getElementById("themeToggle");

window.addEventListener("DOMContentLoaded", () => {

    const savedTheme = localStorage.getItem("theme");

    if(savedTheme === "dark"){
        document.body.classList.add("dark");
        themeToggle.checked = true;
    }

});

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
});

sidebarClose.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
});

overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
});

themeToggle.addEventListener("change", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});
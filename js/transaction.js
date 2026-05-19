document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.getElementById('transactionForm'); 
    const openFormBtn = document.querySelector('.addBtn');
    const closeFormBtn = document.getElementById('closeForm');
    const innerForm = document.getElementById('innerTransactionForm');
    const tableBody = document.getElementById('transactionTableBody');

    if (!formContainer || !openFormBtn || !closeFormBtn || !innerForm || !tableBody) {
        console.error("Configuration Warning: Elements missed matching hook parameters.");
        return;
    }

    const populateCategoryDropdown = () => {
        const categoryDropdown = document.getElementById('transactionCategory');
        if (!categoryDropdown) return;

        const budgets = getBudgets(); 
        budgets.forEach(b => {
            const option = document.createElement('option');
            option.value = b.category;
            option.textContent = b.category;
            categoryDropdown.appendChild(option);
        });
    };

    const renderTransactionTable = () => {
        tableBody.innerHTML = ''; 
        const transactions = getTransactions();

        if (transactions.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 30px; color: var(--text-light);">No transactions found. Add one above!</td></tr>`;
            return;
        }

        const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedTransactions.forEach(tx => {
            const row = document.createElement('tr');
            const isIncome = tx.category === 'Income';
            const colorClass = isIncome ? 'text-success' : 'text-danger';
            const displaySign = isIncome ? '' : '-';

            row.innerHTML = `
                <td>${tx.date}</td>
                <td><strong>${tx.item}</strong></td>
                <td><span class="category-badge">${tx.category}</span></td>
                <td class="${colorClass}" style="font-weight: bold;">
                    ${displaySign}${formatPeso(tx.amount)}
                </td>
            `;
            tableBody.appendChild(row);
        });
    };

    populateCategoryDropdown();
    renderTransactionTable();

    const setDefaultDate = () => {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('transactionDate').value = today;
    };
    setDefaultDate();

    openFormBtn.addEventListener('click', () => {
        formContainer.style.display = 'flex';
    });

    closeFormBtn.addEventListener('click', () => {
        formContainer.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === formContainer) {
            formContainer.style.display = 'none';
        }
    });

    innerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const dateValue = document.getElementById('transactionDate').value;
        const itemValue = document.getElementById('transactionItem').value;
        const categoryValue = document.getElementById('transactionCategory').value;
        const amountValue = parseFloat(document.getElementById('transactionAmount').value);

        const newTx = {
            date: dateValue,
            item: itemValue,
            category: categoryValue,
            amount: amountValue
        };

        const totalTxList = getTransactions();
        totalTxList.push(newTx);
        saveTransactions(totalTxList);

        innerForm.reset();
        formContainer.style.display = 'none';
        
        window.location.reload(); 
    });
});
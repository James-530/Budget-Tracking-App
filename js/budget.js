document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.getElementById('budgetForm'); // Main modal element wrapper
    const openFormBtn = document.querySelector('.addBtn');
    const closeFormBtn = document.getElementById('closeForm');
    const innerForm = document.getElementById('innerBudgetForm') || formContainer.querySelector('form');
    const tableBody = document.querySelector('.budget-table tbody');

    if (!formContainer || !openFormBtn || !closeFormBtn || !tableBody || !innerForm) {
        console.error("Budget Error: Missing structural layout elements. Check matching element IDs!");
        return;
    }

    const renderBudgetTable = () => {
        tableBody.innerHTML = '';

        
        const transactions = getTransactions();

        if (transactions.length === 0) {
                    tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 30px; color: var(--text-light);">No transactions found. Add one above!</td></tr>`;
                    return;
                }

        budgets.forEach(b => {
            const spentVal = transactions
                .filter(tx => tx.category === b.category)
                .reduce((sum, tx) => sum + tx.amount, 0);

            const remainingVal = b.allocated - spentVal;

            let remainingClass = 'text-success';
            if (remainingVal === 0) {
                remainingClass = 'text-muted';
            } else if (remainingVal < 0) {
                remainingClass = 'text-danger';
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${b.category}</strong></td>
                <td>${formatPeso(b.allocated)}</td>
                <td>${formatPeso(spentVal)}</td>
                <td class="${remainingClass}">${remainingVal < 0 ? '-' : ''}${formatPeso(remainingVal)}</td>
            `;
            tableBody.appendChild(row);
        });
    };
    const budgets = getBudgets();
    renderBudgetTable();

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

        const categoryName = document.getElementById('categoryName').value.trim();
        const allocatedVal = parseFloat(document.getElementById('allocatedAmount').value);

        const currentBudgets = getBudgets();

        const exists = currentBudgets.some(b => b.category.toLowerCase() === categoryName.toLowerCase());
        if (exists) {
            alert("This budget category name already exists!");
            return;
        }

        const newCategory = {
            category: categoryName,
            allocated: allocatedVal
        };

        currentBudgets.push(newCategory);
        saveBudgets(currentBudgets);

        innerForm.reset();
        formContainer.style.display = 'none';

        renderBudgetTable();
    });
});
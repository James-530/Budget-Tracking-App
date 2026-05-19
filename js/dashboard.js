document.addEventListener('DOMContentLoaded', () => {
    const canvasElement = document.getElementById('dashboardChart');
    if (!canvasElement) return;

    const transactions = getTransactions();

    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(tx => {
        if (tx.category === 'Income') {
            totalIncome += tx.amount;
        } else {
            totalExpenses += tx.amount;
        }
    });

    const totalBalance = totalIncome - totalExpenses;

    const heroCardValue = document.querySelector('.hero-card .value');
    const incomeCardValue = document.querySelector('.stat-card .text-success');
    const expenseCardValue = document.querySelector('.stat-card .text-danger');

    if (heroCardValue) heroCardValue.textContent = formatPeso(totalBalance);
    if (incomeCardValue) incomeCardValue.textContent = formatPeso(totalIncome);
    if (expenseCardValue) expenseCardValue.textContent = formatPeso(totalExpenses);

    const txContainer = document.querySelector('.transaction-container');
    if (txContainer) {
        txContainer.innerHTML = '';

        const displayList = transactions.slice(-5).reverse();

        if (displayList.length === 0) {
            txContainer.innerHTML = `<p class="text-muted" style="text-align:center; padding: 20px;">No transaction entries logged yet.</p>`;
        } else {
            displayList.forEach(tx => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'transaction-item';

                const isIncome = tx.category === 'Income';
                const sign = isIncome ? '' : '- ';
                const colorClass = isIncome ? 'text-success' : 'text-danger';

                itemDiv.innerHTML = `
                    <span class="transaction-label">${tx.item}</span>
                    <span class="transaction-line"></span>
                    <span class="transaction-price ${colorClass}">${sign}${formatPeso(tx.amount)}</span>
                `;
                txContainer.appendChild(itemDiv);
            });
        }
    }

    const monthlyData = {
        'Jan': { inc: 0, exp: 0 }, 'Feb': { inc: 0, exp: 0 }, 'Mar': { inc: 0, exp: 0 },
        'Apr': { inc: 0, exp: 0 }, 'May': { inc: 0, exp: 0 }, 'Jun': { inc: 0, exp: 0 }
    };

    transactions.forEach(tx => {
        if (!tx.date) return;
        const dateObj = new Date(tx.date);
        const monthName = dateObj.toLocaleString('en-US', { month: 'short' }); // "Jan", "Feb", etc.

        if (monthlyData.hasOwnProperty(monthName)) {
            if (tx.category === 'Income') {
                monthlyData[monthName].inc += tx.amount;
            } else {
                monthlyData[monthName].exp += tx.amount;
            }
        }
    });

    const labels = Object.keys(monthlyData);
    const incomeDataset = labels.map(m => monthlyData[m].inc);
    const expenseDataset = labels.map(m => monthlyData[m].exp);

    const chartCanvas = canvasElement.getContext('2d');
    new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Income',
                data: incomeDataset,
                backgroundColor: '#22C55E',
            }, {
                label: 'Expenses',
                data: expenseDataset,
                backgroundColor: '#EF4444'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#3e75c1' } }
            },
            scales: {
                x: { ticks: { color: '#3e75c1' }, grid: { color: 'rgba(62, 117, 193, 0.15)' } },
                y: { ticks: { color: '#3e75c1' }, grid: { color: 'rgba(62, 117, 193, 0.15)' } }
            }
        }
    });
});
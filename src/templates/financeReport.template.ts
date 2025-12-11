// Helper functions for formatting
function formatAmount(amountInPaise: number): string {
    return (amountInPaise / 100).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatDateTime(date: Date): string {
    return new Date(date).toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function formatReportPeriod(filters: any): string {
    if (filters.month) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[filters.month - 1]} ${new Date().getFullYear()}`;
    }
    if (filters.startDate && filters.endDate) {
        return `${formatDate(filters.startDate)} to ${formatDate(filters.endDate)}`;
    }
    return `Full Year ${new Date().getFullYear()}`;
}

// Function to create finance report HTML
export function createFinanceReportHTML(data: any) {
    const { filters, financialMetrics, villaPerformance, monthlyTrends } = data;

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #FF6B35;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #FF6B35;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          margin: 5px 0;
          color: #666;
          font-size: 14px;
        }
        .summary {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 30px;
        }
        .metric-card {
          background: linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%);
          color: white;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
        }
        .metric-card h3 {
          margin: 0;
          font-size: 24px;
        }
        .metric-card p {
          margin: 5px 0 0;
          font-size: 12px;
          font-weight: 600;
        }
        .positive { color: #10b981; }
        .negative { color: #ef4444; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th {
          background: #FF6B35;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: 600;
        }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #ddd;
        }
        tr:nth-child(even) {
          background: #f9f9f9;
        }
        .section-title {
          font-size: 18px;
          margin: 30px 0 15px;
          color: #FF6B35;
          border-bottom: 2px solid #FF6B35;
          padding-bottom: 8px;
          font-weight: 600;
        }
        .chart-container {
          position: relative;
          height: 300px;
          margin: 20px 0;
          page-break-inside: avoid;
        }
        .footer {
          text-align: center;
          margin-top: 50px;
          padding-top: 20px;
          border-top: 2px solid #ddd;
          font-size: 12px;
          color: #666;
        }
        .footer p {
          margin: 5px 0;
        }
        .amount {
          text-align: right;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <!-- Header -->
      <div class="header">
        <h1>TBK Villas - Financial Report</h1>
        <p><strong>Report Period:</strong> ${formatReportPeriod(filters)}</p>
        <p><strong>Generated On:</strong> ${formatDateTime(new Date())}</p>
      </div>
      
      <!-- Executive Summary -->
      <div class="summary">
        <div class="metric-card">
          <h3>₹${formatAmount(financialMetrics.totalIncome)}</h3>
          <p>TOTAL INCOME</p>
        </div>
        <div class="metric-card">
          <h3>₹${formatAmount(financialMetrics.totalExpenses)}</h3>
          <p>TOTAL EXPENSES</p>
        </div>
        <div class="metric-card">
          <h3 class="${financialMetrics.netProfit > 0 ? 'positive' : 'negative'}">
            ₹${formatAmount(Math.abs(financialMetrics.netProfit))}
          </h3>
          <p>${financialMetrics.isProfit ? 'NET PROFIT' : 'NET LOSS'}</p>
        </div>
        <div class="metric-card">
          <h3>${financialMetrics.profitMargin}%</h3>
          <p>PROFIT MARGIN</p>
        </div>
      </div>
      
      <!-- Income Analysis -->
      <h2 class="section-title">Income Analysis</h2>
      <table>
        <tbody>
          <tr>
            <td><strong>Total Bookings</strong></td>
            <td class="amount">${financialMetrics.totalBookings}</td>
          </tr>
          <tr>
            <td><strong>Confirmed Bookings</strong></td>
            <td class="amount">${financialMetrics.confirmedBookings}</td>
          </tr>
          <tr>
            <td><strong>Cancelled Bookings</strong></td>
            <td class="amount">${financialMetrics.cancelledBookings}</td>
          </tr>
          <tr>
            <td><strong>Average Booking Value</strong></td>
            <td class="amount">₹${formatAmount(financialMetrics.averageBookingValue)}</td>
          </tr>
          <tr>
            <td><strong>Total Guests Served</strong></td>
            <td class="amount">${financialMetrics.totalGuests}</td>
          </tr>
          <tr>
            <td><strong>Paid Amount</strong></td>
            <td class="amount">₹${formatAmount(financialMetrics.paidAmount)}</td>
          </tr>
          <tr>
            <td><strong>Pending Amount</strong></td>
            <td class="amount">₹${formatAmount(financialMetrics.pendingAmount)}</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Charts -->
      <h2 class="section-title">Financial Trends</h2>
      
      <div class="chart-container">
        <canvas id="monthlyTrendChart"></canvas>
      </div>
      
      <!-- Villa Performance -->
      <h2 class="section-title">Villa-wise Performance</h2>
      <table>
        <thead>
          <tr>
            <th>Villa Name</th>
            <th>Bookings</th>
            <th>Income</th>
            <th>Expenses</th>
            <th>Net Profit</th>
            <th>Margin</th>
          </tr>
        </thead>
        <tbody>
          ${villaPerformance.map((villa: any) => `
            <tr>
              <td>${villa.villaName}</td>
              <td style="text-align: center;">${villa.bookingCount}</td>
              <td class="amount">₹${formatAmount(villa.income)}</td>
              <td class="amount">₹${formatAmount(villa.expenses)}</td>
              <td class="amount ${villa.netProfit > 0 ? 'positive' : 'negative'}">
                ₹${formatAmount(Math.abs(villa.netProfit))}
              </td>
              <td style="text-align: center;">${villa.profitMargin}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <!-- Monthly Analysis -->
      <h2 class="section-title">Monthly Analysis</h2>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Income</th>
            <th>Expenses</th>
            <th>Profit</th>
          </tr>
        </thead>
        <tbody>
          ${monthlyTrends.map((month: any) => `
            <tr>
              <td>${month.month}</td>
              <td class="amount">₹${formatAmount(month.income)}</td>
              <td class="amount">₹${formatAmount(month.expense)}</td>
              <td class="amount ${month.profit > 0 ? 'positive' : 'negative'}">
                ₹${formatAmount(Math.abs(month.profit))}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <!-- Footer -->
      <div class="footer">
        <p><strong>Confidential - For Internal Use Only</strong></p>
        <p>TBK Villas Management System | finance@tbkvillas.com</p>
        <p style="margin-top: 10px; font-size: 10px;">This is a system-generated report</p>
      </div>
      
      <!-- Initialize Charts -->
      <script>
        // Monthly Trend Chart
        const monthlyCtx = document.getElementById('monthlyTrendChart');
        new Chart(monthlyCtx, {
          type: 'line',
          data: {
            labels: ${JSON.stringify(monthlyTrends.map((t: any) => t.month))},
            datasets: [
              {
                label: 'Income',
                data: ${JSON.stringify(monthlyTrends.map((t: any) => t.income / 100))},
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4
              },
              {
                label: 'Expenses',
                data: ${JSON.stringify(monthlyTrends.map((t: any) => t.expense / 100))},
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4
              },
              {
                label: 'Profit',
                data: ${JSON.stringify(monthlyTrends.map((t: any) => t.profit / 100))},
                borderColor: '#FF6B35',
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                tension: 0.4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Monthly Income vs Expenses vs Profit Trend'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '₹' + value.toLocaleString('en-IN');
                  }
                }
              }
            }
          }
        });
      </script>
    </body>
    </html>
  `;
}
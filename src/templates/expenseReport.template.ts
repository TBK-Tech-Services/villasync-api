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

// Function to Create Expense Report HTML (No Filters)
export function createExpenseReportHTML(data: any) {
  const { expenses, summary, categoryBreakdown, villaBreakdown } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
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
        .summary-card {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          border-left: 4px solid #FF6B35;
        }
        .summary-card h3 {
          margin: 0;
          font-size: 24px;
          color: #FF6B35;
        }
        .summary-card p {
          margin: 5px 0 0;
          font-size: 12px;
          color: #666;
          font-weight: 600;
        }
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
        <h1>TBK Villas - Expense Report</h1>
        <p><strong>Generated On:</strong> ${formatDateTime(new Date())}</p>
      </div>
      
      <!-- Summary Cards -->
      <div class="summary">
        <div class="summary-card">
          <h3>₹${formatAmount(summary.totalExpenses)}</h3>
          <p>TOTAL EXPENSES</p>
        </div>
        <div class="summary-card">
          <h3>${summary.expenseCount}</h3>
          <p>NUMBER OF EXPENSES</p>
        </div>
        <div class="summary-card">
          <h3>${summary.villaCount}</h3>
          <p>VILLAS COVERED</p>
        </div>
        <div class="summary-card">
          <h3>${summary.categoryCount}</h3>
          <p>CATEGORIES</p>
        </div>
      </div>
      
      <!-- Category Breakdown -->
      <h2 class="section-title">Category-wise Breakdown</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th style="text-align: center;">Count</th>
            <th style="text-align: center;">Percentage</th>
          </tr>
        </thead>
        <tbody>
          ${categoryBreakdown.map((cat: any) => `
            <tr>
              <td>${cat.name}</td>
              <td class="amount">₹${formatAmount(cat.amount)}</td>
              <td style="text-align: center;">${cat.count}</td>
              <td style="text-align: center;">${cat.percentage}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <!-- Villa Breakdown -->
      <h2 class="section-title">Villa-wise Breakdown</h2>
      <table>
        <thead>
          <tr>
            <th>Villa Name</th>
            <th>Amount</th>
            <th style="text-align: center;">Count</th>
          </tr>
        </thead>
        <tbody>
          ${villaBreakdown.map((villa: any) => `
            <tr>
              <td>${villa.name}</td>
              <td class="amount">₹${formatAmount(villa.amount)}</td>
              <td style="text-align: center;">${villa.count}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <!-- Detailed Expenses -->
      <h2 class="section-title">Detailed Expenses</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Villa</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${expenses.map((exp: any) => `
            <tr>
              <td>${formatDate(exp.date)}</td>
              <td>${exp.title}</td>
              <td>${exp.villa?.name || 'Multiple Villas'}</td>
              <td>${exp.category.name}</td>
              <td>${exp.type}</td>
              <td class="amount">₹${formatAmount(exp.amount)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <!-- Footer -->
      <div class="footer">
        <p><strong>Report generated by TBK Villas Management System</strong></p>
        <p>Contact: bookings@tbkvillas.com | +91 98765 43210</p>
        <p style="margin-top: 10px; font-size: 10px;">This is a system-generated report</p>
      </div>
    </body>
    </html>
  `;
}
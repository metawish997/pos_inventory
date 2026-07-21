export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) return;
  
  // Clean elements to prevent raw Mongo object dumps
  const cleanData = data.map(item => {
    const obj = {};
    Object.keys(item).forEach(k => {
      if (k === '_id' || k === '__v' || k === 'images') return;
      let val = item[k];
      if (val !== null && typeof val === 'object') {
        val = val.name || val.fullName || val.storeName || val.categoryName || '';
      }
      obj[k] = val;
    });
    return obj;
  });

  const headers = Object.keys(cleanData[0]);
  const csvRows = [
    headers.join(','),
    ...cleanData.map(row => 
      headers.map(header => {
        const val = row[header];
        const escaped = ('' + (val ?? '')).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    )
  ];
  
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (data, title = 'Exported Data') => {
  if (!data || data.length === 0) return;
  
  // Clean elements to prevent raw Mongo object dumps
  const cleanData = data.map(item => {
    const obj = {};
    Object.keys(item).forEach(k => {
      if (k === '_id' || k === '__v' || k === 'images') return;
      let val = item[k];
      if (val !== null && typeof val === 'object') {
        val = val.name || val.fullName || val.storeName || val.categoryName || '';
      }
      obj[k] = val;
    });
    return obj;
  });

  const headers = Object.keys(cleanData[0]);
  
  const printWindow = window.open('', '_blank');
  const html = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; color: #1B2850; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #E5E7EB; padding: 10px 12px; text-align: left; font-size: 0.85rem; }
          th { background-color: #F9FAFB; font-weight: 600; color: #374151; }
          h1 { text-align: center; margin-bottom: 20px; font-size: 1.5rem; color: #1B2850; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <table>
          <thead>
            <tr>
              ${headers.map(h => `<th>${h.toUpperCase()}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${cleanData.map(row => `
              <tr>
                ${headers.map(h => `<td>${row[h] ?? '-'}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => window.close(), 500);
          };
        </script>
      </body>
    </html>
  `;
  printWindow.document.write(html);
  printWindow.document.close();
};

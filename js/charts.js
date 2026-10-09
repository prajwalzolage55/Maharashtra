/**
 * Maharashtra: Unity in Diversity 2026
 * Chart.js Analytics Dashboard (AI&DS Corner)
 */

let chartInstances = {};

function getChartColors() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  return {
    textColor: isLight ? '#1A1A1A' : '#F5F5F5',
    mutedColor: isLight ? '#5C5C5C' : '#A3A3A3',
    gridColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
    primary: '#FF6B00',
    saffron: '#FF8C1A',
    amber: '#FFA94D',
    peach: '#FFD1A3',
    burnt: '#CC5500',
    rust: '#8A3B00',
    palette: ['#FF6B00', '#FF8C1A', '#FFA94D', '#FFD1A3', '#CC5500', '#8A3B00']
  };
}

function initDashboardCharts() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not yet loaded');
    return;
  }

  // Destroy existing charts if re-rendering
  Object.values(chartInstances).forEach(chart => {
    if (chart && typeof chart.destroy === 'function') chart.destroy();
  });
  chartInstances = {};

  const colors = getChartColors();
  Chart.defaults.color = colors.textColor;
  Chart.defaults.font.family = "'Poppins', 'Noto Sans Devanagari', sans-serif";

  // 1. Population Share by Division (Doughnut)
  const ctxPop = document.getElementById('populationChart');
  if (ctxPop) {
    chartInstances.pop = new Chart(ctxPop, {
      type: 'doughnut',
      data: {
        labels: ['Konkan (incl. Mumbai)', 'Pune', 'Nashik', 'Chh. Sambhajinagar', 'Amravati', 'Nagpur'],
        datasets: [{
          data: [28.6, 23.4, 16.5, 12.3, 9.8, 9.4],
          backgroundColor: colors.palette,
          borderColor: document.documentElement.getAttribute('data-theme') === 'light' ? '#ffffff' : '#141414',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, padding: 10, color: colors.textColor }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.raw}% share`
            }
          }
        }
      }
    });
  }

  // 2. Agricultural Production (Bar)
  const ctxCrop = document.getElementById('cropsChart');
  if (ctxCrop) {
    chartInstances.crop = new Chart(ctxCrop, {
      type: 'bar',
      data: {
        labels: ['Sugarcane', 'Cotton', 'Soybean', 'Onions', 'Grapes', 'Paddy/Rice'],
        datasets: [{
          label: 'Annual Output (Lakh Metric Tonnes)',
          data: [1020, 85, 48, 72, 28, 36],
          backgroundColor: colors.saffron,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: colors.mutedColor }
          },
          y: {
            grid: { color: colors.gridColor },
            ticks: { color: colors.mutedColor }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // 3. Festival Celebrations across months (Bar)
  const ctxFest = document.getElementById('festivalsChart');
  if (ctxFest) {
    chartInstances.fest = new Chart(ctxFest, {
      type: 'bar',
      data: {
        labels: ['Jan (Sankranti)', 'Feb (Shivjayanti)', 'Mar/Apr (Gudi Padwa)', 'Jul (Pandharpur Wari)', 'Aug/Sep (Ganeshotsav)', 'Oct/Nov (Diwali/Navratri)'],
        datasets: [{
          label: 'Cultural Scale Index (Score out of 100)',
          data: [75, 95, 90, 98, 100, 96],
          backgroundColor: [
            colors.amber,
            colors.primary,
            colors.saffron,
            colors.burnt,
            colors.primary,
            colors.saffron
          ],
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { color: colors.gridColor },
            ticks: { color: colors.mutedColor }
          },
          y: {
            grid: { display: false },
            ticks: { color: colors.textColor }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // 4. Sectoral GDP Share (Pie)
  const ctxGdp = document.getElementById('gdpChart');
  if (ctxGdp) {
    chartInstances.gdp = new Chart(ctxGdp, {
      type: 'pie',
      data: {
        labels: ['Services (IT, Finance, Film)', 'Industry & Manufacturing', 'Agriculture & Allied'],
        datasets: [{
          data: [59.4, 27.8, 12.8],
          backgroundColor: [colors.primary, colors.amber, colors.burnt],
          borderColor: document.documentElement.getAttribute('data-theme') === 'light' ? '#ffffff' : '#141414',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, padding: 10, color: colors.textColor }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.raw}%`
            }
          }
        }
      }
    });
  }
}

window.renderCharts = initDashboardCharts;

document.addEventListener('DOMContentLoaded', () => {
  // Give time for CDN Chart.js to initialize if present
  setTimeout(initDashboardCharts, 400);
});

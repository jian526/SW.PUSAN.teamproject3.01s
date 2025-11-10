let chartInstance = null;

function renderGraph(data) {
  const ctx = document.getElementById("prediction-chart").getContext("2d");

  const labels = ["추락", "충돌", "끼임", "기타", "찔림"];
  const values = [
    data.results.추락 || 0,
    data.results.충돌 || 0,
    data.results.끼임 || 0,
    data.results.기타 || 0,
    data.results.찔림 || 0
  ];

  if (chartInstance) {
    chartInstance.destroy(); // 이전 그래프 제거
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "사고 확률",
        data: values,
        backgroundColor: ["#f87171", "#facc15", "#60a5fa", "#a3a3a3", "#86efac"]
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false // ✅ 범례 숨김
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 0.7,
          ticks: {
            callback: val => `${(val * 100).toFixed(0)}%`
          }
        }
      }
    }
  });
}

function getCookie(name) {
  const value = document.cookie.match('(^|;)\s*' + name + '\s*=\s*([^;]+)');
  return value ? value.pop() : null;
}

function checkLoginAndRedirect() {
  const user = getCookie("user_name");
  const currentPage = window.location.pathname;

  console.log("🔍 현재 경로:", currentPage); // 디버깅용, 나중에 지워도 됨

  // ✅ 경로 끝이 predict.html 또는 cases.html이면 로그인 확인
  if (
    !user &&
    (currentPage.endsWith("predict.html") || currentPage.endsWith("cases.html"))
  ) {
    alert("로그인 후 이용 가능합니다.");
    window.location.href = "login.html";
  }
}

function normalizeTemperature(raw) {
  const temp = parseInt(raw);
  if (isNaN(temp)) return "";
  if (temp <= 0) return "추위 (0도 이하)";
  if (temp <= 10) return "쌀쌀 (1~10도)";
  if (temp <= 25) return "보통 (11~25도)";
  if (temp <= 33) return "더움 (26~33도)";
  return "폭염 (34도 이상)";
}

function renderCaseTable(data) {
  const tableBody = document.getElementById("caseTableBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.construction_type}</td>
      <td>${item.accident_type}</td>
      <td>${item.weather}</td>
      <td>${normalizeTemperature(item.temperature)}</td>
      <td>${item.cause}</td>

    `;
    tableBody.appendChild(row);
  });
}

function filterData(data, filters) {
  return data.filter(item => {
    const normalizedTemp = normalizeTemperature(item.temperature);

    return (
      (!filters.constructionType || item.construction_type.includes(filters.constructionType)) &&
      (!filters.accidentType || item.accident_type.includes(filters.accidentType)) &&
      (!filters.weather || item.weather.includes(filters.weather)) &&
      (!filters.temperature || normalizedTemp === filters.temperature)
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
  checkLoginAndRedirect(); 
  let allData = [];

  const loadingIndicator = document.createElement("div");
  loadingIndicator.id = "loading-indicator";
  loadingIndicator.innerText = "데이터 불러오는 중...";
  loadingIndicator.style.textAlign = "center";
  loadingIndicator.style.padding = "20px";
  loadingIndicator.style.fontWeight = "bold";
  document.querySelector(".table-section").appendChild(loadingIndicator);
  loadingIndicator.style.display = "none";

  const filterBtn = document.getElementById("filterBtn");
  filterBtn.addEventListener("click", () => {
    loadingIndicator.style.display = "block";

    fetch("http://localhost:8000/cases")
      .then((res) => res.json())
      .then((data) => {
        allData = data;

        const constructionType = document.getElementById("constructionType").value;
        const accidentType = document.getElementById("accidentType").value;
        const weather = document.getElementById("weather").value;
        const temperature = document.getElementById("temperature").value;

        const filters = {
          constructionType,
          accidentType,
          weather,
          temperature
        };

        const filteredData = filterData(allData, filters);
        renderCaseTable(filteredData);
      })
      .catch((err) => {
        console.error("❌ 사례 데이터 로드 실패:", err);
      })
      .finally(() => {
        loadingIndicator.style.display = "none";
      });
  });

  const user = getCookie("user_name");
  const welcomeEl = document.getElementById("welcome-message");
  const userBadge = document.getElementById("user-badge");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const signupBtn = document.getElementById("signup-btn");

  if (user) {
    if (welcomeEl) welcomeEl.innerText = `👷 ${user}님, 환영합니다!`;
    if (userBadge) {
      userBadge.innerText = `👷 ${user}님`;
      userBadge.style.display = "inline-block";
    }
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (signupBtn) signupBtn.style.display = "none";
  } else {
    if (welcomeEl) welcomeEl.innerText = "건설사고 예측 및 대응 시스템에 오신 것을 환영합니다";
    if (userBadge) userBadge.style.display = "none";
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (signupBtn) signupBtn.style.display = "inline-block";
  }
});

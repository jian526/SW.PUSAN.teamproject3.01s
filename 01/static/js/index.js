function getCookie(name) {
  const value = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return value ? value.pop() : null;
}

window.onload = () => {
  const user = getCookie("user_name");

  const welcomeEl = document.getElementById("welcome-message");
  const userBadge = document.getElementById("user-badge");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const signupBtn = document.getElementById("login-panel");

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
};

function updateTopRisks(resultData) {
  const resultEntries = Object.entries(resultData.results);

  // 확률 높은 순으로 정렬
  const top3 = resultEntries
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const riskList = document.getElementById("top-risks-list");
  riskList.innerHTML = "";  // 초기화

  top3.forEach(([type, percent]) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="risk-type">${type}</span>
      <span class="risk-percent">${Math.round(percent * 100)}%</span>
    `;
    riskList.appendChild(li);
  });
}

fetch("/predict", {
  method: "POST",
  body: formData
})
.then(res => res.json())
.then(data => {
  updateTopRisks(data);  // ← 여기서 위험도 업데이트
  renderGraph(data);     // ← 중간 그래프용 함수 (있다면)
});



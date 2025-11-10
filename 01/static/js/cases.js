function getCookie(name) {
    const value = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return value ? value.pop() : null;
  }
  
  function renderCaseTable(data) {
    const tableBody = document.querySelector(".case-result-section tbody");
    if (!tableBody) return;
  
    tableBody.innerHTML = ""; // 초기화
  
    data.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.type}</td>
        <td>${item.accident}</td>
        <td>${item.weather}</td>
        <td>${item.temp}℃</td>
        <td>${item.cause}</td>
        <td>${item.action}</td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    fetch("/static/data/case_data.json")
      .then((res) => res.json())
      .then((data) => renderCaseTable(data))
      .catch((err) => {
        console.error("❌ JSON 불러오기 실패:", err);
      });
  });
  
  window.onload = () => {
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
  };
  
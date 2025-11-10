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
  
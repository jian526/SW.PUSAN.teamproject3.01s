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
  
  // ✅ 로그인 처리 (login.js)
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const formData = new FormData(form);
      const payload = new URLSearchParams(formData);  // x-www-form-urlencoded 방식
  
      try {
        const res = await fetch("http://localhost:8000/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: payload
        });
  
        const data = await res.json();
  
        if (res.ok) {
          alert(`${data.name}님 환영합니다!`);
  
          // ✅ 쿠키 저장
          document.cookie = `user_name=${data.name}; path=/`;
  
          // ✅ 페이지 이동
          window.location.href = "index.html";
        } else {
          alert("❌ 로그인 실패: " + data.detail);
        }
  
      } catch (err) {
        alert("서버 오류");
        console.error("🚨", err);
      }
    });
  });
  
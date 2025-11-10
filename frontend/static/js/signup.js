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
  

  // ✅ 회원가입 처리 (signup.js)
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signup-form");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const formData = new FormData(form);
  
      // 비밀번호 확인 체크
       
      const data = {
        id: formData.get("id"),
        name: formData.get("name"),
        email: formData.get("email"),
        tel: formData.get("tel"),
        password: formData.get("password")
      };
  
      try {
        const res = await fetch("http://localhost:8000/user/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });
  
        const result = await res.json();
  
        if (res.ok) {
          alert("회원가입 완료!");
          window.location.href = "index.html";
        } else {
          alert(`회원가입 실패: ${result.detail}`);
        }
  
      } catch (err) {
        alert("서버 오류가 발생했습니다.");
        console.error("❌", err);
      }
    });
  });
  
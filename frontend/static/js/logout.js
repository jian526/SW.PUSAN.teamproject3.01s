document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-btn");
  
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
  
        try {
          await fetch("http://localhost:8000/auth/logout");
        } catch (err) {
          console.warn("서버 로그아웃 요청 실패 (무시 가능):", err);
        }
  
        // 쿠키 삭제
        document.cookie = "user_name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  
        alert("로그아웃 되었습니다.");
        window.location.href = "login.html";
      });
    }
  });
  
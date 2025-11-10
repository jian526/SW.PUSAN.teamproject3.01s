// ✅ 1. 먼저 옵션 리스트
const jobOptions = ["설치작업", "해체작업", "이동", "운반작업", "기타",
  "정리작업", "형틀 및 목공", "절단작업", "마감작업", "조립작업",
  "준비작업", "타설작업", "설비작업", "청소작업", "도장작업"];
const equipmentOptions = [  "기타 > 기타", "건설공구 > 공구류", "건설자재 > 자재", "가시설 > 거푸집",
  "가시설 > 비계", "건설자재 > 철근", "시설물 > 건물", "가시설 > 작업발판",
  "가시설 > 기타 가시설", "가시설 > 흙막이가시설", "가시설 > 시스템동바리",
  "질병 > 질병", "건설기계 > 굴착기", "건설기계 > 고소작업차(고소작업대 등)", "부재 > 배관"];

// ✅ 2. select 채우는 함수
function fillSelectOptions(selectId, options) {
  const select = document.querySelector(`select[name="${selectId}"]`);
  if (!select) {
    console.warn(`${selectId} select 요소가 없습니다.`);
    return;
  }
  select.innerHTML = "";
  options.forEach(opt => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = opt;
    select.appendChild(option);
  });
}

// ✅ 3. 로딩 후 실행
window.onload = () => {
  console.log("✅ JS 연결됨");
  console.log(document.querySelector('select[name="job_type"]'));

  // 유저 쿠키 관련 처리
  const user = getCookie("user_name");
  const userBadge = document.getElementById("user-badge");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  if (user) {
    userBadge.innerText = `👷 ${user}님`;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    userBadge.style.display = "none";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }

  // ✅ select 옵션 채우기
  fillSelectOptions("job_type", jobOptions);
  fillSelectOptions("equipment", equipmentOptions);

  // ✅ 폼 제출 처리
  const form = document.getElementById("predict-form");
  const resultBox = document.getElementById("predict-result");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const payload = {
      job_type: formData.get("job_type"),
      temperature: parseFloat(formData.get("temperature")),
      humidity: parseFloat(formData.get("humidity")),
      equipment: formData.get("equipment"),
      personnel: parseInt(formData.get("personnel")),
      date: formData.get("date")
    };

    try {
      const response = await fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("예측 실패");

      const result = await response.json();

      resultBox.innerHTML = `
        <h2>예측 결과</h2>
        <p><strong>사고 위험도:</strong> ${result.risk_level}</p>
        <p><strong>예상 사고 유형:</strong> ${result.accident_type}</p>
        <p><strong>⚠️ 경고 문구:</strong> ${result.warning}</p>
        <p><strong>✅ 대응 방안:</strong> ${result.countermeasure}</p>
      `;
    } catch (err) {
      console.error(err);
      resultBox.innerHTML = `<p style="color:red;">⚠️ 예측 중 오류가 발생했습니다.</p>`;
    }
  });
};

// ✅ 쿠키 함수도 위에 있어야 함
function getCookie(name) {
  const value = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return value ? value.pop() : null;
}

function fillSelectOptions(selectId, options) {
  const select = document.querySelector(`select[name="${selectId}"]`);
  if (!select) {
    console.warn(`❌ ${selectId} select 요소가 없습니다.`);
    return;
  }
  console.log(`✅ ${selectId} select에 옵션 추가 중...`);
  select.innerHTML = "";
  options.forEach(opt => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = opt;
    select.appendChild(option);
  });
}

const user = getCookie("user_name");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

if (user) {
  // 로그인 상태
  if (loginBtn) loginBtn.style.display = "none";
  if (logoutBtn) logoutBtn.style.display = "inline-block";
} else {
  // 로그아웃 상태
  if (loginBtn) loginBtn.style.display = "inline-block";
  if (logoutBtn) logoutBtn.style.display = "none";
}


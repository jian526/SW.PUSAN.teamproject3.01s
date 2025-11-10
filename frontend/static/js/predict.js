// ✅ 로그인 상태 확인 함수
function getCookie(name) {
  const value = document.cookie.match('(^|;)\s*' + name + '\s*=\s*([^;]+)');
  return value ? value.pop() : null;
}

// ✅ 로그인 안 되어 있으면 접근 막기
function checkLoginAndRedirect() {
  const user = getCookie("user_name");
  const currentPage = window.location.pathname;
  if (!user && (currentPage.endsWith("predict.html") || currentPage.endsWith("cases.html"))) {
    alert("로그인 후 이용 가능합니다.");
    window.location.href = "login.html";
  }
}

// ✅ 옵션 리스트 정의
const jobOptions = ["기타", "설치작업", "운반작업", "이동", "정리작업", "해체작업"];
const season = ["봄", "여름", "가을", "겨울"];
const construction = ["건축", "산업환경설비", "토목", "조경"];
const weather = ["강설", "강우", "강풍", "맑음", "안개", "흐림"];
const seasonMap = {
  "봄": "spring",
  "여름": "summer",
  "가을": "fall",
  "겨울": "winter"
};

// ✅ select 옵션 채우기 함수
function fillSelectOptions(selectId, options) {
  const select = document.getElementById(selectId);
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

// ✅ 페이지 로드 시 실행
window.onload = () => {
  checkLoginAndRedirect();

  const user = getCookie("user_name");
  const userBadge = document.getElementById("user-badge");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const signupBtn = document.getElementById("signup-btn");
  const signupNavBtn = document.querySelector("a[href='signup.html']");

  if (user) {
    if (userBadge) {
      userBadge.innerText = `👷 ${user}님`;
      userBadge.style.display = "inline-block";
    }
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (signupBtn) signupBtn.style.display = "none";
    if (signupNavBtn) signupNavBtn.style.display = "none";
  } else {
    if (userBadge) userBadge.style.display = "none";
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (signupBtn) signupBtn.style.display = "inline-block";
    if (signupNavBtn) signupNavBtn.style.display = "inline-block";
  }

  fillSelectOptions("job_type", jobOptions);
  fillSelectOptions("season", season);
  fillSelectOptions("construction", construction);
  fillSelectOptions("weather", weather);

  const form = document.getElementById("predict-form");
  const resultBox = document.getElementById("predict-result");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const payload = {
      process: formData.get("process"),
      season: seasonMap[formData.get("season")],
      construction: formData.get("construction"),
      weather: formData.get("weather"),
      temperature: parseFloat(formData.get("temperature")),
      humidity: parseInt(formData.get("humidity"))
    };

    try {
      const response = await fetch("http://localhost:8000/machine/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("예측 실패: " + errorText);
      }

      const result = await response.json();
      const resultData = convertToResultObject(result.predictions);

      resultBox.innerHTML = `
        <h2> </h2>
      `;

      renderGraph({ results: resultData });
      const topRisk = updateTopRisks(resultData);
      updateSafetyTip(topRisk);
    } catch (err) {
      console.error(err);
      resultBox.innerHTML = `<p style="color:red;">⚠️ 예측 중 오류가 발생했습니다.</p>`;
    }
  });
};

// ✅ 예측 결과 변환
function convertToResultObject(predictions) {
  const obj = {};
  predictions.forEach(item => {
    const label = item.label;
    const percent = parseFloat(item.probability.replace('%', '')) / 100;
    obj[label] = percent;
  });
  return obj;
}

// ✅ 상위 위험 3개 표시
function updateTopRisks(results) {
  const entries = Object.entries(results);
  const sorted = entries.sort((a, b) => b[1] - a[1]).slice(0, 3);
  const riskList = document.getElementById("top-risks-list");
  riskList.innerHTML = "";
  sorted.forEach(([type, percent]) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="risk-type">${type}</span>
      <span class="risk-percent">${Math.round(percent * 100)}%</span>
    `;
    riskList.appendChild(li);
  });
  return sorted[0][0];
}

// ✅ 안전수칙 변경
function updateSafetyTip(topRisk) {
  const tipMap = {
    "추락": ["안전벨트 착용 확인", "고소작업대 주변 정리", "작업대 점검"],
    "충돌": ["주변 차량 주의", "차단시설 설치", "작업반사조끼 착용"],
    "끼임": ["기계 정지 후 작업", "작업 전 점검 필수", "작업복 단단히 정리"],
    "기타": ["작업 전 위험요소 체크", "전문가의 지도에 따라 행동"],
    "찔림": ["절단 방지 장갑 착용","작업 전 장비 점검",'절삭 구역 내 불필요한 접근 금지']
  };

  const tips = tipMap[topRisk] || ["작업 전 안전교육 이수"];
  const tipBox = document.querySelector(".safety-tip ul");
  tipBox.innerHTML = "";
  tips.forEach(tip => {
    const li = document.createElement("li");
    li.textContent = tip;
    tipBox.appendChild(li);
  });
}

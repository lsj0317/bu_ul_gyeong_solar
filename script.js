/*******************************************************
 * [중요] Google Apps Script 웹 앱 URL을 아래에 입력하세요.
 *******************************************************/
const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";

/** Aside Contact Button Logic **/
function goToContact() {
  // 1. 해당 섹션으로 이동
  window.location.href = "#contact";
  // 2. '문의하기' 탭 활성화 (이미 활성화 되어 있어도 강제 적용)
  switchTab("form-section");
}

// Navbar & Mobile Menu Logic
const nav = document.getElementById("navbar");
const plusBtn = document.getElementById("plusBtn");
const dropdownMenu = document.getElementById("dropdownMenu");
const burgerBtn = document.getElementById("burgerBtn");
const sidebar = document.getElementById("sidebar");
const mobileOverlay = document.getElementById("mobileOverlay");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    nav.classList.remove("bg-transparent", "text-white");
    nav.classList.add(
      "bg-white/90",
      "backdrop-blur-md",
      "text-gray-800",
      "shadow-sm"
    );
    plusBtn.classList.remove("border-current");
    plusBtn.classList.add("border-gray-300");
  } else {
    nav.classList.add("bg-transparent", "text-white");
    nav.classList.remove(
      "bg-white/90",
      "backdrop-blur-md",
      "text-gray-800",
      "shadow-sm"
    );
    plusBtn.classList.add("border-current");
    plusBtn.classList.remove("border-gray-300");
  }
});

plusBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (dropdownMenu.classList.contains("hidden")) {
    dropdownMenu.classList.remove("hidden");
    setTimeout(() => dropdownMenu.classList.remove("opacity-0"), 10);
  } else {
    dropdownMenu.classList.add("opacity-0");
    setTimeout(() => dropdownMenu.classList.add("hidden"), 300);
  }
});
window.addEventListener("click", () => {
  if (!dropdownMenu.classList.contains("hidden")) {
    dropdownMenu.classList.add("opacity-0");
    setTimeout(() => dropdownMenu.classList.add("hidden"), 300);
  }
});

function toggleSidebar(show) {
  if (show) {
    mobileOverlay.classList.remove("hidden");
    setTimeout(() => {
      mobileOverlay.classList.remove("opacity-0");
      sidebar.classList.remove("translate-x-full");
    }, 10);
  } else {
    sidebar.classList.add("translate-x-full");
    mobileOverlay.classList.add("opacity-0");
    setTimeout(() => mobileOverlay.classList.add("hidden"), 300);
  }
}
burgerBtn.addEventListener("click", () => toggleSidebar(true));

document
  .getElementById("closeSidebar")
  .addEventListener("click", () => toggleSidebar(false));
mobileOverlay.addEventListener("click", () => toggleSidebar(false));

document
  .querySelectorAll(".mobile-link")
  .forEach((link) =>
    link.addEventListener("click", () => toggleSidebar(false))
  );

// Tab Logic
const tabs = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.remove("text-blue-600", "border-blue-600", "border-b-2");
      t.classList.add("text-gray-500");
    });
    tab.classList.add("text-blue-600", "border-blue-600", "border-b-2");
    tab.classList.remove("text-gray-500");
    tabContents.forEach((c) => c.classList.add("hidden"));
    document.getElementById(tab.dataset.target).classList.remove("hidden");
  });
});
window.switchTab = (targetId) =>
  document.querySelector(`.tab-btn[data-target="${targetId}"]`)?.click();

/** Google Sheets Logic (Same as before) **/
const inquiryForm = document.getElementById("inquiryForm");
const submitBtn = document.getElementById("submitBtn");
const submitLoader = document.getElementById("submitLoader");

inquiryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (GOOGLE_SCRIPT_URL.includes("YOUR_")) {
    alert(
      "스크립트 코드를 구글 앱스 스크립트에 배포하고 URL을 코드 상단에 입력해주세요."
    );
    return;
  }
  submitBtn.disabled = true;
  submitLoader.classList.remove("hidden");
  const formData = new FormData(inquiryForm);
  const data = {
    title: formData.get("title"),
    category: formData.get("category"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    content: formData.get("content"),
  };
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(() => {
      alert(
        "문의가 성공적으로 접수되었습니다.\n'내 문의글' 탭에서 확인하실 수 있습니다."
      );
      inquiryForm.reset();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("전송 중 오류가 발생했습니다.");
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitLoader.classList.add("hidden");
    });
});

const checkInquiryForm = document.getElementById("checkInquiryForm");
const checkBtn = document.getElementById("checkBtn");
const checkLoader = document.getElementById("checkLoader");
const inquiryLogin = document.getElementById("inquiryLogin");
const inquiryResult = document.getElementById("inquiryResult");
const resultList = document.getElementById("resultList");
const noResult = document.getElementById("noResult");

checkInquiryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (GOOGLE_SCRIPT_URL.includes("YOUR_")) {
    alert(
      "스크립트 코드를 구글 앱스 스크립트에 배포하고 URL을 코드 상단에 입력해주세요."
    );
    return;
  }
  const phone = document.getElementById("checkPhone").value;
  const pw = document.getElementById("checkPw").value;
  checkBtn.disabled = true;
  checkLoader.classList.remove("hidden");
  const queryUrl = `${GOOGLE_SCRIPT_URL}?phone=${encodeURIComponent(
    phone
  )}&password=${encodeURIComponent(pw)}`;
  fetch(queryUrl)
    .then((response) => response.json())
    .then((data) => {
      renderResults(data);
      inquiryLogin.classList.add("hidden");
      inquiryResult.classList.remove("hidden");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("조회 중 오류가 발생했습니다.");
    })
    .finally(() => {
      checkBtn.disabled = false;
      checkLoader.classList.add("hidden");
    });
});

function renderResults(items) {
  resultList.innerHTML = "";
  if (!items || items.length === 0) {
    noResult.classList.remove("hidden");
  } else {
    noResult.classList.add("hidden");
    items.forEach((item) => {
      const div = document.createElement("div");
      div.className = "bg-white p-4 rounded border border-gray-200 shadow-sm";
      div.innerHTML = `<div class="flex justify-between items-center mb-2"><span class="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">${item.category}</span><span class="text-gray-400 text-sm">${item.date}</span></div><h4 class="font-bold text-gray-800 mb-1">${item.title}</h4><p class="text-gray-600 text-sm line-clamp-2">${item.content}</p>`;
      resultList.appendChild(div);
    });
  }
}
document.getElementById("backToLogin").addEventListener("click", () => {
  inquiryResult.classList.add("hidden");
  inquiryLogin.classList.remove("hidden");
  checkInquiryForm.reset();
});

// 데이터 배열 정의 (카테고리와 값)
const data = [
  { category: "2018", value: 2300 },
  { category: "2019", value: 3800 },
  { category: "2020", value: 4900 },
  { category: "2021", value: 3900 },
  { category: "2022", value: 3100 },
  { category: "2023", value: 2900 },
  { category: "2024", value: 3100 },
  { category: "2025", value: 3000 },
  { category: "2026", value: 3000 },
  { category: "2027", value: 3100 },
  { category: "2028", value: 3300 },
  { category: "2029", value: 3700 },
  { category: "2030", value: 4000 },
];

// 데이터를 x와 y 배열로 분리
const xData = data.map((d) => d.category);
const yData = data.map((d) => d.value);

// 막대 그래프 레이아웃 정의
const barLayout = {
  title: "국내 태양광 설치 현황",
  xaxis: { title: "기간" },
  yaxis: { title: "설치량" },
};

// config 객체에 responsive: true 설정
const config = {
  responsive: true,
};

// 막대 그래프 생성
Plotly.newPlot(
  "myDiv",
  [{ x: xData, y: yData, type: "bar" }],
  barLayout,
  config
);

// 데이터 생성 로직 (100kW ~ 2000kW)
// 이미지 로직 분석:
// 100~900kW: 소유율 20%
// 1000~2000kW: 소유율 25%
// 임대수익(연): 임대kW * 30,000원
// 소유자수익(연): 소유kW * 250,000원

const data = [];
for (let kw = 100; kw <= 2000; kw += 100) {
  const area = kw * 2; // 평수는 kW * 2
  let ratio = 0.2;
  if (kw >= 1000) ratio = 0.25;

  const ownerKw = kw * ratio;
  const rentalKw = kw - ownerKw;

  // 계산 (단위: 원)
  const rentYear = rentalKw * 30000;
  const ownYear = ownerKw * 250000;
  const rent5 = rentYear * 5;
  const own5 = ownYear * 5;
  const total5 = rent5 + own5;

  data.push({
    kw: kw,
    area: area,
    label: `${kw}kW / ${area}평`,
    ratioStr: `${ratio * 100}%`,
    ownerKw: ownerKw,
    rentalKw: rentalKw,
    rentYear: rentYear,
    rent5: rent5,
    ownYear: ownYear,
    own5: own5,
    total5: total5,
  });
}

// 요소 참조
const select = document.getElementById("capacitySelect");
const ratioDisplay = document.getElementById("ratioDisplay");
const ownerKwDisplay = document.getElementById("ownerKwDisplay");
const rentalKwDisplay = document.getElementById("rentalKwDisplay");
const calcBtn = document.getElementById("calcBtn");
const resultSection = document.getElementById("resultSection");

// 결과창 요소 참조
const resRentYear = document.getElementById("resRentYear");
const resRent5 = document.getElementById("resRent5");
const resOwnYear = document.getElementById("resOwnYear");
const resOwn5 = document.getElementById("resOwn5");
const resTotal = document.getElementById("resTotal");

// Select Box 초기화
data.forEach((item, index) => {
  const option = document.createElement("option");
  option.value = index; // data 배열의 인덱스를 value로 사용
  option.text = item.label;
  select.appendChild(option);
});

// 숫자 포맷 함수 (콤마 추가)
function formatMoney(num) {
  return num.toLocaleString("ko-KR");
}

// 상단 정보 업데이트 함수
function updateInfo() {
  const idx = select.value;
  const item = data[idx];

  ratioDisplay.value = item.ratioStr;
  ownerKwDisplay.value = item.ownerKw + " kW";
  rentalKwDisplay.value = item.rentalKw + " kW";

  // 옵션 변경 시 결과창을 숨길지, 유지할지 결정 (여기선 숨김으로 처리하여 다시 계산 유도)
  resultSection.classList.add("hidden");
}

// 초기 실행
updateInfo();

// 이벤트 리스너
select.addEventListener("change", updateInfo);

calcBtn.addEventListener("click", () => {
  const idx = select.value;
  const item = data[idx];

  // 결과 데이터 주입
  resRentYear.innerText = formatMoney(item.rentYear) + " 원";
  resRent5.innerText = formatMoney(item.rent5) + " 원";

  resOwnYear.innerText = formatMoney(item.ownYear) + " 원";
  resOwn5.innerText = formatMoney(item.own5) + " 원";

  resTotal.innerText = formatMoney(item.total5);

  // 결과창 표시
  resultSection.classList.remove("hidden");
});

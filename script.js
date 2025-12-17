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

/** Data & Navigation Logic **/
// const projectsData = [
//     {title: "김제시 공단 태양광 시공", content: "김제시 농공단지 공장지붕에 태양광패널 100kw급 인프라 시공현장입니다.", day: "2024-10-09", src: "https://images.unsplash.com/photo-1508514177221-188b1cf2f26f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
//     {title: "공주 주택가 단체문의 태양광 시공", content: "충남 공주 주택가 단지에 대규모 태양광패널 50kw급 인프라 시공현장입니다.", day: "2025-02-11", src: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
//     {title: "부산 물류센터 지붕 시공", content: "부산항 인근 대형 물류센터 지붕 유휴부지 활용 태양광 발전소 구축.", day: "2024-11-20", src: "https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
//     {title: "강원도 산간지역 에코 빌리지", content: "친환경 에코 빌리지 단지 내 가정용 태양광 설비 일괄 시공.", day: "2024-09-15", src: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
//     {title: "대전 연구단지 주차장 태양광", content: "연구단지 내 야외 주차장 차양막 겸용 태양광 패널 설치.", day: "2025-01-05", src: "https://images.unsplash.com/photo-1545208942-e1c4340e5503?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
//     {title: "제주도 감귤농장 영농형 태양광", content: "농사와 발전사업을 병행하는 영농형 태양광 시스템 구축.", day: "2024-12-01", src: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
//     {title: "인천 산업단지 옥상 유휴부지", content: "산업단지 내 다수 기업 옥상 임대형 태양광 발전소 시공.", day: "2025-03-10", src: "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
//     {title: "세종시 관공서 에너지 자립화", content: "공공기관 건물 에너지 자립률 제고를 위한 BIPV 시스템 도입.", day: "2024-08-22", src: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
//     {title: "경기도 전원주택 단지", content: "신규 조성되는 전원주택 단지 30세대 태양광 패널 보급 사업.", day: "2025-01-30", src: "https://images.unsplash.com/photo-1508514177221-188b1cf2f26f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
// ];

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

// Grid & Modal Logic
// const gridContainer = document.getElementById('grid-container');
// projectsData.forEach((item, index) => {
//     const card = document.createElement('div');
//     card.className = "bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer group border border-gray-100";
//     card.onclick = () => openModal(index);
//     card.innerHTML = `<div class="h-48 overflow-hidden"><img src="${item.src}" class="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"></div><div class="p-5 flex flex-col justify-between h-32"><h3 class="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition line-clamp-2">${item.title}</h3><div class="text-sm text-gray-500 mt-auto flex items-center gap-2"><i class="fa-regular fa-calendar"></i> ${item.day}</div></div>`;
//     gridContainer.appendChild(card);
// });

// let currentModalIndex = 0;
// const modal = document.getElementById('projectModal');
// const modalImage = document.getElementById('modalImage');
// const modalTitle = document.getElementById('modalTitle');
// const modalDate = document.getElementById('modalDate');
// const modalContent = document.getElementById('modalContent');
// const currentCount = document.getElementById('currentCount');
// const totalCount = document.getElementById('totalCount');
// totalCount.textContent = projectsData.length;

// function updateModal(index) {
//     const data = projectsData[index];
//     modalImage.src = data.src; modalTitle.textContent = data.title; modalDate.textContent = data.day; modalContent.textContent = data.content; currentCount.textContent = index + 1;
// }
// function openModal(index) { currentModalIndex = index; updateModal(index); modal.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
// function closeModal() { modal.classList.add('hidden'); document.body.style.overflow = ''; }
// document.getElementById('closeModal').addEventListener('click', closeModal);
// document.getElementById('closeModalBtn').addEventListener('click', closeModal);
// document.getElementById('modalBackdrop').addEventListener('click', closeModal);
// document.getElementById('prevBtn').addEventListener('click', (e) => { e.stopPropagation(); currentModalIndex = (currentModalIndex - 1 + projectsData.length) % projectsData.length; updateModal(currentModalIndex); });
// document.getElementById('nextBtn').addEventListener('click', (e) => { e.stopPropagation(); currentModalIndex = (currentModalIndex + 1) % projectsData.length; updateModal(currentModalIndex); });

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

// 그래프 데이터 정의
var data = [{
    x: ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
    y: [0, 1000, 2000, 3000, 4000, 5000, 6000],
    type: "bar"
}];

// 그래프 레이아웃 정의 및 y축 설정
var layout = {
    title: "국내 태양광 설치 현황 및 전망 (Y축: 0-6000, 1000 단위)",
    yaxis: {
        title: "설치현황",
        range: [0, 6000], // y축 범위: 0에서 6000까지
        tick0: 0,          // 첫 번째 눈금 위치: 0
        dtick: 1000        // 눈금 간격: 1000 단위
    }
};

// Plotly.newPlot 함수를 사용하여 div에 그래프 생성
Plotly.newPlot('myDiv', data, layout);
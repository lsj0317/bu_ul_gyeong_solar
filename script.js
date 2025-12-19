document.addEventListener("DOMContentLoaded", function () {
  /*******************************************************
   * [중요] Google Apps Script 웹 앱 URL을 아래에 입력하세요.
   *******************************************************/
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzrORusl7ABGVO7-aDtta7KUHSk2A9TEIzJY9qNB7MovhnTsCmlPGbZ8Y2B1XzVixmMjw/exec";

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
  window.switchTab = (targetId) => document.querySelector(`.tab-btn[data-target="${targetId}"]`)?.click();

  // 전화번호 입력 시 하이픈 자동 추가
  function autoHypen(target) {
      target.value = target.value
      .replace(/[^0-9]/g, '') // 숫자만 남기기
      .replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3'); // 3-4-4 형식으로 변환
  }

  /** Google Sheets Logic **/
  const inquiryForm = document.getElementById("inquiryForm");
  const submitBtn = document.getElementById("submitBtn");
  const submitLoader = document.getElementById("submitLoader");

  // 1. 글쓰기 (POST 요청)
  inquiryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (GOOGLE_SCRIPT_URL.includes("YOUR_")) {
      alert("스크립트 URL을 확인해주세요.");
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
      redirect: "follow", // 리다이렉트 자동 처리
      headers: {
        "Content-Type": "text/plain;charset=utf-8", // CORS 방지용 헤더
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result === "success") {
          alert("문의가 성공적으로 접수되었습니다.\n'내 문의글' 탭에서 확인하실 수 있습니다.");
          inquiryForm.reset();
        } else {
          alert("오류가 발생했습니다: " + JSON.stringify(data));
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("서버 통신 중 오류가 발생했습니다.");
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitLoader.classList.add("hidden");
      });
  });

  // 2. 조회하기 (GET 요청)
  const checkInquiryForm = document.getElementById("checkInquiryForm");
  const checkBtn = document.getElementById("checkBtn");
  const checkLoader = document.getElementById("checkLoader");
  const inquiryLogin = document.getElementById("inquiryLogin");
  const inquiryResult = document.getElementById("inquiryResult");
  const resultList = document.getElementById("resultList");
  const noResult = document.getElementById("noResult");

  checkInquiryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const phone = document.getElementById("checkPhone").value;
    const pw = document.getElementById("checkPw").value;

    checkBtn.disabled = true;
    checkLoader.classList.remove("hidden");

    // 파라미터 인코딩 처리
    const queryUrl = `${GOOGLE_SCRIPT_URL}?phone=${encodeURIComponent(phone)}&password=${encodeURIComponent(pw)}`;

    fetch(queryUrl)
      .then((response) => {
        // 401 에러 등 체크
        if (!response.ok) {
           throw new Error("서버 응답 오류: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        renderResults(data);
        inquiryLogin.classList.add("hidden");
        inquiryResult.classList.remove("hidden");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("조회에 실패했습니다.\n관리자에게 문의하거나 잠시 후 다시 시도해주세요.");
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

  // 100~900kW: 20%, 1000~2000kW: 25%
  const tableData = [];

  for (let kw = 100; kw <= 2000; kw += 100) {
    const area = kw * 2; // 평수
    let ratio = 0.2; // 기본 20%

    // 1000kW 이상부터는 25% 적용
    if (kw >= 1000) {
      ratio = 0.25;
    }

    const ownerKw = kw * ratio;
    const rentalKw = kw - ownerKw;

    // 수익 계산 (이미지 공식 역산)
    // 임대수익: 임대kW * 30,000원
    // 소유자수익: 소유kW * 250,000원
    const rentYear = rentalKw * 30000;
    const ownYear = ownerKw * 250000;

    tableData.push({
      id: kw, // 고유 ID
      label: `${kw}kW / ${area}평`,
      ratioText: `${parseInt(ratio * 100)}%`,
      ownerKwText: `${ownerKw}`, // 숫자만 저장
      rentalKwText: `${rentalKw}`, // 숫자만 저장
      rentYear: rentYear,
      rent5: rentYear * 5,
      ownYear: ownYear,
      own5: ownYear * 5,
      total5: rentYear * 5 + ownYear * 5,
    });
  }

  // 2. DOM 요소 참조
  const selectEl = document.getElementById("capacitySelect");
  const ratioInput = document.getElementById("ratioDisplay");
  const ownerInput = document.getElementById("ownerKwDisplay");
  const rentalInput = document.getElementById("rentalKwDisplay");

  const calcBtn = document.getElementById("calcBtn");
  const resultSection = document.getElementById("resultSection");

  const resRentYear = document.getElementById("resRentYear");
  const resRent5 = document.getElementById("resRent5");
  const resOwnYear = document.getElementById("resOwnYear");
  const resOwn5 = document.getElementById("resOwn5");
  const resTotal = document.getElementById("resTotal");

  // 3. Select Box 옵션 채우기
  tableData.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = index; // 배열 인덱스를 value로 사용
    option.text = item.label;
    selectEl.appendChild(option);
  });

  // 4. 정보 업데이트 함수
  function updateTableInputs() {
    const selectedIndex = selectEl.value;
    const data = tableData[selectedIndex];

    if (data) {
      ratioInput.value = data.ratioText;
      ownerInput.value = data.ownerKwText + " kW";
      rentalInput.value = data.rentalKwText + " kW";

      // 값을 바꾸면 결과창을 일단 숨겨서 다시 계산 유도
      resultSection.classList.add("hidden");
    }
  }

  // 5. 초기 실행 및 이벤트 리스너 연결
  updateTableInputs(); // 로드 시 첫 번째 값 세팅

  selectEl.addEventListener("change", updateTableInputs);

  // 6. 계산하기 버튼 클릭
  calcBtn.addEventListener("click", function () {
    const selectedIndex = selectEl.value;
    const data = tableData[selectedIndex];

    if (data) {
      // 숫자 포맷 (콤마)
      const fmt = (num) => num.toLocaleString("ko-KR");

      resRentYear.innerText = fmt(data.rentYear) + " 원";
      resRent5.innerText = fmt(data.rent5) + " 원";

      resOwnYear.innerText = fmt(data.ownYear) + " 원";
      resOwn5.innerText = fmt(data.own5) + " 원";

      resTotal.innerText = fmt(data.total5);

      // 결과창 보이기
      resultSection.classList.remove("hidden");
    }
  });

  const projectsData = [
      {title: "부울경 산업단지 태양광 보급", content: "부산, 울산, 경남지역의 공장 및 물류센터 지붕 유휴부지 활용 태양광 발전소 구축.", day: "2025-11-20", src: "https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
      {title: "강원도 산간지역 에코 빌리지", content: "친환경 에코 빌리지 단지 내 가정용 태양광 설비 일괄 시공.", day: "2024-09-15", src: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
      {title: "베트남 동라이 100메가 프로젝트 참여", content: "베트남 동라이 100메가 프로젝트 참여", day: "2025-07-07", src: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
      {title: "전국농공단지 15,000개 공장 태양광 보급 컨설팅", content: "전국농공단지 15,000개 공장 태양광 보급 컨설팅", day: "2024-03-10", src: "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
      {title: "대전산업단지, 대덕산업단지 태양광 전담 보급", content: "대전산업단지, 대덕산업단지 태양광 전담 보급", day: "2025-02-22", src: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
  ];

  const gridContainer = document.getElementById('grid-container');
  projectsData.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = "bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer group border border-gray-100";
      card.onclick = () => openModal(index);
      card.innerHTML = `<div class="h-48 overflow-hidden"><img src="${item.src}" class="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"></div><div class="p-5 flex flex-col justify-between h-32"><h3 class="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition line-clamp-2">${item.title}</h3><div class="text-sm text-gray-500 mt-auto flex items-center gap-2"><i class="fa-regular fa-calendar"></i> ${item.day}</div></div>`;
      gridContainer.appendChild(card);
  });

  let currentModalIndex = 0;
  const modal = document.getElementById('projectModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDate = document.getElementById('modalDate');
  const modalContent = document.getElementById('modalContent');
  const currentCount = document.getElementById('currentCount');
  const totalCount = document.getElementById('totalCount');
  totalCount.textContent = projectsData.length;

  function updateModal(index) {
      const data = projectsData[index];
      modalImage.src = data.src; modalTitle.textContent = data.title; modalDate.textContent = data.day; modalContent.textContent = data.content; currentCount.textContent = index + 1;
  }
  function openModal(index) { currentModalIndex = index; updateModal(index); modal.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
  function closeModal() { modal.classList.add('hidden'); document.body.style.overflow = ''; }
  document.getElementById('closeModal').addEventListener('click', closeModal);
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('modalBackdrop').addEventListener('click', closeModal);
  document.getElementById('prevBtn').addEventListener('click', (e) => { e.stopPropagation(); currentModalIndex = (currentModalIndex - 1 + projectsData.length) % projectsData.length; updateModal(currentModalIndex); });
  document.getElementById('nextBtn').addEventListener('click', (e) => { e.stopPropagation(); currentModalIndex = (currentModalIndex + 1) % projectsData.length; updateModal(currentModalIndex); });

});

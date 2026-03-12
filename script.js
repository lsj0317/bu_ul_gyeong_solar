document.addEventListener("DOMContentLoaded", () => {
  /* Google Apps Script 웹 앱 URL */
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzrORusl7ABGVO7-aDtta7KUHSk2A9TEIzJY9qNB7MovhnTsCmlPGbZ8Y2B1XzVixmMjw/exec";

  // ===================== DOM 참조 =====================
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const nav = $("#navbar");
  const plusBtn = $("#plusBtn");
  const dropdownMenu = $("#dropdownMenu");
  const sidebar = $("#sidebar");
  const mobileOverlay = $("#mobileOverlay");

  // ===================== 네비게이션 =====================

  /**
   * 문의하기 섹션으로 이동 후 문의하기 탭 활성화
   * @method goToContact
   * @param {-} -
   * @returns {-}
   */
  function goToContact() {
    window.location.href = "#contact";
    switchTab("form-section");
  }
  window.goToContact = goToContact;

  /**
   * 스크롤 위치에 따라 네비바 스타일 변경 (투명 ↔ 흰색)
   * @method onScroll (window scroll handler)
   * @param {-} -
   * @returns {-}
   */
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY > 50;
    nav.classList.toggle("bg-transparent", !scrolled);
    nav.classList.toggle("text-white", !scrolled);
    nav.classList.toggle("bg-white/90", scrolled);
    nav.classList.toggle("backdrop-blur-md", scrolled);
    nav.classList.toggle("text-gray-800", scrolled);
    nav.classList.toggle("shadow-sm", scrolled);
    plusBtn.classList.toggle("border-current", !scrolled);
    plusBtn.classList.toggle("border-gray-300", scrolled);
  });

  /**
   * 드롭다운 메뉴 토글 (열기/닫기)
   * @method toggleDropdown
   * @param {boolean} show - true면 열기, false면 닫기
   * @returns {-}
   */
  function toggleDropdown(show) {
    if (show) {
      dropdownMenu.classList.remove("hidden");
      setTimeout(() => dropdownMenu.classList.remove("opacity-0"), 10);
    } else {
      dropdownMenu.classList.add("opacity-0");
      setTimeout(() => dropdownMenu.classList.add("hidden"), 300);
    }
  }

  plusBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleDropdown(dropdownMenu.classList.contains("hidden"));
  });
  window.addEventListener("click", () => toggleDropdown(false));

  /**
   * 모바일 사이드바 토글 (열기/닫기)
   * @method toggleSidebar
   * @param {boolean} show - true면 열기, false면 닫기
   * @returns {-}
   */
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

  $("#burgerBtn").addEventListener("click", () => toggleSidebar(true));
  $("#closeSidebar").addEventListener("click", () => toggleSidebar(false));
  mobileOverlay.addEventListener("click", () => toggleSidebar(false));
  $$(".mobile-link").forEach((link) => link.addEventListener("click", () => toggleSidebar(false)));

  // ===================== 탭 시스템 =====================

  const tabs = $$(".tab-btn");
  const tabContents = $$(".tab-content");

  /**
   * 탭 클릭 시 활성/비활성 스타일 전환 및 콘텐츠 표시
   * @method activateTab
   * @param {HTMLElement} activeTab - 활성화할 탭 버튼 요소
   * @returns {-}
   */
  function activateTab(activeTab) {
    tabs.forEach((t) => {
      const isActive = t === activeTab;
      t.classList.toggle("text-blue-600", isActive);
      t.classList.toggle("border-blue-600", isActive);
      t.classList.toggle("border-b-2", isActive);
      t.classList.toggle("text-gray-500", !isActive);
    });
    tabContents.forEach((c) => c.classList.add("hidden"));
    $(`#${activeTab.dataset.target}`).classList.remove("hidden");
  }

  tabs.forEach((tab) => tab.addEventListener("click", () => activateTab(tab)));

  /**
   * 외부에서 탭ID로 탭 전환 (문의하기 버튼 등에서 사용)
   * @method switchTab
   * @param {string} targetId - 전환할 탭의 data-target 값
   * @returns {-}
   */
  function switchTab(targetId) {
    const tab = $(`.tab-btn[data-target="${targetId}"]`);
    if (tab) tab.click();
  }
  window.switchTab = switchTab;

  // ===================== 전화번호 포맷 =====================

  /**
   * 전화번호 문자열에 하이픈을 자동으로 삽입 (XXX-XXXX-XXXX)
   * @method formatPhoneNumber
   * @param {string} value - 포맷할 전화번호 문자열
   * @returns {string} 하이픈이 삽입된 전화번호
   */
  function formatPhoneNumber(value) {
    const n = value.replace(/\D/g, "");
    if (n.length < 4) return n;
    if (n.length < 8) return `${n.slice(0, 3)}-${n.slice(3)}`;
    return `${n.slice(0, 3)}-${n.slice(3, 7)}-${n.slice(7, 11)}`;
  }

  $$(".phone-input").forEach((input) =>
    input.addEventListener("input", (e) => { e.target.value = formatPhoneNumber(e.target.value); })
  );

  // ===================== Google Sheets 연동 =====================

  const inquiryForm = $("#inquiryForm");
  const submitBtn = $("#submitBtn");
  const submitLoader = $("#submitLoader");

  /**
   * 문의 폼 제출 → Google Apps Script로 POST 요청
   * @method onInquirySubmit
   * @param {Event} e - submit 이벤트 객체
   * @returns {-}
   */
  inquiryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (GOOGLE_SCRIPT_URL.includes("YOUR_")) return alert("스크립트 URL을 확인해주세요.");

    submitBtn.disabled = true;
    submitLoader.classList.remove("hidden");

    const fd = new FormData(inquiryForm);
    const payload = { title: fd.get("title"), category: fd.get("category"), phone: fd.get("phone"), password: fd.get("password"), content: fd.get("content") };

    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.result === "success") {
          alert("문의가 성공적으로 접수되었습니다.\n'내 문의글' 탭에서 확인하실 수 있습니다.");
          inquiryForm.reset();
        } else {
          alert("오류가 발생했습니다: " + JSON.stringify(data));
        }
      })
      .catch(() => alert("서버 통신 중 오류가 발생했습니다."))
      .finally(() => { submitBtn.disabled = false; submitLoader.classList.add("hidden"); });
  });

  // ===================== 문의글 조회 =====================

  const checkForm = $("#checkInquiryForm");
  const checkBtn = $("#checkBtn");
  const checkLoader = $("#checkLoader");
  const inquiryLogin = $("#inquiryLogin");
  const inquiryResult = $("#inquiryResult");
  const resultList = $("#resultList");
  const noResult = $("#noResult");

  /**
   * 전화번호/비밀번호로 문의글 조회 → Google Apps Script GET 요청
   * @method onCheckSubmit
   * @param {Event} e - submit 이벤트 객체
   * @returns {-}
   */
  checkForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const phone = $("#checkPhone").value;
    const pw = $("#checkPw").value;

    checkBtn.disabled = true;
    checkLoader.classList.remove("hidden");

    fetch(`${GOOGLE_SCRIPT_URL}?phone=${encodeURIComponent(phone)}&password=${encodeURIComponent(pw)}`)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((data) => { renderResults(data); inquiryLogin.classList.add("hidden"); inquiryResult.classList.remove("hidden"); })
      .catch(() => alert("조회에 실패했습니다.\n관리자에게 문의하거나 잠시 후 다시 시도해주세요."))
      .finally(() => { checkBtn.disabled = false; checkLoader.classList.add("hidden"); });
  });

  /**
   * 조회된 문의 결과 목록을 DOM에 렌더링
   * @method renderResults
   * @param {Array<Object>} items - 문의 데이터 배열 [{category, date, title, content}]
   * @returns {-}
   */
  function renderResults(items) {
    resultList.innerHTML = "";
    if (!items?.length) { noResult.classList.remove("hidden"); return; }

    noResult.classList.add("hidden");
    items.forEach((item) => {
      const div = document.createElement("div");
      div.className = "bg-white p-4 rounded border border-gray-200 shadow-sm";
      div.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <span class="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded">${item.category}</span>
          <span class="text-gray-400 text-xs">${item.date}</span>
        </div>
        <h4 class="font-bold text-gray-800 text-sm mb-1">${item.title}</h4>
        <p class="text-gray-600 text-xs line-clamp-2">${item.content}</p>`;
      resultList.appendChild(div);
    });
  }

  /**
   * 조회 결과 → 로그인 화면으로 복귀
   * @method onBackToLogin
   * @param {-} -
   * @returns {-}
   */
  $("#backToLogin").addEventListener("click", () => {
    inquiryResult.classList.add("hidden");
    inquiryLogin.classList.remove("hidden");
    checkForm.reset();
  });

  // ===================== Plotly 차트 =====================

  /**
   * 태양광 설치 현황 막대 그래프 생성 (Plotly)
   * @method createChart
   * @param {-} -
   * @returns {-}
   */
  const chartData = [
    { category: "2018", value: 2300 }, { category: "2019", value: 3800 },
    { category: "2020", value: 4900 }, { category: "2021", value: 3900 },
    { category: "2022", value: 3100 }, { category: "2023", value: 2900 },
    { category: "2024", value: 3100 }, { category: "2025", value: 3000 },
    { category: "2026", value: 3000 }, { category: "2027", value: 3100 },
    { category: "2028", value: 3300 }, { category: "2029", value: 3700 },
    { category: "2030", value: 4000 },
  ];

  Plotly.newPlot(
    "myDiv",
    [{ x: chartData.map((d) => d.category), y: chartData.map((d) => d.value), type: "bar", marker: { color: "#3b82f6" } }],
    { title: "국내 태양광 설치 현황", xaxis: { title: "기간" }, yaxis: { title: "설치량 (MW)" }, margin: { t: 40, b: 40, l: 50, r: 20 } },
    { responsive: true }
  );

  // ===================== 수익 계산기 =====================

  /**
   * 용량별 수익 데이터 생성 (100~2000kW, 100단위)
   * @method generateTableData
   * @param {-} -
   * @returns {Array<Object>} tableData - 용량별 수익 데이터 배열
   */
  function generateTableData() {
    const result = [];
    for (let kw = 100; kw <= 2000; kw += 100) {
      const ratio = kw >= 1000 ? 0.25 : 0.2;
      const ownerKw = kw * ratio;
      const rentalKw = kw - ownerKw;
      const rentYear = rentalKw * 30000;
      const ownYear = ownerKw * 250000;
      result.push({
        label: `${kw}kW / ${kw * 2}평`,
        ratioText: `${Math.round(ratio * 100)}%`,
        ownerKw, rentalKw, rentYear, ownYear,
        rent5: rentYear * 5, own5: ownYear * 5,
        total5: (rentYear + ownYear) * 5,
      });
    }
    return result;
  }

  const tableData = generateTableData();
  const selectEl = $("#capacitySelect");
  const ratioInput = $("#ratioDisplay");
  const ownerInput = $("#ownerKwDisplay");
  const rentalInput = $("#rentalKwDisplay");
  const calcBtn = $("#calcBtn");
  const resultSection = $("#resultSection");

  // 셀렉트 옵션 생성
  tableData.forEach((item, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.text = item.label;
    selectEl.appendChild(opt);
  });

  /**
   * 셀렉트 변경 시 비율/소유자kW/임대kW 표시 업데이트
   * @method updateDisplayFields
   * @param {-} -
   * @returns {-}
   */
  function updateDisplayFields() {
    const d = tableData[selectEl.value];
    if (!d) return;
    ratioInput.value = d.ratioText;
    ownerInput.value = `${d.ownerKw} kW`;
    rentalInput.value = `${d.rentalKw} kW`;
    resultSection.classList.add("hidden");
  }

  updateDisplayFields();
  selectEl.addEventListener("change", updateDisplayFields);

  /**
   * 숫자를 한국어 로케일 형식으로 포맷 (콤마 구분)
   * @method fmt
   * @param {number} num - 포맷할 숫자
   * @returns {string} 콤마가 포함된 문자열
   */
  const fmt = (num) => num.toLocaleString("ko-KR");

  /**
   * 수익 계산 버튼 클릭 → 결과 표시
   * @method onCalcClick
   * @param {-} -
   * @returns {-}
   */
  calcBtn.addEventListener("click", () => {
    const d = tableData[selectEl.value];
    if (!d) return;
    $("#resRentYear").textContent = `${fmt(d.rentYear)} 원`;
    $("#resRent5").textContent = `${fmt(d.rent5)} 원`;
    $("#resOwnYear").textContent = `${fmt(d.ownYear)} 원`;
    $("#resOwn5").textContent = `${fmt(d.own5)} 원`;
    $("#resTotal").textContent = fmt(d.total5);
    resultSection.classList.remove("hidden");
  });

  // ===================== 프로젝트 포트폴리오 =====================

  const projectsData = [
    { title: "부울경 산업단지 태양광 보급", content: "부산, 울산, 경남지역의 공장 및 물류센터 지붕 유휴부지 활용 태양광 발전소 구축.", day: "2025-11-20", src: "https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "강원도 산간지역 에코 빌리지", content: "친환경 에코 빌리지 단지 내 가정용 태양광 설비 일괄 시공.", day: "2024-09-15", src: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "베트남 동라이 100메가 프로젝트 참여", content: "베트남 동라이 100메가 프로젝트 참여", day: "2025-07-07", src: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "전국농공단지 태양광 보급 컨설팅", content: "전국농공단지 15,000개 공장 태양광 보급 컨설팅", day: "2024-03-10", src: "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "대전/대덕산업단지 태양광 전담 보급", content: "대전산업단지, 대덕산업단지 태양광 전담 보급", day: "2025-02-22", src: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  ];

  /**
   * 프로젝트 카드 그리드 생성
   * @method buildProjectGrid
   * @param {-} -
   * @returns {-}
   */
  const gridContainer = $("#grid-container");
  projectsData.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer group border border-gray-100";
    card.onclick = () => openModal(i);
    card.innerHTML = `
      <div class="h-44 overflow-hidden">
        <img src="${item.src}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
      </div>
      <div class="p-4 flex flex-col justify-between h-28">
        <h4 class="font-bold text-sm text-gray-800 group-hover:text-blue-600 transition line-clamp-2">${item.title}</h4>
        <p class="text-xs text-gray-500 mt-auto flex items-center gap-1"><i class="fa-regular fa-calendar"></i>${item.day}</p>
      </div>`;
    gridContainer.appendChild(card);
  });

  // ===================== 프로젝트 모달 =====================

  let currentIdx = 0;
  const modal = $("#projectModal");
  const modalImage = $("#modalImage");
  const modalTitle = $("#modalTitle");
  const modalDate = $("#modalDate");
  const modalContent = $("#modalContent");
  const currentCount = $("#currentCount");
  $("#totalCount").textContent = projectsData.length;

  /**
   * 모달 내부 콘텐츠를 프로젝트 인덱스에 맞게 업데이트
   * @method updateModal
   * @param {number} idx - 프로젝트 인덱스
   * @returns {-}
   */
  function updateModal(idx) {
    const p = projectsData[idx];
    modalImage.src = p.src;
    modalTitle.textContent = p.title;
    modalDate.textContent = p.day;
    modalContent.textContent = p.content;
    currentCount.textContent = idx + 1;
  }

  /**
   * 프로젝트 모달 열기
   * @method openModal
   * @param {number} idx - 프로젝트 인덱스
   * @returns {-}
   */
  function openModal(idx) {
    currentIdx = idx;
    updateModal(idx);
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  /**
   * 프로젝트 모달 닫기
   * @method closeModal
   * @param {-} -
   * @returns {-}
   */
  function closeModal() {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  $("#closeModal").addEventListener("click", closeModal);
  $("#closeModalBtn").addEventListener("click", closeModal);
  $("#modalBackdrop").addEventListener("click", closeModal);

  /**
   * 모달 내 이전/다음 프로젝트 이동 (순환)
   * @method navigateModal
   * @param {number} dir - 이동 방향 (-1: 이전, 1: 다음)
   * @returns {-}
   */
  function navigateModal(dir) {
    currentIdx = (currentIdx + dir + projectsData.length) % projectsData.length;
    updateModal(currentIdx);
  }

  $("#prevBtn").addEventListener("click", (e) => { e.stopPropagation(); navigateModal(-1); });
  $("#nextBtn").addEventListener("click", (e) => { e.stopPropagation(); navigateModal(1); });

  // ===================== 개인정보 모달 =====================

  const privacyModal = $("#privacyModal");

  /**
   * 개인정보 동의 모달 토글 (열기/닫기)
   * @method togglePrivacyModal
   * @param {boolean} show - true면 열기, false면 닫기
   * @returns {-}
   */
  function togglePrivacyModal(show) {
    privacyModal.classList.toggle("hidden", !show);
    document.body.style.overflow = show ? "hidden" : "";
  }

  $("#modalButton").addEventListener("click", () => togglePrivacyModal(true));
  $("#closeBtn").addEventListener("click", () => togglePrivacyModal(false));
  $("#agreeAndCloseBtn").addEventListener("click", () => togglePrivacyModal(false));
});

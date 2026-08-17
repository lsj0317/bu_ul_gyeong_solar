document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       DOM HELPER
    ========================================================== */

    const $ = (selector) =>
        document.querySelector(selector);

    const $$ = (selector) =>
        document.querySelectorAll(selector);


    /* =========================================================
       MOBILE NAVIGATION
    ========================================================== */

    const mobileMenuButton =
        $("#mobileMenuButton");

    const mobileNav =
        $("#mobileNav");


    if (mobileMenuButton && mobileNav) {

        mobileMenuButton.addEventListener(
            "click",
            () => {

                const isOpen =
                    mobileNav.classList.toggle("open");

                mobileMenuButton.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );

            }
        );


        $$("#mobileNav a").forEach((link) => {

            link.addEventListener(
                "click",
                () => {

                    mobileNav.classList.remove("open");

                    mobileMenuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });

    }


    /* =========================================================
       HEADER SCROLL
    ========================================================== */

    const navbar =
        $("#navbar");


    window.addEventListener(
        "scroll",
        () => {

            if (!navbar) {
                return;
            }

            if (window.scrollY > 20) {

                navbar.classList.add(
                    "is-scrolled"
                );

            } else {

                navbar.classList.remove(
                    "is-scrolled"
                );

            }

        },
        { passive: true }
    );


    /* =========================================================
       SMOOTH SCROLL
    ========================================================== */

    $$('a[href^="#"]').forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const targetId =
                    link.getAttribute("href");

                if (!targetId ||
                    targetId === "#") {
                    return;
                }

                const target =
                    $(targetId);

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });


    /* =========================================================
       PHONE FORMATTER
    ========================================================== */

    function formatPhoneNumber(value) {

        const number =
            value.replace(/\D/g, "");

        if (number.length <= 3) {
            return number;
        }

        if (number.length <= 7) {

            return (
                number.slice(0, 3) +
                "-" +
                number.slice(3)
            );

        }

        return (
            number.slice(0, 3) +
            "-" +
            number.slice(3, 7) +
            "-" +
            number.slice(7, 11)
        );

    }


    $$(".phone-input").forEach((input) => {

        input.addEventListener(
            "input",
            (event) => {

                event.target.value =
                    formatPhoneNumber(
                        event.target.value
                    );

            }
        );

    });


    /* =========================================================
       HERO QUICK CONTACT
    ========================================================== */

    const GOOGLE_APP_SCRIPT_URL ="https://script.google.com/macros/s/AKfycbxeKBEM4iHQSHKIt_gtn1NsHVrJap8dtyr32E3FWu7vxjEz7Mq1sjCE152DY4rkRcT7EQ/exec";

    const heroContactForm =
        $("#heroContactForm");


    if (heroContactForm) {

        heroContactForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                const content =
                    heroContactForm
                        .querySelector(
                            '[name="content"]'
                        )
                        .value
                        .trim();


                const phone =
                    heroContactForm
                        .querySelector(
                            '[name="phone"]'
                        )
                        .value
                        .trim();


                const consent =
                    heroContactForm
                        .querySelector(
                            '[name="consent"]'
                        );


                if (!content || !phone) {

                    alert(
                        "상담내용과 연락처를 입력해주세요."
                    );

                    return;

                }


                if (!consent.checked) {

                    alert(
                        "개인정보 수집 및 이용에 동의해주세요."
                    );

                    return;

                }


                // 중복 클릭 방지
                const submitButton =
                    heroContactForm.querySelector(
                        'button[type="submit"]'
                    );


                if (submitButton) {

                    submitButton.disabled = true;
                    submitButton.textContent =
                        "접수 중...";

                }


                try {

                    const formData =
                        new URLSearchParams();

                    formData.append(
                        "content",
                        content
                    );

                    formData.append(
                        "phone",
                        phone
                    );

                    formData.append(
                        "consent",
                        "동의"
                    );


                    await fetch(
                        GOOGLE_APP_SCRIPT_URL,
                        {
                            method: "POST",

                            mode: "no-cors",

                            body: formData
                        }
                    );


                    alert(
                        "상담신청이 정상적으로 접수되었습니다."
                    );


                    heroContactForm.reset();


                } catch (error) {

                    console.error(
                        "상담신청 오류:",
                        error
                    );


                    alert(
                        "신청 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
                    );

                } finally {

                    if (submitButton) {

                        submitButton.disabled = false;
                        submitButton.textContent =
                            "상담신청";

                    }

                }

            }
        );

    }


    /* =========================================================
       TAB SYSTEM
    ========================================================== */

    const tabs =
        $$(".tab-btn");

    const tabContents =
        $$(".tab-content");


    function activateTab(activeTab) {

        tabs.forEach((tab) => {

            tab.classList.toggle(
                "active",
                tab === activeTab
            );

        });


        tabContents.forEach((content) => {

            content.classList.add("hidden");

        });


        const target =
            $(`#${activeTab.dataset.target}`);

        if (target) {

            target.classList.remove("hidden");

        }

    }


    tabs.forEach((tab) => {

        tab.addEventListener(
            "click",
            () => activateTab(tab)
        );

    });


    function switchTab(targetId) {

        const targetTab =
            $(`.tab-btn[data-target="${targetId}"]`);

        if (targetTab) {

            activateTab(targetTab);

        }

    }


    window.switchTab =
        switchTab;


    /* =========================================================
       REVENUE CALCULATOR
    ========================================================== */

    function generateTableData() {

        const result = [];


        for (
            let kw = 100;
            kw <= 2000;
            kw += 100
        ) {

            const ratio =
                kw >= 1000
                    ? 0.25
                    : 0.20;


            const ownerKw =
                kw * ratio;


            const rentalKw =
                kw - ownerKw;


            const rentYear =
                rentalKw * 30000;


            const ownYear =
                ownerKw * 250000;


            result.push({

                label:
                    `${kw}kW / 약 ${kw * 2}평`,

                ratioText:
                    `${Math.round(ratio * 100)}%`,

                ownerKw,

                rentalKw,

                rentYear,

                ownYear,

                rent5:
                    rentYear * 5,

                own5:
                    ownYear * 5,

                total5:
                    (rentYear + ownYear) * 5

            });

        }


        return result;

    }


    const tableData =
        generateTableData();


    const selectEl =
        $("#capacitySelect");

    const ratioInput =
        $("#ratioDisplay");

    const ownerInput =
        $("#ownerKwDisplay");

    const rentalInput =
        $("#rentalKwDisplay");

    const calcBtn =
        $("#calcBtn");

    const resultSection =
        $("#resultSection");


    if (selectEl) {

        tableData.forEach(
            (item, index) => {

                const option =
                    document.createElement("option");

                option.value =
                    index;

                option.textContent =
                    item.label;

                selectEl.appendChild(option);

            }
        );


        function updateCalculatorFields() {

            const data =
                tableData[
                    Number(selectEl.value)
                    ];


            if (!data) {
                return;
            }


            ratioInput.value =
                data.ratioText;

            ownerInput.value =
                `${data.ownerKw} kW`;

            rentalInput.value =
                `${data.rentalKw} kW`;


            resultSection
                ?.classList.add("hidden");

        }


        updateCalculatorFields();


        selectEl.addEventListener(
            "change",
            updateCalculatorFields
        );


        if (calcBtn) {

            calcBtn.addEventListener(
                "click",
                () => {

                    const data =
                        tableData[
                            Number(selectEl.value)
                            ];


                    if (!data) {
                        return;
                    }


                    const format =
                        (number) =>
                            number.toLocaleString(
                                "ko-KR"
                            );


                    $("#resRentYear")
                        .textContent =
                        `${format(data.rentYear)} 원`;

                    $("#resRent5")
                        .textContent =
                        `${format(data.rent5)} 원`;

                    $("#resOwnYear")
                        .textContent =
                        `${format(data.ownYear)} 원`;

                    $("#resOwn5")
                        .textContent =
                        `${format(data.own5)} 원`;

                    $("#resTotal")
                        .textContent =
                        format(data.total5);


                    resultSection
                        ?.classList.remove("hidden");

                }
            );

        }

    }



    /* =========================================================
       PRIVACY MODAL
    ========================================================== */

    const privacyModal =
        $("#privacyModal");


    function togglePrivacyModal(show) {

        if (!privacyModal) {
            return;
        }


        privacyModal.classList.toggle(
            "hidden",
            !show
        );


        document.body.style.overflow =
            show
                ? "hidden"
                : "";

    }


    $("#modalButton")
        ?.addEventListener(
            "click",
            () => togglePrivacyModal(true)
        );


    $("#closeBtn")
        ?.addEventListener(
            "click",
            () => togglePrivacyModal(false)
        );


    $("#agreeAndCloseBtn")
        ?.addEventListener(
            "click",
            () => togglePrivacyModal(false)
        );



});

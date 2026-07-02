const accessForm = document.querySelector("#accessForm");
const passwordInput = document.querySelector("#password");
const accessMessage = document.querySelector("#accessMessage");
const continueButton = document.querySelector("#continueButton");
const skipIntroButton = document.querySelector("#skipIntroButton");

const gateScreen = document.querySelector("#gateScreen");
const welcomeScreen = document.querySelector("#welcomeScreen");
const introScreen = document.querySelector("#introScreen");
const mainScreen = document.querySelector("#mainScreen");
const introVideo = document.querySelector("#introVideo");
const introProgressBar = document.querySelector("#introProgressBar");
const openTemplePanelButton = document.querySelector("#openTemplePanel");
const templePanel = document.querySelector("#templePanel");
const closeTemplePanelButton = document.querySelector("#closeTemplePanel");
const templeAcceptanceCta = document.querySelector("#templeAcceptanceCta");
const gateList = document.querySelector("#gateList");
const gateDetail = document.querySelector("#gateDetail");
const gateDetailNumber = document.querySelector("#gateDetailNumber");
const gateDetailEgyptian = document.querySelector("#gateDetailEgyptian");
const gateDetailTitle = document.querySelector("#gateDetailTitle");
const gateDetailText = document.querySelector("#gateDetailText");
const openKimonoPanelButton = document.querySelector("#openKimonoPanel");
const kimonoPanel = document.querySelector("#kimonoPanel");
const closeKimonoPanelButton = document.querySelector("#closeKimonoPanel");
const revealKimonoFormButton = document.querySelector("#revealKimonoForm");
const kimonoHiddenSection = document.querySelector("#kimonoHiddenSection");

const correctPassword = "maakheryu";
const transitionDuration = 1000;
const introFallbackDuration = 8000;

let introFallbackTimer;
let introHasFinished = false;
let introHasStarted = false;
let activeGateIndex = 0;
let gateTransitionTimer;

const templeGates = [
  {
    number: "I",
    egyptian: "wꜥw",
    title: "Birinci Kapı: Sessizlik",
    text: "İçeri giren kişi önce sesinden ayrılır. Tapınakta ilk kabul, konuşmakla değil susmakla başlar. Gürültü dışarıda kalır."
  },
  {
    number: "II",
    egyptian: "snwj",
    title: "İkinci Kapı: Eşik",
    text: "Kapı ticari bir giriş değildir. Buradan geçen kişi artık bir müşteri gibi değil, gözlemlenen bir aday gibi kabul edilir."
  },
  {
    number: "III",
    egyptian: "ḫmtw",
    title: "Üçüncü Kapı: Göz",
    text: "Tapınakta önce kişi bakmaz; mekân kişiye bakar. Kimono henüz gösterilmez. Ziyaretçinin taşıdığı niyet ölçülür."
  },
  {
    number: "IV",
    egyptian: "jfdw",
    title: "Dördüncü Kapı: Ölçü",
    text: "Her beden ölçülmez. Önce duruş, sabır ve taşıma biçimi ölçülür. Çünkü MAA KHERU’da giysi bedene değil, karaktere yerleşir."
  },
  {
    number: "V",
    egyptian: "djw",
    title: "Beşinci Kapı: Vitrin",
    text: "Vitrin açık değildir. Ürün sergilenmez; saklanır. Görülmek isteyen değil, görülmeye layık olan içeri alınır."
  },
  {
    number: "VI",
    egyptian: "sjsw",
    title: "Altıncı Kapı: Bekleyiş",
    text: "Beklemek sistemin parçasıdır. Hızlı ulaşılabilen şey değer taşımaz. Tapınakta zaman, erişimin ilk bedelidir."
  },
  {
    number: "VII",
    egyptian: "sfḫw",
    title: "Yedinci Kapı: İsim",
    text: "Aday kendi adını bırakır. Burada kişinin dışarıdaki unvanı değil, içeriye taşıdığı niyet önemlidir."
  },
  {
    number: "VIII",
    egyptian: "ḫmnw",
    title: "Sekizinci Kapı: Kumaş",
    text: "Kumaş yalnızca malzeme değildir. Siyah yüzey, görünür olanı örter; altın çizgi, saklı olanı işaret eder."
  },
  {
    number: "IX",
    egyptian: "psḏw",
    title: "Dokuzuncu Kapı: Mühür",
    text: "Mühür sahiplik işareti değildir. Kabulün izidir. Kişi ürünü almaz; sistem tarafından işaretlenir."
  },
  {
    number: "X",
    egyptian: "mḏw",
    title: "Onuncu Kapı: Hakikat",
    text: "Burada dekor yoktur. Süs, yalnızca saklı hakikati taşıyorsa kalır. Fazla olan atılır; kalan şey ritüele dönüşür."
  },
  {
    number: "XI",
    egyptian: "mḏw + wꜥw",
    title: "On Birinci Kapı: Kabul",
    text: "Kabul satın alma anı değildir. Tapınak, kişinin ürüne uygun olup olmadığına karar verir. Kimono ancak o anda görünür hale gelir."
  },
  {
    number: "XII",
    egyptian: "mḏw + snwj",
    title: "On İkinci Kapı: Dönüş",
    text: "Son kapı çıkış değildir. Dışarı dönen kişi aynı kişi değildir. MAA KHERU burada başlar: görünür dünyaya dönmüş ama ona artık inanmayan kişi."
  }
];

function transitionTo(currentScreen, nextScreen, callback) {
  currentScreen.classList.add("is-leaving");
  currentScreen.classList.remove("is-active");

  nextScreen.setAttribute("aria-hidden", "false");
  nextScreen.classList.add("is-active");

  window.setTimeout(() => {
    currentScreen.classList.remove("is-leaving");
    currentScreen.setAttribute("aria-hidden", "true");

    if (typeof callback === "function") {
      callback();
    }
  }, transitionDuration);
}

function denyAccess() {
  accessMessage.textContent = "Erişim reddedildi.";
  accessMessage.classList.remove("is-denied");

  // Restart the restrained message animation on repeated attempts.
  void accessMessage.offsetWidth;
  accessMessage.classList.add("is-denied");

  passwordInput.setAttribute("aria-invalid", "true");
  passwordInput.select();
}

accessForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (passwordInput.value.trim().toLowerCase() !== correctPassword) {
    denyAccess();
    return;
  }

  accessMessage.textContent = "";
  passwordInput.setAttribute("aria-invalid", "false");
  accessForm.querySelector("button").disabled = true;

  transitionTo(gateScreen, welcomeScreen, () => {
    continueButton.focus({ preventScroll: true });
  });
});

passwordInput.addEventListener("input", () => {
  if (accessMessage.textContent) {
    accessMessage.textContent = "";
    accessMessage.classList.remove("is-denied");
    passwordInput.removeAttribute("aria-invalid");
  }
});

function clearIntroFallback() {
  window.clearTimeout(introFallbackTimer);
  introFallbackTimer = undefined;
}

function armIntroFallback() {
  if (!introHasStarted || introHasFinished) {
    return;
  }

  clearIntroFallback();
  introFallbackTimer = window.setTimeout(revealMainSite, introFallbackDuration);
}

function updateIntroProgress() {
  if (!Number.isFinite(introVideo.duration) || introVideo.duration <= 0) {
    introProgressBar.style.transform = "scaleX(0)";
    return;
  }

  const progress = Math.min(introVideo.currentTime / introVideo.duration, 1);
  introProgressBar.style.transform = `scaleX(${progress})`;
}

function revealMainSite() {
  if (!introHasStarted || introHasFinished) {
    return;
  }

  introHasFinished = true;
  clearIntroFallback();
  introVideo.pause();
  introProgressBar.style.transform = "scaleX(1)";

  transitionTo(introScreen, mainScreen, () => {
    document.body.classList.add("main-visible");
    window.scrollTo({ top: 0, behavior: "auto" });
    document.querySelector(".topbar__brand").focus({ preventScroll: true });
  });
}

function startIntro() {
  introHasStarted = true;
  introHasFinished = false;
  introVideo.muted = true;
  introVideo.currentTime = 0;
  introProgressBar.style.transform = "scaleX(0)";
  armIntroFallback();

  const playbackAttempt = introVideo.play();

  if (playbackAttempt && typeof playbackAttempt.catch === "function") {
    playbackAttempt.catch(() => {
      // The existing watchdog continues to the main site after eight seconds.
    });
  }
}

continueButton.addEventListener("click", () => {
  continueButton.disabled = true;
  transitionTo(welcomeScreen, introScreen);
  startIntro();
});

skipIntroButton.addEventListener("click", revealMainSite);

introVideo.addEventListener("playing", clearIntroFallback);
introVideo.addEventListener("timeupdate", updateIntroProgress);
introVideo.addEventListener("ended", revealMainSite);
introVideo.addEventListener("error", armIntroFallback);
introVideo.addEventListener("stalled", armIntroFallback);
introVideo.addEventListener("waiting", armIntroFallback);

function selectTempleGate(index, moveFocus = false) {
  const gate = templeGates[index];
  const gateButtons = [...gateList.querySelectorAll(".gate-marker")];

  activeGateIndex = index;

  gateButtons.forEach((button, buttonIndex) => {
    const isActive = buttonIndex === index;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });

  gateDetail.setAttribute("aria-labelledby", gateButtons[index].id);
  gateDetail.classList.remove("is-visible");
  window.clearTimeout(gateTransitionTimer);

  gateTransitionTimer = window.setTimeout(() => {
    gateDetailNumber.textContent = gate.number;
    gateDetailEgyptian.textContent = gate.egyptian;
    gateDetailTitle.textContent = gate.title;
    gateDetailText.textContent = gate.text;
    gateDetail.classList.add("is-visible");
  }, 160);

  if (moveFocus) {
    gateButtons[index].focus();
  }
}

function buildTempleGates() {
  templeGates.forEach((gate, index) => {
    const button = document.createElement("button");
    const number = document.createElement("span");
    const name = document.createElement("span");

    button.type = "button";
    button.className = "gate-marker";
    button.id = `gateMarker${index + 1}`;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", "gateDetail");
    button.setAttribute("aria-label", gate.title);

    number.className = "gate-marker__number";
    number.textContent = gate.number;
    name.className = "gate-marker__name";
    name.textContent = gate.egyptian;

    button.append(number, name);
    button.addEventListener("click", () => selectTempleGate(index));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) {
        return;
      }

      event.preventDefault();

      if (event.key === "Home") {
        selectTempleGate(0, true);
        return;
      }

      if (event.key === "End") {
        selectTempleGate(templeGates.length - 1, true);
        return;
      }

      const direction = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
      const nextIndex = (activeGateIndex + direction + templeGates.length) % templeGates.length;
      selectTempleGate(nextIndex, true);
    });

    gateList.append(button);
  });

  selectTempleGate(0);
}

function openTemplePanel() {
  templePanel.classList.add("is-open");
  templePanel.setAttribute("aria-hidden", "false");
  mainScreen.setAttribute("inert", "");
  document.body.classList.add("panel-open");

  window.requestAnimationFrame(() => {
    closeTemplePanelButton.focus({ preventScroll: true });
  });
}

function closeTemplePanel({ returnFocus = true } = {}) {
  templePanel.classList.remove("is-open");
  templePanel.setAttribute("aria-hidden", "true");
  mainScreen.removeAttribute("inert");
  document.body.classList.remove("panel-open");

  if (returnFocus) {
    openTemplePanelButton.focus({ preventScroll: true });
  }
}

function moveToAcceptance() {
  closeTemplePanel({ returnFocus: false });

  window.setTimeout(() => {
    document.querySelector("#acceptance").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 650);
}

function handleTemplePanelKeys(event) {
  if (!templePanel.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    closeTemplePanel();
    return;
  }

  if (event.key !== "Tab") {
    return;
  }

  const focusableElements = [
    ...templePanel.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')
  ].filter((element) => element.offsetParent !== null);

  if (!focusableElements.length) {
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

buildTempleGates();

openTemplePanelButton.addEventListener("click", openTemplePanel);
closeTemplePanelButton.addEventListener("click", () => closeTemplePanel());
templeAcceptanceCta.addEventListener("click", moveToAcceptance);
document.addEventListener("keydown", handleTemplePanelKeys);

function openKimonoPanel() {
  kimonoHiddenSection.classList.remove("is-revealed");
  kimonoHiddenSection.setAttribute("aria-hidden", "true");
  revealKimonoFormButton.setAttribute("aria-expanded", "false");

  kimonoPanel.classList.add("is-open");
  kimonoPanel.setAttribute("aria-hidden", "false");
  mainScreen.setAttribute("inert", "");
  document.body.classList.add("panel-open");

  window.requestAnimationFrame(() => {
    closeKimonoPanelButton.focus({ preventScroll: true });
  });
}

function closeKimonoPanel() {
  kimonoPanel.classList.remove("is-open");
  kimonoPanel.setAttribute("aria-hidden", "true");
  mainScreen.removeAttribute("inert");
  document.body.classList.remove("panel-open");
  openKimonoPanelButton.focus({ preventScroll: true });
}

function revealKimonoForm() {
  kimonoHiddenSection.classList.add("is-revealed");
  kimonoHiddenSection.setAttribute("aria-hidden", "false");
  revealKimonoFormButton.setAttribute("aria-expanded", "true");
}

function handleKimonoPanelKeys(event) {
  if (!kimonoPanel.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    closeKimonoPanel();
    return;
  }

  if (event.key !== "Tab") {
    return;
  }

  const focusableElements = [
    ...kimonoPanel.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')
  ].filter((element) => element.offsetParent !== null);

  if (!focusableElements.length) {
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

openKimonoPanelButton.addEventListener("click", openKimonoPanel);
closeKimonoPanelButton.addEventListener("click", closeKimonoPanel);
revealKimonoFormButton.addEventListener("click", revealKimonoForm);
document.addEventListener("keydown", handleKimonoPanelKeys);

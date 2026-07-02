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

const correctPassword = "maakheryu";
const transitionDuration = 1000;
const introFallbackDuration = 8000;

let introFallbackTimer;
let introHasFinished = false;
let introHasStarted = false;

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

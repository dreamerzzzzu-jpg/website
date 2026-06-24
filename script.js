const accessForm = document.querySelector("#accessForm");
const passwordInput = document.querySelector("#password");
const accessMessage = document.querySelector("#accessMessage");
const continueButton = document.querySelector("#continueButton");

const gateScreen = document.querySelector("#gateScreen");
const welcomeScreen = document.querySelector("#welcomeScreen");
const mainScreen = document.querySelector("#mainScreen");

const correctPassword = "maakheryu";
const transitionDuration = 1000;

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

continueButton.addEventListener("click", () => {
  transitionTo(welcomeScreen, mainScreen, () => {
    document.body.classList.add("main-visible");
    window.scrollTo({ top: 0, behavior: "auto" });
    document.querySelector(".topbar__brand").focus({ preventScroll: true });
  });
});

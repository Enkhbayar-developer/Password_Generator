const elements = {
  passwordInput: document.getElementById("password"),
  lengthSlider: document.getElementById("length"),
  lengthDisplay: document.getElementById("length-value"),
  uppercaseCheckbox: document.getElementById("uppercase"),
  lowercaseCheckbox: document.getElementById("lowercase"),
  numbersCheckbox: document.getElementById("numbers"),
  symbolsCheckbox: document.getElementById("symbols"),
  generateButton: document.getElementById("generate-btn"),
  copyButton: document.getElementById("copy-btn"),
  strengthBar: document.querySelector(".strength-bar"),
  strengthText: document.querySelector(".strength-container p"),
  strengthLabel: document.getElementById("strength-label"),
};

const charSet = {
  uppercaseLetters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercaseLetters: "abcdefghijklmnopqrstuvwxyz",
  numberCharacters: "0123456789",
  symbolCharacters: "!@#$%^&*()-_=+[]{}|;:,.<>?/",
};

elements.lengthSlider.addEventListener("input", () => {
  elements.lengthDisplay.textContent = elements.lengthSlider.value;
});

elements.generateButton.addEventListener("click", makePassword);

function makePassword() {
  const length = Number(elements.lengthSlider.value);
  const includeUppercase = elements.uppercaseCheckbox.checked;
  const includeLowercase = elements.lowercaseCheckbox.checked;
  const includeNumbers = elements.numbersCheckbox.checked;
  const includeSymbols = elements.symbolsCheckbox.checked;

  if (
    !includeUppercase &&
    !includeLowercase &&
    !includeNumbers &&
    !includeSymbols
  ) {
    alert("Please select at least one char type.");
    return;
  }

  const newPassword = createRandomPassword(
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols
  );

  elements.passwordInput.value = newPassword;
  updateStrengthMeter(newPassword);
}

function updateStrengthMeter(password) {
  const passwordLength = password.length;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbols = /[!@#$%^&*()-_=+[\]{}|;:,.<>?]/.test(password);

  let strengthScore = 0;

  strengthScore += Math.min(passwordLength * 2.4);

  if (hasUppercase) strengthScore += 15;
  if (hasLowercase) strengthScore += 15;
  if (hasNumber) strengthScore += 15;
  if (hasSymbols) strengthScore += 15;

  if (passwordLength < 8) {
    strengthScore = Math.min(strengthScore, 40);
  }

  const safeScore = Math.max(5, Math.min(100, strengthScore));
  elements.strengthBar.style.width = safeScore + "%";

  let strengthLabelText = "";
  let barColor = "";

  if (strengthScore < 40) {
    barColor = "#fc8181";
    strengthLabelText = "Weak";
  } else if (strengthScore < 70) {
    barColor = "#fbd38d";
    strengthLabelText = "Medium";
  } else {
    barColor = "#68d391";
    strengthLabelText = "Strong";
  }

  elements.strengthBar.style.backgroundColor = barColor;
  elements.strengthLabel.textContent = strengthLabelText;
}

function createRandomPassword(
  length,
  includeUppercase,
  includeLowercase,
  includeNumbers,
  includeSymbols
) {
  let allCharacters = "";

  if (includeUppercase) allCharacters += charSet.uppercaseLetters;
  if (includeLowercase) allCharacters += charSet.lowercaseLetters;
  if (includeNumbers) allCharacters += charSet.numberCharacters;
  if (includeSymbols) allCharacters += charSet.symbolCharacters;

  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    password += allCharacters[randomIndex];
  }

  return password;
}

window.addEventListener("DOMContentLoaded", makePassword);

elements.copyButton.addEventListener("click", () => {
  if (!elements.passwordInput.value) return;
  navigator.clipboard
    .writeText(elements.passwordInput.value)
    .then(() => showCopySuccess())
    .catch((error) => console.log("Could not copy: ", error));
});

function showCopySuccess() {
  elements.copyButton.classList.remove("far", "fa-copy");
  elements.copyButton.classList.add("fas", "fa-check");
  elements.copyButton.style.color = "#48bb78";

  setTimeout(() => {
    elements.copyButton.classList.remove("fas", "fa-check");
    elements.copyButton.classList.add("far", "fa-copy");
    elements.copyButton.style.color = "";
  }, 1500);
}

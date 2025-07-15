function togglePasswordVisibility(inputId, iconId) {
  const passwordField = document.getElementById(inputId);
  const toggleIcon = document.getElementById(iconId);

  toggleIcon.addEventListener("click", function () {
    if (passwordField.type === "password") {
      passwordField.type = "text";
      toggleIcon.classList.remove("fa-eye");
      toggleIcon.classList.add("fa-eye-slash");
    } else {
      passwordField.type = "password";
      toggleIcon.classList.remove("fa-eye-slash");
      toggleIcon.classList.add("fa-eye");
    }
  });
}

function showSignupModal(message, isSuccess, redirectUrl) {
  const modal = document.getElementById("signup-modal");
  const msgSpan = document.getElementById("signup-modal-message");
  const closeBtn = document.getElementById("signup-modal-close");
  msgSpan.textContent = message;
  msgSpan.style.color = isSuccess ? "green" : "red";
  modal.style.display = "flex";

  function closeHandler() {
    modal.style.display = "none";
    closeBtn.removeEventListener("click", closeHandler);
    if (isSuccess && redirectUrl) {
      window.location.href = redirectUrl;
    }
  }
  closeBtn.addEventListener("click", closeHandler);
}

window.addEventListener("DOMContentLoaded", function () {
  togglePasswordVisibility("password", "togglePassword");
  togglePasswordVisibility("confirmPassword", "toggleConfirmPassword");

  const form = document.querySelector("form");
  const signupBtn = document.querySelector(".signup-btn");

  signupBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const username = form
      .querySelector('input[placeholder="Username"]')
      .value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const password = form.querySelector("#password").value;
    const confirmPassword = form.querySelector("#confirmPassword").value;

    if (!username || !email || !password || !confirmPassword) {
      showSignupModal("Please fill in all fields.", false);
      return;
    }
    if (password !== confirmPassword) {
      showSignupModal("Passwords do not match.", false);
      return;
    }
    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({ displayName: username });
      showSignupModal(
        "Account created successfully! Redirecting to login...",
        true,
        "login.html"
      );
    } catch (error) {
      showSignupModal(error.message.replace("Firebase: ", ""), false);
    }
  });
});

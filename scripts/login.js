// Firebase login functionality
window.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const loginBtn = document.querySelector(".login-btn");

  loginBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    const emailOrUser = form.querySelector("#userid").value.trim();
    const password = form.querySelector("#password").value;

    // Assume email for now (Firebase Auth default)
    const email = emailOrUser;

    if (!email || !password) {
      showLoginModal("Please enter both email and password.", false);
      return;
    }
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      showLoginModal(
        "Login successful! Redirecting...",
        true,
        "dashboard.html"
      );
    } catch (error) {
      showLoginModal(error.message.replace("Firebase: ", ""), false);
    }
  });
});

// Show login modal for feedback
function showLoginModal(message, isSuccess, redirectUrl) {
  let modal = document.getElementById("login-modal");
  let msgSpan = document.getElementById("login-modal-message");
  let closeBtn = document.getElementById("login-modal-close");

  if (!modal) {
    // Create modal if it doesn't exist
    modal = document.createElement("div");
    modal.id = "login-modal";
    modal.style.position = "fixed";
    modal.style.top = 0;
    modal.style.left = 0;
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.background = "rgba(0,0,0,0.3)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = 9999;
    modal.innerHTML = `
      <div style="background: #fff; padding: 32px 24px; border-radius: 10px; min-width: 260px; text-align: center; box-shadow: 0 2px 16px rgba(0,0,0,0.15);">
        <span id="login-modal-message" style="display:block; margin-bottom: 18px; font-size: 16px;"></span>
        <button id="login-modal-close" style="padding: 8px 18px; border-radius: 6px; border: none; background: #0056b3; color: #fff; font-weight: bold; cursor: pointer;">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
    msgSpan = document.getElementById("login-modal-message");
    closeBtn = document.getElementById("login-modal-close");
  }
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

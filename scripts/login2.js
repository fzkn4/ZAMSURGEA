// Password toggle logic for login2.html
// If you add an element with id="togglePassword" (e.g., an eye icon), this will enable show/hide password functionality.

const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");

if (togglePassword && password) {
  togglePassword.addEventListener("click", function () {
    // Toggle password visibility
    const type =
      password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
  });
}

// Firebase login functionality
const loginBtn = document.getElementById("loginBtn");
const emailInput = document.querySelector('input[type="email"]');

// Loading state management
function setLoadingState(isLoading) {
  if (loginBtn) {
    if (isLoading) {
      loginBtn.disabled = true;
      loginBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    } else {
      loginBtn.disabled = false;
      loginBtn.innerHTML = "Log In";
    }
  }
}

// Modal popup logic
function showModal(message, callback, type) {
  const modal = document.getElementById("loginModal");
  const modalMsg = document.getElementById("modalMessage");
  const closeBtn = document.getElementById("closeModal");
  const modalIcon = document.getElementById("modalIcon");
  if (!modal || !modalMsg || !closeBtn || !modalIcon) return;
  modalMsg.textContent = message;
  // Set icon based on type
  if (type === "success") {
    modalIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
  } else if (type === "error") {
    modalIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
  } else {
    modalIcon.innerHTML = "";
  }
  modal.style.display = "flex";
  let closed = false;
  function closeModal() {
    if (closed) return;
    closed = true;
    modal.style.display = "none";
    closeBtn.removeEventListener("click", closeModal);
    if (callback) callback();
  }
  closeBtn.onclick = closeModal;
  setTimeout(closeModal, 2500);
}

// Async login function
async function performLogin(email, password) {
  try {
    // Show loading state
    setLoadingState(true);

    // Authenticate with Firebase
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    const uid = user.uid;

    // Get user data from database
    const dbRef = firebase.database().ref("users/" + uid);
    const snapshot = await dbRef.once("value");

    let role = null;
    if (snapshot.exists() && snapshot.val().role) {
      role = snapshot.val().role;
    } else {
      // If user does not exist in DB, create with default role 'client'
      role = "client";
      await dbRef.set({
        email: user.email,
        role: role,
      });
    }

    // Determine redirect based on role
    const redirectUrl =
      role === "admin" ? "dashboard.html" : "client_dashboard.html";
    const redirectMessage =
      role === "admin"
        ? "Login successful! Redirecting to admin dashboard..."
        : "Login successful! Redirecting to client dashboard...";

    // Show success message and redirect
    showModal(
      redirectMessage,
      function () {
        window.location.href = redirectUrl;
      },
      "success"
    );
  } catch (error) {
    // Show error message
    showModal("Login failed: " + error.message, null, "error");
  } finally {
    // Reset loading state
    setLoadingState(false);
  }
}

if (loginBtn) {
  loginBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const email = emailInput.value.trim();
    const pass = password.value;

    if (!email || !pass) {
      showModal("Please enter both email and password.", null, "error");
      return;
    }

    // Call the async login function
    performLogin(email, pass);
  });
}

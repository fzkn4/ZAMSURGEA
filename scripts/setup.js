// setup.js - Account setup with async functionality

// Helper: show modal popup
function showModal(message, type, callback) {
  let modal = document.getElementById("signupModal");
  let msgSpan = document.getElementById("signupModalMsg");
  let iconSpan = document.getElementById("signupModalIcon");
  let closeBtn = document.getElementById("signupModalClose");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "signupModal";
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
        <span id="signupModalIcon" style="font-size:2.5rem;display:block;margin-bottom:10px;"></span>
        <span id="signupModalMsg" style="display:block; margin-bottom: 18px; font-size: 16px;"></span>
        <button id="signupModalClose" style="padding: 8px 18px; border-radius: 6px; border: none; background: #2f619e; color: #fff; font-weight: bold; cursor: pointer;">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
    msgSpan = document.getElementById("signupModalMsg");
    iconSpan = document.getElementById("signupModalIcon");
    closeBtn = document.getElementById("signupModalClose");
  }

  msgSpan.textContent = message;
  if (type === "success") {
    iconSpan.innerHTML =
      '<i class="fas fa-check-circle" style="color:#4CAF50"></i>';
  } else {
    iconSpan.innerHTML =
      '<i class="fas fa-times-circle" style="color:#f44336"></i>';
  }
  modal.style.display = "flex";

  let closed = false;
  function closeHandler() {
    if (closed) return;
    closed = true;
    modal.style.display = "none";
    closeBtn.removeEventListener("click", closeHandler);
    if (callback) callback();
  }
  closeBtn.onclick = closeHandler;
  setTimeout(closeHandler, 2500);
}

// Loading state management
function setLoadingState(isLoading) {
  const nextBtn = document.getElementById("setupNext");
  if (nextBtn) {
    if (isLoading) {
      nextBtn.disabled = true;
      nextBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Processing...';
    } else {
      nextBtn.disabled = false;
      nextBtn.innerHTML = "Next &#8594;";
    }
  }
}

// Email validation function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation function
function isValidPassword(password) {
  return password.length >= 6;
}

// Phone validation function for Philippine numbers
function isValidPhone(phone) {
  // Remove all non-digit characters (spaces, dashes, etc.)
  const cleanPhone = phone.replace(/\D/g, "");

  // Philippine mobile number patterns:
  // 912 345 6789 (10 digits - local format without 09)
  // 9123456789 (10 digits - clean format)

  console.log(
    "Validating phone:",
    phone,
    "Clean:",
    cleanPhone,
    "Length:",
    cleanPhone.length
  );

  if (cleanPhone.length === 10) {
    return true;
  }

  return false;
}

// Format phone number as user types
function formatPhoneNumber(input) {
  let value = input.value.replace(/\D/g, ""); // Remove non-digits

  // Limit to 10 digits only
  if (value.length > 10) {
    value = value.substring(0, 10);
  }

  // Format as 912 345 6780 (with spaces for display)
  if (value.length >= 3) {
    value = value.substring(0, 3) + " " + value.substring(3);
  }
  if (value.length >= 7) {
    value = value.substring(0, 7) + " " + value.substring(7);
  }

  input.value = value;
}

// Get clean phone number for storage
function getCleanPhoneNumber(phone) {
  let clean = phone.replace(/\D/g, ""); // Remove all non-digits

  // Convert to Philippine format with leading 0: 09123456780
  if (clean.length === 10) {
    clean = "0" + clean;
  }

  return clean;
}

// Async function to handle account setup
async function processAccountSetup() {
  try {
    // Show loading state
    setLoadingState(true);

    // Collect form data
    const phoneInput = document.getElementById("phone").value;
    const accountData = {
      email: document.getElementById("email").value.trim(),
      phone: getCleanPhoneNumber(phoneInput),
      password: document.getElementById("password").value,
    };

    // Validate required fields
    if (!accountData.email) {
      showModal("Please enter your email address.", "error");
      return;
    }

    if (!isValidEmail(accountData.email)) {
      showModal("Please enter a valid email address.", "error");
      return;
    }

    if (!phoneInput) {
      showModal("Please enter your phone number.", "error");
      return;
    }

    console.log("Phone input before validation:", phoneInput);
    if (!isValidPhone(phoneInput)) {
      showModal(
        "Please enter a valid Philippine phone number (e.g., 912 345 6789).",
        "error"
      );
      return;
    }

    if (!accountData.password) {
      showModal("Please enter a password.", "error");
      return;
    }

    if (!isValidPassword(accountData.password)) {
      showModal("Password must be at least 6 characters long.", "error");
      return;
    }

    // Check if profile data exists
    const profile = JSON.parse(localStorage.getItem("signupProfile") || "{}");
    if (!profile.firstName || !profile.lastName) {
      showModal(
        "Profile data not found. Please restart the signup process.",
        "error"
      );
      return;
    }

    // Store in localStorage for next step
    localStorage.setItem("signupAccount", JSON.stringify(accountData));

    // Store in localStorage for next step
    localStorage.setItem("signupAccount", JSON.stringify(accountData));

    // Redirect directly without popup
    window.location.href = "coverage.html";
  } catch (error) {
    showModal("Error processing account setup: " + error.message, "error");
  } finally {
    // Reset loading state
    setLoadingState(false);
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Load previously saved data if any
  const savedAccount = JSON.parse(
    localStorage.getItem("signupAccount") || "{}"
  );

  if (savedAccount.email)
    document.getElementById("email").value = savedAccount.email;
  if (savedAccount.phone) {
    // Format saved phone number for display
    const phoneInput = document.getElementById("phone");
    let phoneValue = savedAccount.phone;

    // Remove leading 0 if present for display
    if (phoneValue.startsWith("0")) {
      phoneValue = phoneValue.substring(1);
    }

    phoneInput.value = phoneValue;
    formatPhoneNumber(phoneInput);
  }
  if (savedAccount.password)
    document.getElementById("password").value = savedAccount.password;

  // Bind phone number formatting
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      formatPhoneNumber(this);
    });
  }

  // Bind next button
  const nextBtn = document.getElementById("setupNext");
  if (nextBtn) {
    nextBtn.addEventListener("click", processAccountSetup);
  }
});

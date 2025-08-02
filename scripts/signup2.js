// signup2.js - Profile setup with async functionality

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
  const nextBtn = document.getElementById("signup2Next");
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

// Async function to handle profile data collection
async function processProfileData() {
  try {
    // Show loading state
    setLoadingState(true);

    // Collect form data
    const profileData = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      middleName: document.getElementById("middleName").value.trim(),
      suffix: document.getElementById("suffix").value,
      motherMaidenName: document
        .getElementById("motherMaidenName")
        .value.trim(),
      dob: document.getElementById("dob").value,
      citizenship: document.getElementById("citizenship").value.trim(),
    };

    // Validate required fields
    if (!profileData.firstName || !profileData.lastName) {
      showModal("Please enter your first and last name.", "error");
      return;
    }

    if (!profileData.dob) {
      showModal("Please select your date of birth.", "error");
      return;
    }

    if (!profileData.citizenship) {
      showModal("Please enter your citizenship.", "error");
      return;
    }

    // Store in localStorage for next step
    localStorage.setItem("signupProfile", JSON.stringify(profileData));

    // Store in localStorage for next step
    localStorage.setItem("signupProfile", JSON.stringify(profileData));

    // Redirect directly without popup
    window.location.href = "setup.html";
  } catch (error) {
    showModal("Error processing profile data: " + error.message, "error");
  } finally {
    // Reset loading state
    setLoadingState(false);
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Load previously saved data if any
  const savedProfile = JSON.parse(
    localStorage.getItem("signupProfile") || "{}"
  );

  if (savedProfile.firstName)
    document.getElementById("firstName").value = savedProfile.firstName;
  if (savedProfile.lastName)
    document.getElementById("lastName").value = savedProfile.lastName;
  if (savedProfile.middleName)
    document.getElementById("middleName").value = savedProfile.middleName;
  if (savedProfile.suffix)
    document.getElementById("suffix").value = savedProfile.suffix;
  if (savedProfile.motherMaidenName)
    document.getElementById("motherMaidenName").value =
      savedProfile.motherMaidenName;
  if (savedProfile.dob) document.getElementById("dob").value = savedProfile.dob;
  if (savedProfile.citizenship)
    document.getElementById("citizenship").value = savedProfile.citizenship;

  // Bind next button
  const nextBtn = document.getElementById("signup2Next");
  if (nextBtn) {
    nextBtn.addEventListener("click", processProfileData);
  }
});

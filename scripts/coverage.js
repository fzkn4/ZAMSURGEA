// coverage.js - Coverage information with async functionality

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
  const finishBtn = document.getElementById("coverageFinish");
  if (finishBtn) {
    if (isLoading) {
      finishBtn.disabled = true;
      finishBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    } else {
      finishBtn.disabled = false;
      finishBtn.innerHTML = "Finish &#8594;";
    }
  }
}

// Validation functions
function validateCoverageData(coverage) {
  if (
    !coverage.insuranceProduct ||
    coverage.insuranceProduct === "Select Product"
  ) {
    return "Please select an insurance product.";
  }

  if (!coverage.depositAmount || coverage.depositAmount <= 0) {
    return "Please enter a valid deposit amount.";
  }

  if (!coverage.optionNo || coverage.optionNo === "Select Option") {
    return "Please select an option.";
  }

  if (!coverage.effectivity) {
    return "Please select an effectivity date.";
  }

  if (!coverage.validUntil) {
    return "Please select a valid until date.";
  }

  if (!coverage.referrer || coverage.referrer.trim() === "") {
    return "Please enter who referred you.";
  }

  return null; // No validation errors
}

// Async function to handle account creation
async function processAccountCreation() {
  try {
    // Show loading state
    setLoadingState(true);

    // Collect all data
    const coverage = {
      insuranceProduct: document.getElementById("insuranceProduct").value,
      depositAmount: document.getElementById("depositAmount").value,
      optionNo: document.getElementById("optionNo").value,
      effectivity: document.getElementById("effectivity").value,
      validUntil: document.getElementById("validUntil").value,
      referrer: document.getElementById("referrer").value.trim(),
    };

    // Validate coverage data
    const validationError = validateCoverageData(coverage);
    if (validationError) {
      showModal(validationError, "error");
      return;
    }

    // Save coverage data to localStorage
    localStorage.setItem("signupCoverage", JSON.stringify(coverage));

    // Get profile and account data
    const profile = JSON.parse(localStorage.getItem("signupProfile") || "{}");
    const account = JSON.parse(localStorage.getItem("signupAccount") || "{}");

    if (!account.email || !account.password) {
      showModal("Missing email or password. Please restart signup.", "error");
      return;
    }

    // Validate referrer exists in /agents
    const agentSnap = await firebase
      .database()
      .ref("agents/" + coverage.referrer)
      .once("value");

    if (!agentSnap.exists()) {
      showModal(
        "Referrer Agent ID not found. Please check the Agent ID.",
        "error"
      );
      return;
    }

    // Increment agent's commission and numberOfInvites
    await firebase
      .database()
      .ref("agents/" + coverage.referrer)
      .transaction((agent) => {
        if (agent) {
          agent.commission = (agent.commission || 0) + 1;
          agent.numberOfInvites = (agent.numberOfInvites || 0) + 1;
        }
        return agent;
      });

    // Create user account
    const userCredential = await firebase
      .auth()
      .createUserWithEmailAndPassword(account.email, account.password);
    const user = userCredential.user;

    // Store all info in Realtime Database
    const userData = {
      ...profile,
      ...account,
      ...coverage,
      role: "client",
      createdAt: new Date().toISOString(),
    };

    await firebase
      .database()
      .ref("users/" + user.uid)
      .set(userData);

    // Store transaction in product node and /transactions
    const productMap = {
      GADDI: "gaddi",
      "GADDI PLUS": "gaddiPlus",
      GLAFI: "glafi",
    };

    const productPath = productMap[coverage.insuranceProduct];

    // Get max ID for the product
    const snapshot = await firebase.database().ref(productPath).once("value");
    let maxId = 100000;
    snapshot.forEach((child) => {
      if (/^\d+$/.test(child.key)) {
        const val = parseInt(child.key, 10);
        if (!isNaN(val) && val > maxId) maxId = val;
      }
    });

    const newId = (maxId + 1).toString();

    const productData = {
      id: newId,
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      amount: coverage.depositAmount || "",
      createdAt: new Date().toISOString(),
      option: coverage.optionNo || "",
      product: coverage.insuranceProduct,
      status: "Upcoming due",
      userId: user.uid,
    };

    const transaction = {
      id: newId,
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      product: coverage.insuranceProduct,
      option: coverage.optionNo,
      amount: coverage.depositAmount,
      date: new Date().toISOString(),
      userId: user.uid,
      email: account.email,
      effectivity: coverage.effectivity,
      validUntil: coverage.validUntil,
      referrer: coverage.referrer,
      createdAt: new Date().toISOString(),
    };

    // Create notification for the new transaction
    const notificationId = firebase.database().ref("notifications").push().key;
    const notification = {
      id: notificationId,
      type: "transaction",
      title: `New ${coverage.insuranceProduct} Transaction`,
      message: `${profile.firstName} ${profile.lastName} has applied for ${coverage.insuranceProduct} - ${coverage.optionNo} (₱${coverage.depositAmount})`,
      transactionId: newId,
      userId: user.uid,
      product: coverage.insuranceProduct,
      amount: coverage.depositAmount,
      date: new Date().toISOString(),
      isRead: false,
      deleted: false,
      forAdmins: true,
      forClient: true,
    };

    const updates = {};
    updates[productPath + "/" + newId] = productData;
    updates["transactions/" + newId] = transaction;
    updates["notifications/" + notificationId] = notification;

    await firebase.database().ref().update(updates);

    // Success - redirect to login
    showModal(
      "Account created successfully! You can now log in.",
      "success",
      function () {
        localStorage.removeItem("signupProfile");
        localStorage.removeItem("signupAccount");
        localStorage.removeItem("signupCoverage");
        window.location.href = "login2.html";
      }
    );
  } catch (error) {
    showModal("Error creating account: " + error.message, "error");
  } finally {
    // Reset loading state
    setLoadingState(false);
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Load previously saved data if any
  const coverage = JSON.parse(localStorage.getItem("signupCoverage") || "{}");

  if (coverage.insuranceProduct)
    document.getElementById("insuranceProduct").value =
      coverage.insuranceProduct;
  if (coverage.depositAmount)
    document.getElementById("depositAmount").value = coverage.depositAmount;
  if (coverage.optionNo)
    document.getElementById("optionNo").value = coverage.optionNo;
  if (coverage.effectivity)
    document.getElementById("effectivity").value = coverage.effectivity;
  if (coverage.validUntil)
    document.getElementById("validUntil").value = coverage.validUntil;
  if (coverage.referrer)
    document.getElementById("referrer").value = coverage.referrer;

  // Bind options to insurance product
  const insuranceProduct = document.getElementById("insuranceProduct");
  const optionNo = document.getElementById("optionNo");

  function updateOptions() {
    const value = insuranceProduct.value;
    optionNo.innerHTML = "";

    if (value === "GADDI") {
      optionNo.innerHTML =
        '<option value="Option 1">Option 1</option><option value="Option 2">Option 2</option>';
    } else if (value === "GADDI PLUS") {
      optionNo.innerHTML =
        '<option value="Option 1">Option 1</option><option value="Option 2">Option 2</option><option value="Option 3">Option 3</option><option value="Option 4">Option 4</option>';
    } else if (value === "GLAFI") {
      optionNo.innerHTML = '<option value="Option 1">Option 1</option>';
    } else {
      optionNo.innerHTML = "<option>Select Option</option>";
    }

    // Restore previous selection if possible
    if (coverage.optionNo) optionNo.value = coverage.optionNo;
  }

  insuranceProduct.addEventListener("change", updateOptions);
  updateOptions();

  // Auto-set validUntil to 1 year after effectivity
  const effectivity = document.getElementById("effectivity");
  const validUntil = document.getElementById("validUntil");

  effectivity.addEventListener("change", function () {
    if (effectivity.value) {
      const date = new Date(effectivity.value);
      date.setFullYear(date.getFullYear() + 1);
      // Set to one day before next year to match "valid for 1 year"
      date.setDate(date.getDate() - 1);
      validUntil.value = date.toISOString().slice(0, 10);
    }
  });

  // Bind finish button
  const finishBtn = document.getElementById("coverageFinish");
  if (finishBtn) {
    finishBtn.addEventListener("click", processAccountCreation);
  }
});

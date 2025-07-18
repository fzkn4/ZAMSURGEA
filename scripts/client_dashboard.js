// JS for client_dashboard.html

// Global variable to store current user data
let currentUserData = null;

function showSection(sectionId) {
  // Hide all content sections
  document.querySelectorAll(".content-section").forEach((sec) => {
    sec.classList.remove("active");
  });

  // Show the selected section
  document.getElementById(sectionId).classList.add("active");

  // Remove 'active' from all sidebar menu items
  document.querySelectorAll(".sidebar-menu .menu-item").forEach((item) => {
    item.classList.remove("active");
  });

  // Highlight the correct menu item
  if (sectionId === "home-section") {
    document
      .querySelector(
        ".sidebar-menu .menu-item[onclick*=\"showSection('home-section')\"]"
      )
      .classList.add("active");
    // Load user announcements when home section is shown
    loadUserAnnouncements();
  } else if (sectionId === "credentials-section") {
    document
      .querySelector(
        ".sidebar-menu .menu-item[onclick*=\"showSection('credentials-section')\"]"
      )
      .classList.add("active");
    // Load user data when credentials section is shown
    loadUserCredentials();
  } else if (sectionId === "calendar-section") {
    document
      .querySelector(
        ".sidebar-menu .menu-item[onclick*=\"showSection('calendar-section')\"]"
      )
      .classList.add("active");
  } else if (sectionId === "profile-section") {
    // No sidebar highlight for profile/settings (accessed via dropdown)
  } else if (sectionId === "settings-section") {
    // No sidebar highlight for profile/settings (accessed via dropdown)
  }
}

function toggleUserDropdown() {
  const userProfile = document.querySelector(".user-profile");
  const userDropdown = document.getElementById("userDropdown");
  if (userProfile && userDropdown) {
    userDropdown.classList.toggle("show");
    userProfile.classList.toggle("active");
  }
}

function logout() {
  // Show loading state
  const logoutBtn = event.target;
  const originalText = logoutBtn.innerHTML;
  logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
  logoutBtn.disabled = true;

  // Sign out from Firebase
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("User signed out successfully");

      // Clear any stored user data
      currentUserData = null;

      // Clear any localStorage items if you have any
      localStorage.removeItem("userData");
      localStorage.removeItem("userToken");

      // Show success message briefly before redirect
      logoutBtn.innerHTML = '<i class="fas fa-check"></i> Logged out!';
      logoutBtn.style.background = "#66bb6a";

      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = "login2.html";
      }, 1000);
    })
    .catch((error) => {
      console.error("Error signing out:", error);

      // Show error message
      logoutBtn.innerHTML =
        '<i class="fas fa-exclamation-triangle"></i> Error!';
      logoutBtn.style.background = "#ef5350";

      // Reset button after error
      setTimeout(() => {
        logoutBtn.innerHTML = originalText;
        logoutBtn.disabled = false;
        logoutBtn.style.background = "";
      }, 2000);

      // Still redirect to login page even if there's an error
      setTimeout(() => {
        window.location.href = "login2.html";
      }, 3000);
    });
}

// Function to fetch current user data from Firebase
async function fetchCurrentUserData() {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      console.log("No user logged in");
      return null;
    }

    // Fetch user data from /users path using email as identifier
    const usersRef = firebase.database().ref("users");
    const snapshot = await usersRef
      .orderByChild("email")
      .equalTo(user.email)
      .once("value");

    if (snapshot.exists()) {
      const userData = Object.values(snapshot.val())[0];
      currentUserData = userData;
      return userData;
    } else {
      console.log("User data not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

// Function to load and display user credentials
async function loadUserCredentials() {
  const userData = await fetchCurrentUserData();

  if (!userData) {
    // Show error message
    document.getElementById("personal-info").innerHTML =
      '<p style="color: #e53935;">Failed to load user data</p>';
    document.getElementById("insurance-info").innerHTML =
      '<p style="color: #e53935;">Failed to load insurance data</p>';
    document.getElementById("account-status").innerHTML =
      '<p style="color: #e53935;">Failed to load account data</p>';
    return;
  }

  // Update Personal Information
  const fullName = `${userData.firstName || ""} ${userData.middleName || ""} ${
    userData.lastName || ""
  } ${userData.suffix || ""}`.trim();
  document.getElementById("user-full-name").textContent =
    fullName || "Not provided";
  document.getElementById("user-email").textContent =
    userData.email || "Not provided";
  document.getElementById("user-phone").textContent =
    userData.phone || "Not provided";
  document.getElementById("user-dob").textContent = userData.dob
    ? formatDate(userData.dob)
    : "Not provided";
  document.getElementById("user-mother-name").textContent =
    userData.motherMaidenName || "Not provided";

  // Update Insurance Information
  document.getElementById("user-insurance-product").textContent =
    userData.insuranceProduct || "Not provided";
  document.getElementById("user-option").textContent =
    userData.optionNo || "Not provided";
  document.getElementById("user-deposit").textContent = userData.depositAmount
    ? `₱${userData.depositAmount}`
    : "Not provided";
  document.getElementById("user-effectivity").textContent = userData.effectivity
    ? formatDate(userData.effectivity)
    : "Not provided";
  document.getElementById("user-valid-until").textContent = userData.validUntil
    ? formatDate(userData.validUntil)
    : "Not provided";

  // Update Account Status
  document.getElementById("user-status").textContent =
    userData.role === "client" ? "Active" : userData.role || "Active";
  document.getElementById("user-created").textContent = userData.createdAt
    ? formatDate(userData.createdAt)
    : "Not provided";
  document.getElementById("user-referrer").textContent =
    userData.referrer || "Not provided";
  document.getElementById("user-last-login").textContent = "Today";
}

// Function to update sidebar user profile
async function updateSidebarUserProfile() {
  const userData = await fetchCurrentUserData();

  if (userData) {
    const fullName = `${userData.firstName || ""} ${
      userData.lastName || ""
    }`.trim();
    const userInfoSpan = document.querySelector(
      ".user-profile .user-info span"
    );
    if (userInfoSpan) {
      userInfoSpan.textContent = fullName || "User";
    }
  }
}

// Helper function to format dates
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return dateString;
  }
}

// Announcement filtering function
function filterAnnouncements(filterType) {
  const announcements = document.querySelectorAll(".announcement-item");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const noAnnouncements = document.getElementById("noAnnouncements");

  // Update active filter button
  filterButtons.forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");

  let visibleCount = 0;

  announcements.forEach((announcement) => {
    let shouldShow = false;

    switch (filterType) {
      case "all":
        shouldShow = true;
        break;
      case "due":
        shouldShow = announcement.classList.contains("due-soon");
        break;
      case "overdue":
        shouldShow = announcement.classList.contains("overdue");
        break;
      case "payment":
        shouldShow = announcement.classList.contains("payment-success");
        break;
    }

    if (shouldShow) {
      announcement.style.display = "flex";
      visibleCount++;
    } else {
      announcement.style.display = "none";
    }
  });

  // Show/hide no announcements message
  if (visibleCount === 0) {
    noAnnouncements.style.display = "block";
  } else {
    noAnnouncements.style.display = "none";
  }
}

// Function to load user-specific announcements
async function loadUserAnnouncements() {
  const userData = await fetchCurrentUserData();

  if (userData) {
    // You can customize announcements based on user data
    // For example, show announcements based on their insurance product, due dates, etc.
    console.log("Loading announcements for user:", userData.email);

    // Example: Update announcement content based on user's insurance product
    const insuranceProduct = userData.insuranceProduct;
    const validUntil = userData.validUntil;

    // You can dynamically update announcement content here
    // based on the user's actual data
  }
}

// Sidebar user profile dropdown logic
document.addEventListener("DOMContentLoaded", function () {
  // Check authentication state first
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in
      console.log("User is signed in:", user.email);

      // Initialize dashboard functionality
      initializeDashboard(user);
    } else {
      // User is signed out - redirect to login
      console.log("User is not authenticated, redirecting to login");
      window.location.href = "login2.html";
    }
  });
});

// Function to initialize dashboard functionality
function initializeDashboard(user) {
  const userProfile = document.querySelector(".user-profile");
  const userDropdown = document.getElementById("userDropdown");

  if (userProfile && userDropdown) {
    // Hide dropdown when clicking outside
    document.addEventListener("click", function (e) {
      if (userDropdown.classList.contains("show")) {
        userDropdown.classList.remove("show");
        userProfile.classList.remove("active");
      }
    });

    // Prevent dropdown from closing when clicking inside
    userDropdown.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  // Load user data
  updateSidebarUserProfile();

  // If credentials section is currently active, load the data
  if (
    document.getElementById("credentials-section").classList.contains("active")
  ) {
    loadUserCredentials();
  }

  // If home section is currently active, load announcements
  if (document.getElementById("home-section").classList.contains("active")) {
    loadUserAnnouncements();
  }
}

// JS for client_dashboard.html

// Global variable to store current user data
let currentUserData = null;
let currentUserId = null; // Store current user ID for notifications
let clientNotificationsListener = null; // Store listener reference for cleanup

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
    // Load user announcements and notifications when home section is shown
    loadUserAnnouncements();
    loadClientNotifications();
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

function logout() {
  // Clean up notification listeners
  if (clientNotificationsListener) {
    firebase
      .database()
      .ref("notifications")
      .off("value", clientNotificationsListener);
    clientNotificationsListener = null;
  }

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

// Replace the logout icon's onclick to show the modal
// In HTML: <i class="fi fi-br-arrow-left-from-arc" onclick="showLogoutModal()"></i>

function showLogoutModal() {
  const modal = document.getElementById("logoutModal");
  if (modal) modal.style.display = "flex";
}

function hideLogoutModal() {
  const modal = document.getElementById("logoutModal");
  if (modal) modal.style.display = "none";
}

// Attach modal button events after DOM is loaded
window.addEventListener("DOMContentLoaded", function () {
  const confirmBtn = document.getElementById("confirmLogoutBtn");
  const cancelBtn = document.getElementById("cancelLogoutBtn");
  if (confirmBtn)
    confirmBtn.onclick = function () {
      hideLogoutModal();
      logout();
    };
  if (cancelBtn) cancelBtn.onclick = hideLogoutModal;
});

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
        // Check for both static and dynamic due-soon classes
        shouldShow =
          announcement.classList.contains("due-soon") ||
          announcement.classList.contains("new-transaction");
        break;
      case "overdue":
        // Check for both static and dynamic overdue classes
        shouldShow =
          announcement.classList.contains("overdue") ||
          announcement.classList.contains("due-soon");
        break;
      case "payment":
        // Check for both static and dynamic payment classes
        shouldShow =
          announcement.classList.contains("payment-success") ||
          announcement.classList.contains("renewal-notice");
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

// Dynamic Notification System for Client Dashboard

// Function to load client notifications
async function loadClientNotifications() {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      console.log("No user logged in, cannot load notifications");
      return;
    }

    // Clean up existing listener if any
    if (clientNotificationsListener) {
      firebase
        .database()
        .ref("notifications")
        .off("value", clientNotificationsListener);
      clientNotificationsListener = null;
    }

    currentUserId = user.uid;
    console.log("Loading notifications for user:", user.uid);

    // Set up real-time listener for notifications
    const notificationsRef = firebase.database().ref("notifications");

    clientNotificationsListener = (snapshot) => {
      try {
        const notifications = [];
        snapshot.forEach((child) => {
          const notification = child.val();
          if (
            notification &&
            notification.userId === currentUserId &&
            !notification.deleted
          ) {
            // Clients only see their own non-deleted notifications
            notifications.push(notification);
          }
        });

        // Sort by date (newest first)
        notifications.sort((a, b) => new Date(b.date) - new Date(a.date));

        console.log(`Found ${notifications.length} notifications for client`);

        // Display notifications in announcements section
        displayClientNotifications(notifications);
      } catch (error) {
        console.error("Error processing notifications:", error);
        // Fallback to static announcements if dynamic notifications fail
        showStaticAnnouncements();
      }
    };

    notificationsRef.on("value", clientNotificationsListener);
  } catch (error) {
    console.error("Error loading client notifications:", error);
    // Fallback to static announcements if dynamic notifications fail
    showStaticAnnouncements();
  }
}

// Fallback function to show static announcements
function showStaticAnnouncements() {
  console.log("Showing static announcements as fallback");
  const announcementsList = document.getElementById("announcementsList");
  if (!announcementsList) return;

  // Keep the original static announcements in the HTML
  // This ensures the dashboard doesn't appear broken
}

// Function to display client notifications in announcements
function displayClientNotifications(notifications) {
  try {
    const announcementsList = document.getElementById("announcementsList");
    if (!announcementsList) {
      console.error("Announcements list element not found");
      return;
    }

    if (notifications.length === 0) {
      announcementsList.innerHTML = `
        <div class="announcement-item no-notifications">
          <div class="announcement-icon">
            <i class="fas fa-info-circle"></i>
          </div>
          <div class="announcement-content">
            <h4>No Notifications</h4>
            <p>You don't have any notifications at the moment.</p>
          </div>
        </div>
      `;
      return;
    }

    console.log(`Displaying ${notifications.length} notifications`);

    announcementsList.innerHTML = notifications
      .map((notification) => {
        const iconClass = getNotificationIcon(notification.type);
        const typeClass = getNotificationTypeClass(notification.type);

        return `
        <div class="announcement-item ${typeClass} ${
          notification.isRead ? "read" : "unread"
        }" data-id="${notification.id}">
          <div class="announcement-icon">
            <i class="${iconClass}"></i>
          </div>
          <div class="announcement-content">
            <h4>${notification.title}</h4>
            <p>${notification.message}</p>
            <div class="announcement-meta">
              <span class="announcement-date">${formatNotificationTime(
                notification.date
              )}</span>
              <span class="announcement-type ${typeClass}">${
          notification.type
        }</span>
            </div>
          </div>
        </div>
      `;
      })
      .join("");

    // Add click handlers to mark notifications as read
    document.querySelectorAll(".announcement-item").forEach((item) => {
      item.addEventListener("click", function () {
        const notificationId = this.getAttribute("data-id");
        if (notificationId) {
          markClientNotificationAsRead(notificationId);
        }
      });
    });
  } catch (error) {
    console.error("Error displaying client notifications:", error);
  }
}

// Function to get notification icon based on type
function getNotificationIcon(type) {
  switch (type) {
    case "transaction":
      return "fas fa-file-contract";
    case "renewal":
      return "fas fa-calendar-check";
    case "payment":
      return "fas fa-check-circle";
    case "overdue":
      return "fas fa-exclamation-triangle";
    default:
      return "fas fa-bell";
  }
}

// Function to get notification type class for styling
function getNotificationTypeClass(type) {
  switch (type) {
    case "transaction":
      return "new-transaction";
    case "renewal":
      return "renewal-notice";
    case "payment":
      return "payment-success";
    case "overdue":
      return "due-soon";
    default:
      return "general";
  }
}

// Function to format notification time
function formatNotificationTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`;
  } else if (diffInHours < 48) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString();
  }
}

// Function to mark notification as read
async function markClientNotificationAsRead(notificationId) {
  try {
    await firebase
      .database()
      .ref(`notifications/${notificationId}/isRead`)
      .set(true);
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
}

// Function to delete notification (mark as deleted instead of removing)
async function deleteClientNotification(notificationId) {
  try {
    await firebase
      .database()
      .ref(`notifications/${notificationId}/deleted`)
      .set(true);
  } catch (error) {
    console.error("Error deleting notification:", error);
  }
}

// Function to clean up duplicate notifications for client
async function cleanupClientDuplicateNotifications() {
  try {
    const user = firebase.auth().currentUser;
    if (!user) return;

    const notificationsSnapshot = await firebase
      .database()
      .ref("notifications")
      .orderByChild("userId")
      .equalTo(user.uid)
      .once("value");

    const transactionGroups = {};
    const updates = {};

    // Group notifications by transactionId for this user
    notificationsSnapshot.forEach((child) => {
      const notification = child.val();
      if (notification && notification.transactionId && !notification.deleted) {
        if (!transactionGroups[notification.transactionId]) {
          transactionGroups[notification.transactionId] = [];
        }
        transactionGroups[notification.transactionId].push({
          id: child.key,
          ...notification,
        });
      }
    });

    // For each transactionId, keep only the first transaction notification and mark others as deleted
    Object.keys(transactionGroups).forEach((transactionId) => {
      const notifications = transactionGroups[transactionId];
      const transactionNotifications = notifications.filter(
        (n) => n.type === "transaction"
      );

      if (transactionNotifications.length > 1) {
        // Keep the first one, mark the rest as deleted
        const toDelete = transactionNotifications.slice(1);
        toDelete.forEach((notification) => {
          updates[`notifications/${notification.id}/deleted`] = true;
        });
        console.log(
          `Marked ${toDelete.length} duplicate transaction notifications as deleted for client transactionId: ${transactionId}`
        );
      }
    });

    // Apply updates if any
    if (Object.keys(updates).length > 0) {
      await firebase.database().ref().update(updates);
      console.log(
        "Client cleanup completed: Duplicate notifications marked as deleted"
      );
    }
  } catch (error) {
    console.error("Error cleaning up duplicate notifications:", error);
  }
}

// Sidebar user profile dropdown logic
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded - Initializing client dashboard");

  // Check if Firebase is available
  if (typeof firebase === "undefined") {
    console.error("Firebase is not loaded. Please check script loading order.");
    return;
  }

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

// Clean up listeners when page is unloaded
window.addEventListener("beforeunload", function () {
  // Clean up notification listeners
  if (clientNotificationsListener) {
    firebase
      .database()
      .ref("notifications")
      .off("value", clientNotificationsListener);
    clientNotificationsListener = null;
  }
});

// Function to initialize dashboard functionality
function initializeDashboard(user) {
  console.log("Initializing client dashboard for user:", user.email);

  // Load user data
  updateSidebarUserProfile();

  // Clean up any existing duplicate notifications first
  cleanupClientDuplicateNotifications()
    .then(() => {
      console.log("Cleanup completed, loading notifications");
      // Initialize client notification system
      loadClientNotifications();
    })
    .catch((error) => {
      console.error("Error during cleanup:", error);
      // Still try to load notifications even if cleanup fails
      loadClientNotifications();
    });

  // If credentials section is currently active, load the data
  if (
    document.getElementById("credentials-section").classList.contains("active")
  ) {
    console.log("Credentials section is active, loading user data");
    loadUserCredentials();
  }

  // If home section is currently active, load announcements and notifications
  if (document.getElementById("home-section").classList.contains("active")) {
    console.log(
      "Home section is active, loading announcements and notifications"
    );
    loadUserAnnouncements();
    loadClientNotifications();
  }
}

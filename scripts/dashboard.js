// Dashboard page JavaScript (moved from dashboard.html)

// Ensure Firebase is available
if (typeof firebase === "undefined") {
  alert(
    "Firebase SDK not loaded. Please ensure the Firebase CDN script is included in your HTML."
  );
}
if (
  typeof firebase !== "undefined" &&
  typeof firebase.firestore === "undefined"
) {
  alert(
    "Firebase Firestore SDK not loaded. Please ensure you have included the Firestore SDK."
  );
}

// Toggle user dropdown
function toggleUserDropdown() {
  document.getElementById("userDropdown").classList.toggle("show");
}

// Close dropdown when clicking outside
window.onclick = function (event) {
  if (
    !event.target.matches(".dropdown-icon") &&
    !event.target.closest(".user-dropdown")
  ) {
    const dropdowns = document.getElementsByClassName("user-dropdown");
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

function logout() {
  // Optionally clear session or local storage here
  // sessionStorage.clear(); localStorage.clear();
  window.location.href = "login2.html";
}

function toggleSubmenu(id) {
  document.getElementById(id).classList.toggle("active");
}

function showSection(sectionId) {
  // Hide all content sections
  document
    .querySelectorAll(".content-section")
    .forEach((sec) => sec.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");
  document.querySelector(".content").scrollTop = 0;

  // Remove 'active' from all sidebar menu items
  document
    .querySelectorAll(".sidebar-menu .menu-item")
    .forEach((item) => item.classList.remove("active"));
  // Remove 'active' from all submenu <p>
  document
    .querySelectorAll(".sidebar-menu .submenu p")
    .forEach((item) => item.classList.remove("active"));

  // Highlight the correct menu item or submenu item
  if (sectionId === "home-section") {
    document
      .querySelector(
        ".sidebar-menu .menu-item[onclick*=\"showSection('home-section')\"]"
      )
      .classList.add("active");
  } else if (sectionId === "commission-section") {
    document
      .querySelector(
        ".sidebar-menu .menu-item[onclick*=\"showSection('commission-section')\"]"
      )
      .classList.add("active");
  } else if (sectionId === "collection-section") {
    document
      .querySelector(
        ".sidebar-menu .menu-item[onclick*=\"showSection('collection-section')\"]"
      )
      .classList.add("active");
  } else if (sectionId === "notification-section") {
    document
      .querySelector(
        ".sidebar-menu .menu-item[onclick*=\"showSection('notification-section')\"]"
      )
      .classList.add("active");
  } else if (sectionId === "profile-section") {
    // No sidebar highlight for profile/settings
  } else if (sectionId === "settings-section") {
    // No sidebar highlight for profile/settings
  } else if (sectionId === "gaddi-section") {
    document
      .querySelector(
        ".sidebar-menu .submenu p[onclick*=\"showSection('gaddi-section')\"]"
      )
      .classList.add("active");
    document
      .querySelector(
        ".sidebar-menu .menu-item[onclick*=\"toggleSubmenu('microInsurance')\"]"
      )
      .classList.add("active");
  } else if (sectionId === "gaddi-plus-section") {
    document
      .querySelector(
        ".sidebar-menu .submenu p[onclick*=\"showSection('gaddi-plus-section')\"]"
      )
      .classList.add("active");
    document
      .querySelector(
        ".sidebar-menu .menu-item[onclick*=\"toggleSubmenu('microInsurance')\"]"
      )
      .classList.add("active");
  } else if (sectionId === "glafi-section") {
    document
      .querySelector(
        ".sidebar-menu .submenu p[onclick*=\"showSection('glafi-section')\"]"
      )
      .classList.add("active");
    document
      .querySelector(
        ".sidebar-menu .menu-item[onclick*=\"toggleSubmenu('microInsurance')\"]"
      )
      .classList.add("active");
  }
}

function toggleDropdown(statusType, headerEl, tableBodyId = "gaddiTableBody") {
  // Determine dropdown id based on section
  let ddId = "dropdown-" + statusType;
  if (tableBodyId === "gaddiPlusTableBody") ddId += "-plus";
  if (tableBodyId === "glafiTableBody") ddId += "-glafi";
  const dd = document.getElementById(ddId);
  // close others
  document.querySelectorAll(".dropdown-list").forEach((d) => {
    if (d !== dd) d.style.display = "none";
  });
  document
    .querySelectorAll(".section-header")
    .forEach((h) => h.classList.remove("open"));

  const open = dd.style.display === "block";
  dd.style.display = open ? "none" : "block";
  headerEl.classList.toggle("open", !open);

  // populate list
  dd.innerHTML = "";
  document.querySelectorAll(`#${tableBodyId} tr`).forEach((row) => {
    const name = row.querySelector("td:nth-child(2)").textContent;
    const st = row.querySelector(".status").textContent.toLowerCase().trim();
    if (
      (statusType === "upcoming" && st.includes("upcoming")) ||
      (statusType === "overdue" && st.includes("overdue"))
    ) {
      const li = document.createElement("li");
      li.textContent = name;
      dd.appendChild(li);
    }
  });
}

// Sample transaction data with 10 entries
const transactionData = {
  weekly: [
    {
      id: 1001,
      lastName: "Dela Cruz",
      firstName: "Juan",
      product: "GADDI",
      option: "Option 1",
      payment: "₱399",
      date: "2023-10-15",
    },
    {
      id: 1002,
      lastName: "Santos",
      firstName: "Maria",
      product: "GADDI Plus",
      option: "Option 2",
      payment: "₱699",
      date: "2023-10-16",
    },
    {
      id: 1003,
      lastName: "Reyes",
      firstName: "Pedro",
      product: "GLAFI",
      option: "Option 1",
      payment: "₱599",
      date: "2023-10-17",
    },
    {
      id: 1004,
      lastName: "Gonzales",
      firstName: "Ana",
      product: "GADDI",
      option: "Option 1",
      payment: "₱399",
      date: "2023-10-18",
    },
    {
      id: 1005,
      lastName: "Lim",
      firstName: "Michael",
      product: "GADDI Plus",
      option: "Option 3",
      payment: "₱999",
      date: "2023-10-19",
    },
    {
      id: 1006,
      lastName: "Tan",
      firstName: "Robert",
      product: "GLAFI",
      option: "Option 2",
      payment: "₱799",
      date: "2023-10-20",
    },
    {
      id: 1007,
      lastName: "Chen",
      firstName: "Lisa",
      product: "GADDI Plus",
      option: "Option 1",
      payment: "₱699",
      date: "2023-10-21",
    },
    {
      id: 1008,
      lastName: "Wong",
      firstName: "James",
      product: "GADDI",
      option: "Option 2",
      payment: "₱499",
      date: "2023-10-22",
    },
    {
      id: 1009,
      lastName: "Torres",
      firstName: "Angela",
      product: "GLAFI",
      option: "Option 3",
      payment: "₱899",
      date: "2023-10-23",
    },
    {
      id: 1010,
      lastName: "Rivera",
      firstName: "Carlos",
      product: "GADDI Plus",
      option: "Option 2",
      payment: "₱699",
      date: "2023-10-24",
    },
  ],
  monthly: [
    {
      id: 1001,
      lastName: "Dela Cruz",
      firstName: "Juan",
      product: "GADDI",
      option: "Option 1",
      payment: "₱399",
      date: "2023-10-01",
    },
    {
      id: 1004,
      lastName: "Gonzales",
      firstName: "Ana",
      product: "GADDI",
      option: "Option 1",
      payment: "₱399",
      date: "2023-10-05",
    },
    {
      id: 1005,
      lastName: "Lim",
      firstName: "Michael",
      product: "GADDI Plus",
      option: "Option 3",
      payment: "₱999",
      date: "2023-10-12",
    },
    {
      id: 1002,
      lastName: "Santos",
      firstName: "Maria",
      product: "GADDI Plus",
      option: "Option 2",
      payment: "₱699",
      date: "2023-10-16",
    },
    {
      id: 1003,
      lastName: "Reyes",
      firstName: "Pedro",
      product: "GLAFI",
      option: "Option 1",
      payment: "₱599",
      date: "2023-10-17",
    },
    {
      id: 1006,
      lastName: "Tan",
      firstName: "Robert",
      product: "GLAFI",
      option: "Option 2",
      payment: "₱799",
      date: "2023-10-20",
    },
    {
      id: 1007,
      lastName: "Chen",
      firstName: "Lisa",
      product: "GADDI Plus",
      option: "Option 1",
      payment: "₱699",
      date: "2023-10-21",
    },
    {
      id: 1008,
      lastName: "Wong",
      firstName: "James",
      product: "GADDI",
      option: "Option 2",
      payment: "₱499",
      date: "2023-10-22",
    },
    {
      id: 1009,
      lastName: "Torres",
      firstName: "Angela",
      product: "GLAFI",
      option: "Option 3",
      payment: "₱899",
      date: "2023-10-23",
    },
    {
      id: 1010,
      lastName: "Rivera",
      firstName: "Carlos",
      product: "GADDI Plus",
      option: "Option 2",
      payment: "₱699",
      date: "2023-10-24",
    },
  ],
  quarterly: [
    {
      id: 1001,
      lastName: "Dela Cruz",
      firstName: "Juan",
      product: "GADDI",
      option: "Option 1",
      payment: "₱399",
      date: "2023-08-15",
    },
    {
      id: 1006,
      lastName: "Tan",
      firstName: "Robert",
      product: "GLAFI",
      option: "Option 2",
      payment: "₱799",
      date: "2023-09-02",
    },
    {
      id: 1007,
      lastName: "Chen",
      firstName: "Lisa",
      product: "GADDI Plus",
      option: "Option 1",
      payment: "₱699",
      date: "2023-09-18",
    },
    {
      id: 1003,
      lastName: "Reyes",
      firstName: "Pedro",
      product: "GLAFI",
      option: "Option 1",
      payment: "₱599",
      date: "2023-10-17",
    },
    {
      id: 1008,
      lastName: "Wong",
      firstName: "James",
      product: "GADDI",
      option: "Option 2",
      payment: "₱499",
      date: "2023-10-20",
    },
    {
      id: 1002,
      lastName: "Santos",
      firstName: "Maria",
      product: "GADDI Plus",
      option: "Option 2",
      payment: "₱699",
      date: "2023-10-16",
    },
    {
      id: 1004,
      lastName: "Gonzales",
      firstName: "Ana",
      product: "GADDI",
      option: "Option 1",
      payment: "₱399",
      date: "2023-10-05",
    },
    {
      id: 1005,
      lastName: "Lim",
      firstName: "Michael",
      product: "GADDI Plus",
      option: "Option 3",
      payment: "₱999",
      date: "2023-10-12",
    },
    {
      id: 1009,
      lastName: "Torres",
      firstName: "Angela",
      product: "GLAFI",
      option: "Option 3",
      payment: "₱899",
      date: "2023-10-23",
    },
    {
      id: 1010,
      lastName: "Rivera",
      firstName: "Carlos",
      product: "GADDI Plus",
      option: "Option 2",
      payment: "₱699",
      date: "2023-10-24",
    },
  ],
};

// Chart data for different periods
const chartData = {
  weekly: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [5, 8, 6, 9, 12, 4, 2],
  },
  monthly: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    data: [15, 22, 18, 12],
  },
  quarterly: {
    labels: ["Month 1", "Month 2", "Month 3"],
    data: [45, 68, 52],
  },
};

// Initialize charts
let transactionsChart;
let revenueChart;

function initializeCharts() {
  const revenueCtx = document.getElementById("revenueChart").getContext("2d");
  window.revenueChart = new Chart(revenueCtx, {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Revenue (₱)",
          data: [12000, 19000, 15000, 20000, 18000, 22000],
          backgroundColor: "rgba(54, 162, 235, 0.7)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: chartOptions("₱"),
  });

  const transactionsCtx = document
    .getElementById("transactionsChart")
    .getContext("2d");
  window.transactionsChart = new Chart(transactionsCtx, {
    type: "bar",
    data: getChartData("weekly"),
    options: chartOptions(""),
  });
}

function chartOptions(prefix) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return prefix ? prefix + value.toLocaleString() : value;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
}

function getChartData(period) {
  // Use the new color scheme for transactions bar chart
  // We'll use: Overdue: #ef5350, Upcoming: #ffb74d, Inactive: #90a4ae, Renewal: #66bb6a
  // For demo, cycle through these colors for each bar
  const barColors = [
    "#ef5350",
    "#ffb74d",
    "#90a4ae",
    "#66bb6a",
    "#ef5350",
    "#ffb74d",
    "#90a4ae",
  ];
  return {
    labels: chartData[period].labels,
    datasets: [
      {
        label: "Transactions",
        data: chartData[period].data,
        backgroundColor: barColors.slice(0, chartData[period].data.length),
        borderColor: barColors.slice(0, chartData[period].data.length),
        borderWidth: 1,
      },
    ],
  };
}

function populateTable(period) {
  const tableBody = document.querySelector(".gdash-table tbody");
  tableBody.innerHTML = "";

  transactionData[period].forEach((transaction) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${transaction.id}</td>
    <td>${transaction.lastName}</td>
    <td>${transaction.firstName}</td>
    <td>${transaction.product}</td>
    <td>${transaction.option}</td>
    <td>${transaction.payment}</td>
    <td>${transaction.date}</td>
  `;
    tableBody.appendChild(row);
  });
}

// Notification functionality
function deleteNotification(id) {
  const notification = document.querySelector(
    `.notification-item[data-id="${id}"]`
  );
  if (notification) {
    notification.style.opacity = "0";
    setTimeout(() => {
      notification.remove();
      updateNotificationCount();
    }, 300);
  }
}

function deleteSelectedNotifications() {
  const checkboxes = document.querySelectorAll(
    ".notification-checkbox:checked"
  );
  checkboxes.forEach((checkbox) => {
    const notification = checkbox.closest(".notification-item");
    if (notification) {
      const id = notification.getAttribute("data-id");
      deleteNotification(id);
    }
  });
}

function markAllAsRead() {
  document.querySelectorAll(".notification-checkbox").forEach((checkbox) => {
    checkbox.checked = true;
  });
}

function updateNotificationCount() {
  const count = document.querySelectorAll(".notification-item").length;
  document.querySelector(".badge").textContent = count;
  // Update sidebar notification bubble
  const sidebarBadge = document.querySelector(".sidebar-badge");
  if (sidebarBadge) sidebarBadge.textContent = count;
}

// Modal logic for Add, Update, Print (GADDI, GADDI Plus, GLAFI)
function openModal(type, btn) {
  const modal = document.getElementById("gaddiModal");
  const title = document.getElementById("modalTitle");
  const body = document.getElementById("modalBody");

  // Determine section context
  let section = btn.closest(".content-section");
  let sectionTitle =
    section?.querySelector(".title")?.textContent?.trim() || "";
  let sectionId = section?.id || "";

  // Set modal title and body based on type
  if (type === "add") {
    // GADDI-specific form
    if (sectionId === "gaddi-section") {
      // Always fetch the highest ID from the database each time the modal opens
      title.textContent = `Add Entry - ${sectionTitle}`;
      body.innerHTML = `<form id='addForm'>
        <label>ID No.: <input type='text' name='id' id='gaddiIdInput' readonly></label>
        <label>First Name: <input type='text' name='firstName' id='gaddiFirstNameInput' required></label>
        <label>Last Name: <input type='text' name='lastName' id='gaddiLastNameInput' required></label>
        <label>Product Name: <input type='text' name='product' value='GADDI' readonly></label>
        <label>Option #:
          <select name='option' id='gaddiOptionSelect'>
            <option value='Option 1'>Option 1</option>
            <option value='Option 2'>Option 2</option>
          </select>
        </label>
        <label>Amount: <input type='number' name='amount' id='gaddiAmountInput' value='230' readonly required></label>
        <label>Status: <select name='status'><option>Upcoming due</option><option>Overdue</option><option>Renewed</option></select></label>
        <button type='submit'>Add</button>
      </form>`;
      setTimeout(async () => {
        let newId = 100000;
        try {
          const snapshot = await firebase.database().ref("gaddi").once("value");
          let maxId = 100000;
          let foundKeys = [];
          let allKeys = [];
          snapshot.forEach((child) => {
            allKeys.push(child.key);
            // Only consider keys that are all digits
            if (/^\d+$/.test(child.key)) {
              const val = parseInt(child.key, 10);
              foundKeys.push(val);
              if (!isNaN(val) && val > maxId) maxId = val;
            }
          });
          newId = maxId + 1;
        } catch (err) {
          newId = 100001;
        }
        document.getElementById("gaddiIdInput").value = newId;
        // Option price logic
        const optionSelect = document.getElementById("gaddiOptionSelect");
        const amountInput = document.getElementById("gaddiAmountInput");
        optionSelect.onchange = function () {
          amountInput.value = this.value === "Option 1" ? 230 : 460;
        };
        // Wait for auth state to be ready before enabling form submission
        firebase.auth().onAuthStateChanged(function (user) {
          document.getElementById("addForm").onsubmit = async function (e) {
            e.preventDefault();
            if (!user) {
              showGaddiAddModal(
                "You must be logged in to add a GADDI entry.",
                false
              );
              return;
            }
            const form = e.target;
            const id = form.id.value;
            const firstName = form.firstName.value;
            const lastName = form.lastName.value;
            const product = form.product.value;
            const option = form.option.value;
            const amount = form.amount.value;
            const status = form.status.value;
            // Store in Firebase Realtime Database
            try {
              await firebase
                .database()
                .ref("gaddi/" + id)
                .set({
                  id,
                  firstName,
                  lastName,
                  product,
                  option,
                  amount,
                  status,
                  createdAt: new Date().toISOString(),
                  userId: user.uid,
                });
              closeModal();
              showGaddiAddModal("GADDI entry added successfully!", true);
            } catch (err) {
              showGaddiAddModal(
                "Failed to save to Firebase Realtime Database: " + err.message,
                false
              );
            }
          };
        });
      }, 0);
    } else if (sectionId === "gaddi-plus-section") {
      // GADDI Plus-specific form
      title.textContent = `Add Entry - ${sectionTitle}`;
      body.innerHTML = `<form id='addForm'>
        <label>ID No.: <input type='text' name='id' id='gaddiPlusIdInput' readonly></label>
        <label>First Name: <input type='text' name='firstName' id='gaddiPlusFirstNameInput' required></label>
        <label>Last Name: <input type='text' name='lastName' id='gaddiPlusLastNameInput' required></label>
        <label>Product Name: <input type='text' name='product' value='GADDI PLUS' readonly></label>
        <label>Option #:
          <select name='option' id='gaddiPlusOptionSelect'>
            <option value='Option 1'>Option 1</option>
            <option value='Option 2'>Option 2</option>
            <option value='Option 3'>Option 3</option>
            <option value='Option 4'>Option 4</option>
          </select>
        </label>
        <label>Amount: <input type='number' name='amount' id='gaddiPlusAmountInput' value='250' readonly required></label>
        <label>Status: <select name='status'><option>Upcoming due</option><option>Overdue</option><option>Renewed</option></select></label>
        <button type='submit'>Add</button>
      </form>`;
      setTimeout(async () => {
        let newId = 200000;
        try {
          const snapshot = await firebase
            .database()
            .ref("gaddiPlus")
            .once("value");
          let maxId = 200000;
          snapshot.forEach((child) => {
            if (/^\d+$/.test(child.key)) {
              const val = parseInt(child.key, 10);
              if (!isNaN(val) && val > maxId) maxId = val;
            }
          });
          newId = maxId + 1;
        } catch (err) {
          newId = 200001;
        }
        document.getElementById("gaddiPlusIdInput").value = newId;
        // Option price logic for GADDI Plus
        const optionSelect = document.getElementById("gaddiPlusOptionSelect");
        const amountInput = document.getElementById("gaddiPlusAmountInput");
        optionSelect.onchange = function () {
          if (this.value === "Option 1") amountInput.value = 250;
          else if (this.value === "Option 2") amountInput.value = 500;
          else if (this.value === "Option 3") amountInput.value = 800;
          else if (this.value === "Option 4") amountInput.value = 1000;
        };
        // Wait for auth state to be ready before enabling form submission
        firebase.auth().onAuthStateChanged(function (user) {
          document.getElementById("addForm").onsubmit = async function (e) {
            e.preventDefault();
            if (!user) {
              showGaddiAddModal(
                "You must be logged in to add a GADDI Plus entry.",
                false
              );
              return;
            }
            const form = e.target;
            const id = form.id.value;
            const firstName = form.firstName.value;
            const lastName = form.lastName.value;
            const product = form.product.value;
            const option = form.option.value;
            const amount = form.amount.value;
            const status = form.status.value;
            // Store in Firebase Realtime Database
            try {
              await firebase
                .database()
                .ref("gaddiPlus/" + id)
                .set({
                  id,
                  firstName,
                  lastName,
                  product,
                  option,
                  amount,
                  status,
                  createdAt: new Date().toISOString(),
                  userId: user.uid,
                });
              closeModal();
              showGaddiAddModal("GADDI Plus entry added successfully!", true);
            } catch (err) {
              showGaddiAddModal(
                "Failed to save to Firebase Realtime Database: " + err.message,
                false
              );
            }
          };
        });
      }, 0);
    } else if (sectionId === "glafi-section") {
      // GLAFI-specific form
      title.textContent = `Add Entry - ${sectionTitle}`;
      body.innerHTML = `<form id='addForm'>
        <label>ID No.: <input type='text' name='id' id='glafiIdInput' readonly></label>
        <label>First Name: <input type='text' name='firstName' id='glafiFirstNameInput' required></label>
        <label>Last Name: <input type='text' name='lastName' id='glafiLastNameInput' required></label>
        <label>Product Name: <input type='text' name='product' value='GLAFI' readonly></label>
        <label>Option #:
          <select name='option' id='glafiOptionSelect'>
            <option value='Option 1'>Option 1</option>
          </select>
        </label>
        <label>Amount: <input type='number' name='amount' id='glafiAmountInput' value='500' readonly required></label>
        <label>Status: <select name='status'><option>Upcoming due</option><option>Overdue</option><option>Renewed</option></select></label>
        <button type='submit'>Add</button>
      </form>`;
      setTimeout(async () => {
        let newId = 300000;
        try {
          const snapshot = await firebase.database().ref("glafi").once("value");
          let maxId = 300000;
          snapshot.forEach((child) => {
            if (/^\d+$/.test(child.key)) {
              const val = parseInt(child.key, 10);
              if (!isNaN(val) && val > maxId) maxId = val;
            }
          });
          newId = maxId + 1;
        } catch (err) {
          newId = 300001;
        }
        document.getElementById("glafiIdInput").value = newId;
        // Option price logic for GLAFI
        const optionSelect = document.getElementById("glafiOptionSelect");
        const amountInput = document.getElementById("glafiAmountInput");
        optionSelect.onchange = function () {
          if (this.value === "Option 1") amountInput.value = 500;
        };
        // Wait for auth state to be ready before enabling form submission
        firebase.auth().onAuthStateChanged(function (user) {
          document.getElementById("addForm").onsubmit = async function (e) {
            e.preventDefault();
            if (!user) {
              showGaddiAddModal(
                "You must be logged in to add a GLAFI entry.",
                false
              );
              return;
            }
            const form = e.target;
            const id = form.id.value;
            const firstName = form.firstName.value;
            const lastName = form.lastName.value;
            const product = form.product.value;
            const option = form.option.value;
            const amount = form.amount.value;
            const status = form.status.value;
            // Store in Firebase Realtime Database
            try {
              await firebase
                .database()
                .ref("glafi/" + id)
                .set({
                  id,
                  firstName,
                  lastName,
                  product,
                  option,
                  amount,
                  status,
                  createdAt: new Date().toISOString(),
                  userId: user.uid,
                });
              closeModal();
              showGaddiAddModal("GLAFI entry added successfully!", true);
            } catch (err) {
              showGaddiAddModal(
                "Failed to save to Firebase Realtime Database: " + err.message,
                false
              );
            }
          };
        });
      }, 0);
    } else {
      // fallback for other sections (if needed in future)
      title.textContent = `Add Entry - ${sectionTitle}`;
      body.innerHTML = `<form id='addForm'>
        <label>ID No.: <input type='text' name='id' required></label>
        <label>Name: <input type='text' name='name' required></label>
        <label>Product Name: <input type='text' name='product' required></label>
        <label>Option #: <input type='text' name='option' required></label>
        <label>Amount: <input type='number' name='amount' required></label>
        <label>Status: <select name='status'><option>Upcoming due</option><option>Overdue</option><option>Renewed</option></select></label>
        <button type='submit'>Add</button>
      </form>`;
    }
  } else if (type === "update") {
    // GADDI-specific update form
    if (sectionId === "gaddi-section") {
      // Fetch all GADDI entries for the dropdown
      title.textContent = `Update Entry - ${sectionTitle}`;
      body.innerHTML = `<form id='updateForm'>
        <label>Select ID No.:
          <select name='id' id='gaddiUpdateIdSelect' required><option value=''>Loading...</option></select>
        </label>
        <label>First Name: <input type='text' name='firstName' id='gaddiUpdateFirstName' required></label>
        <label>Last Name: <input type='text' name='lastName' id='gaddiUpdateLastName' required></label>
        <label>Product Name: <input type='text' name='product' id='gaddiUpdateProduct' value='GADDI' readonly></label>
        <label>Option #:
          <select name='option' id='gaddiUpdateOption'>
            <option value='Option 1'>Option 1</option>
            <option value='Option 2'>Option 2</option>
          </select>
        </label>
        <label>Amount: <input type='number' name='amount' id='gaddiUpdateAmount' value='230' readonly required></label>
        <label>Status: <select name='status' id='gaddiUpdateStatus'><option>Upcoming due</option><option>Overdue</option><option>Renewed</option></select></label>
        <button type='submit'>Update</button>
      </form>`;
      setTimeout(async () => {
        // Populate dropdown with IDs
        const select = document.getElementById("gaddiUpdateIdSelect");
        select.innerHTML = '<option value="">Select ID</option>';
        let gaddiData = {};
        try {
          const snapshot = await firebase.database().ref("gaddi").once("value");
          snapshot.forEach((child) => {
            const data = child.val();
            if (data && data.id) {
              gaddiData[data.id] = data;
              select.innerHTML += `<option value='${data.id}'>${data.id}</option>`;
            }
          });
        } catch (err) {
          select.innerHTML = '<option value="">Failed to load</option>';
        }
        // When an ID is selected, prefill the form
        select.onchange = function () {
          const data = gaddiData[select.value];
          if (data) {
            document.getElementById("gaddiUpdateFirstName").value =
              data.firstName || "";
            document.getElementById("gaddiUpdateLastName").value =
              data.lastName || "";
            document.getElementById("gaddiUpdateProduct").value = data.product;
            document.getElementById("gaddiUpdateOption").value = data.option;
            document.getElementById("gaddiUpdateAmount").value =
              data.option === "Option 1" ? 230 : 460;
            document.getElementById("gaddiUpdateStatus").value = data.status;
          } else {
            document.getElementById("gaddiUpdateFirstName").value = "";
            document.getElementById("gaddiUpdateLastName").value = "";
            document.getElementById("gaddiUpdateProduct").value = "GADDI";
            document.getElementById("gaddiUpdateOption").value = "Option 1";
            document.getElementById("gaddiUpdateAmount").value = 230;
            document.getElementById("gaddiUpdateStatus").value = "Upcoming due";
          }
        };
        // Option price logic
        document.getElementById("gaddiUpdateOption").onchange = function () {
          document.getElementById("gaddiUpdateAmount").value =
            this.value === "Option 1" ? 230 : 460;
        };
        // Submit update
        document.getElementById("updateForm").onsubmit = async function (e) {
          e.preventDefault();
          const id = select.value;
          if (!id) {
            showGaddiAddModal("Please select an ID to update.", false);
            return;
          }
          const firstName = document.getElementById(
            "gaddiUpdateFirstName"
          ).value;
          const lastName = document.getElementById("gaddiUpdateLastName").value;
          const product = document.getElementById("gaddiUpdateProduct").value;
          const option = document.getElementById("gaddiUpdateOption").value;
          const amount = document.getElementById("gaddiUpdateAmount").value;
          const status = document.getElementById("gaddiUpdateStatus").value;
          try {
            await firebase
              .database()
              .ref("gaddi/" + id)
              .update({
                firstName,
                lastName,
                product,
                option,
                amount,
                status,
              });
            closeModal();
            showGaddiAddModal("GADDI entry updated successfully!", true);
          } catch (err) {
            showGaddiAddModal("Failed to update entry: " + err.message, false);
          }
        };
      }, 0);
    } else if (sectionId === "gaddi-plus-section") {
      // GADDI Plus-specific update form
      title.textContent = `Update Entry - ${sectionTitle}`;
      body.innerHTML = `<form id='updateForm'>
        <label>Select ID No.:
          <select name='id' id='gaddiPlusUpdateIdSelect' required><option value=''>Loading...</option></select>
        </label>
        <label>First Name: <input type='text' name='firstName' id='gaddiPlusUpdateFirstName' required></label>
        <label>Last Name: <input type='text' name='lastName' id='gaddiPlusUpdateLastName' required></label>
        <label>Product Name: <input type='text' name='product' id='gaddiPlusUpdateProduct' value='GADDI PLUS' readonly></label>
        <label>Option #:
          <select name='option' id='gaddiPlusUpdateOption'>
            <option value='Option 1'>Option 1</option>
            <option value='Option 2'>Option 2</option>
            <option value='Option 3'>Option 3</option>
            <option value='Option 4'>Option 4</option>
          </select>
        </label>
        <label>Amount: <input type='number' name='amount' id='gaddiPlusUpdateAmount' value='250' readonly required></label>
        <label>Status: <select name='status' id='gaddiPlusUpdateStatus'><option>Upcoming due</option><option>Overdue</option><option>Renewed</option></select></label>
        <button type='submit'>Update</button>
      </form>`;
      setTimeout(async () => {
        // Populate dropdown with IDs
        const select = document.getElementById("gaddiPlusUpdateIdSelect");
        select.innerHTML = '<option value="">Select ID</option>';
        let gaddiPlusData = {};
        try {
          const snapshot = await firebase
            .database()
            .ref("gaddiPlus")
            .once("value");
          snapshot.forEach((child) => {
            const data = child.val();
            if (data && data.id) {
              gaddiPlusData[data.id] = data;
              select.innerHTML += `<option value='${data.id}'>${data.id}</option>`;
            }
          });
        } catch (err) {
          select.innerHTML = '<option value="">Failed to load</option>';
        }
        // When an ID is selected, prefill the form
        select.onchange = function () {
          const data = gaddiPlusData[select.value];
          if (data) {
            document.getElementById("gaddiPlusUpdateFirstName").value =
              data.firstName || "";
            document.getElementById("gaddiPlusUpdateLastName").value =
              data.lastName || "";
            document.getElementById("gaddiPlusUpdateProduct").value =
              data.product;
            document.getElementById("gaddiPlusUpdateOption").value =
              data.option;
            let amount = 250;
            if (data.option === "Option 2") amount = 500;
            else if (data.option === "Option 3") amount = 800;
            else if (data.option === "Option 4") amount = 1000;
            document.getElementById("gaddiPlusUpdateAmount").value = amount;
            document.getElementById("gaddiPlusUpdateStatus").value =
              data.status;
          } else {
            document.getElementById("gaddiPlusUpdateFirstName").value = "";
            document.getElementById("gaddiPlusUpdateLastName").value = "";
            document.getElementById("gaddiPlusUpdateProduct").value =
              "GADDI PLUS";
            document.getElementById("gaddiPlusUpdateOption").value = "Option 1";
            document.getElementById("gaddiPlusUpdateAmount").value = 250;
            document.getElementById("gaddiPlusUpdateStatus").value =
              "Upcoming due";
          }
        };
        // Option price logic
        document.getElementById("gaddiPlusUpdateOption").onchange =
          function () {
            let amount = 250;
            if (this.value === "Option 2") amount = 500;
            else if (this.value === "Option 3") amount = 800;
            else if (this.value === "Option 4") amount = 1000;
            document.getElementById("gaddiPlusUpdateAmount").value = amount;
          };
        // Submit update
        document.getElementById("updateForm").onsubmit = async function (e) {
          e.preventDefault();
          const id = select.value;
          if (!id) {
            showGaddiAddModal("Please select an ID to update.", false);
            return;
          }
          const firstName = document.getElementById(
            "gaddiPlusUpdateFirstName"
          ).value;
          const lastName = document.getElementById(
            "gaddiPlusUpdateLastName"
          ).value;
          const product = document.getElementById(
            "gaddiPlusUpdateProduct"
          ).value;
          const option = document.getElementById("gaddiPlusUpdateOption").value;
          const amount = document.getElementById("gaddiPlusUpdateAmount").value;
          const status = document.getElementById("gaddiPlusUpdateStatus").value;
          try {
            await firebase
              .database()
              .ref("gaddiPlus/" + id)
              .update({
                firstName,
                lastName,
                product,
                option,
                amount,
                status,
              });
            closeModal();
            showGaddiAddModal("GADDI Plus entry updated successfully!", true);
          } catch (err) {
            showGaddiAddModal("Failed to update entry: " + err.message, false);
          }
        };
      }, 0);
    } else if (sectionId === "glafi-section") {
      // GLAFI-specific update form
      title.textContent = `Update Entry - ${sectionTitle}`;
      body.innerHTML = `<form id='updateForm'>
        <label>Select ID No.:
          <select name='id' id='glafiUpdateIdSelect' required><option value=''>Loading...</option></select>
        </label>
        <label>First Name: <input type='text' name='firstName' id='glafiUpdateFirstName' required></label>
        <label>Last Name: <input type='text' name='lastName' id='glafiUpdateLastName' required></label>
        <label>Product Name: <input type='text' name='product' id='glafiUpdateProduct' value='GLAFI' readonly></label>
        <label>Option #:
          <select name='option' id='glafiUpdateOption'>
            <option value='Option 1'>Option 1</option>
          </select>
        </label>
        <label>Amount: <input type='number' name='amount' id='glafiUpdateAmount' value='500' readonly required></label>
        <label>Status: <select name='status' id='glafiUpdateStatus'><option>Upcoming due</option><option>Overdue</option><option>Renewed</option></select></label>
        <button type='submit'>Update</button>
      </form>`;
      setTimeout(async () => {
        // Populate dropdown with IDs
        const select = document.getElementById("glafiUpdateIdSelect");
        select.innerHTML = '<option value="">Select ID</option>';
        let glafiData = {};
        try {
          const snapshot = await firebase.database().ref("glafi").once("value");
          snapshot.forEach((child) => {
            const data = child.val();
            if (data && data.id) {
              glafiData[data.id] = data;
              select.innerHTML += `<option value='${data.id}'>${data.id}</option>`;
            }
          });
        } catch (err) {
          select.innerHTML = '<option value="">Failed to load</option>';
        }
        // When an ID is selected, prefill the form
        select.onchange = function () {
          const data = glafiData[select.value];
          if (data) {
            document.getElementById("glafiUpdateFirstName").value =
              data.firstName || "";
            document.getElementById("glafiUpdateLastName").value =
              data.lastName || "";
            document.getElementById("glafiUpdateProduct").value = data.product;
            document.getElementById("glafiUpdateOption").value = data.option;
            let amount = 500;
            document.getElementById("glafiUpdateAmount").value = amount;
            document.getElementById("glafiUpdateStatus").value = data.status;
          } else {
            document.getElementById("glafiUpdateFirstName").value = "";
            document.getElementById("glafiUpdateLastName").value = "";
            document.getElementById("glafiUpdateProduct").value = "GLAFI";
            document.getElementById("glafiUpdateOption").value = "Option 1";
            document.getElementById("glafiUpdateAmount").value = 500;
            document.getElementById("glafiUpdateStatus").value = "Upcoming due";
          }
        };
        // Option price logic
        document.getElementById("glafiUpdateOption").onchange = function () {
          let amount = 500;
          document.getElementById("glafiUpdateAmount").value = amount;
        };
        // Submit update
        document.getElementById("updateForm").onsubmit = async function (e) {
          e.preventDefault();
          const id = select.value;
          if (!id) {
            showGaddiAddModal("Please select an ID to update.", false);
            return;
          }
          const firstName = document.getElementById(
            "glafiUpdateFirstName"
          ).value;
          const lastName = document.getElementById("glafiUpdateLastName").value;
          const product = document.getElementById("glafiUpdateProduct").value;
          const option = document.getElementById("glafiUpdateOption").value;
          const amount = document.getElementById("glafiUpdateAmount").value;
          const status = document.getElementById("glafiUpdateStatus").value;
          try {
            await firebase
              .database()
              .ref("glafi/" + id)
              .update({
                firstName,
                lastName,
                product,
                option,
                amount,
                status,
              });
            closeModal();
            showGaddiAddModal("GLAFI entry updated successfully!", true);
          } catch (err) {
            showGaddiAddModal("Failed to update entry: " + err.message, false);
          }
        };
      }, 0);
    } else {
      // fallback for other sections (if needed in future)
      title.textContent = `Update Entry - ${sectionTitle}`;
      body.innerHTML = `<form id='updateForm'>
        <label>ID No.: <input type='text' name='id' required></label>
        <label>Name: <input type='text' name='name'></label>
        <label>Product Name: <input type='text' name='product'></label>
        <label>Option #: <input type='text' name='option'></label>
        <label>Amount: <input type='number' name='amount'></label>
        <label>Status: <select name='status'><option>Upcoming due</option><option>Overdue</option><option>Renewed</option></select></label>
        <button type='submit'>Update</button>
      </form>`;
    }
  } else if (type === "print") {
    title.textContent = `Print Table - ${sectionTitle}`;
    body.innerHTML = `<p>Click the button below to print the table for <b>${sectionTitle}</b>.</p>
      <button onclick='window.print()'>Print Table</button>`;
  } else {
    title.textContent = "";
    body.innerHTML = "";
  }

  modal.classList.add("active");
}

function closeModal() {
  document.getElementById("gaddiModal").classList.remove("active");
}

// Add this helper for modal pop-up
function showGaddiAddModal(message, isSuccess) {
  let modal = document.getElementById("gaddi-add-modal");
  let msgSpan = document.getElementById("gaddi-add-modal-message");
  let closeBtn = document.getElementById("gaddi-add-modal-close");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "gaddi-add-modal";
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
        <span id="gaddi-add-modal-message" style="display:block; margin-bottom: 18px; font-size: 16px;"></span>
        <button id="gaddi-add-modal-close" style="padding: 8px 18px; border-radius: 6px; border: none; background: #2f619e; color: #fff; font-weight: bold; cursor: pointer;">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
    msgSpan = document.getElementById("gaddi-add-modal-message");
    closeBtn = document.getElementById("gaddi-add-modal-close");
  }
  msgSpan.textContent = message;
  msgSpan.style.color = isSuccess ? "#2f619e" : "#e53935";
  modal.style.display = "flex";
  function closeHandler() {
    modal.style.display = "none";
    closeBtn.removeEventListener("click", closeHandler);
  }
  closeBtn.addEventListener("click", closeHandler);
}

// Utility: Get the max GADDI ID from the database
async function getMaxGaddiId() {
  let maxId = 100000;
  try {
    const snapshot = await firebase.database().ref("gaddi").once("value");
    snapshot.forEach((child) => {
      if (/^\d+$/.test(child.key)) {
        const val = parseInt(child.key, 10);
        if (!isNaN(val) && val > maxId) maxId = val;
      }
    });
  } catch (err) {
    // ignore, return default
  }
  return maxId;
}

// Store latest data globally for all sections
let latestGaddiRows = [];
let latestGaddiPlusRows = [];
let latestGlafiRows = [];

// Fetch all GADDI entries and store them, then render table
function listenToGaddiTableData() {
  const tbody = document.getElementById("gaddiTableBody");
  if (!tbody) return;
  firebase
    .database()
    .ref("gaddi")
    .on(
      "value",
      (snapshot) => {
        latestGaddiRows = [];
        snapshot.forEach((child) => {
          const data = child.val();
          if (
            data &&
            data.id &&
            data.product &&
            data.option &&
            data.amount &&
            data.status &&
            ((data.firstName && data.lastName) || data.name)
          ) {
            latestGaddiRows.push({
              id: data.id,
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              name: data.name || "",
              product: data.product,
              option: data.option,
              amount: data.amount,
              status: data.status,
              createdAt: data.createdAt,
              source: "gaddi",
            });
          }
        });
        // Sort by ID ascending
        latestGaddiRows.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
        renderGaddiTable();
      },
      (err) => {
        tbody.innerHTML = '<tr><td colspan="6">Failed to load data</td></tr>';
      }
    );
  // Add filter event listener (only once)
  setTimeout(() => {
    const filterEl = document.getElementById("dropdownStatusFilter");
    if (filterEl && !filterEl._listenerAdded) {
      filterEl.addEventListener("change", renderGaddiTable);
      filterEl._listenerAdded = true;
    }
  }, 0);
}

// Fetch all GADDI Plus entries and store them, then render table
function listenToGaddiPlusTableData() {
  const tbody = document.getElementById("gaddiPlusTableBody");
  if (!tbody) return;
  firebase
    .database()
    .ref("gaddiPlus")
    .on(
      "value",
      (snapshot) => {
        latestGaddiPlusRows = [];
        snapshot.forEach((child) => {
          const data = child.val();
          if (
            data &&
            data.id &&
            data.product &&
            data.option &&
            data.amount &&
            data.status &&
            ((data.firstName && data.lastName) || data.name)
          ) {
            latestGaddiPlusRows.push({
              id: data.id,
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              name: data.name || "",
              product: data.product,
              option: data.option,
              amount: data.amount,
              status: data.status,
              createdAt: data.createdAt,
              source: "gaddiPlus",
            });
          }
        });
        // Sort by ID ascending
        latestGaddiPlusRows.sort(
          (a, b) => parseInt(a.id, 10) - parseInt(b.id, 10)
        );
        renderGaddiPlusTable();
      },
      (err) => {
        tbody.innerHTML = '<tr><td colspan="6">Failed to load data</td></tr>';
      }
    );
  // Add filter event listener (only once)
  setTimeout(() => {
    const filterEl = document.getElementById("dropdownStatusFilterPlus");
    if (filterEl && !filterEl._listenerAdded) {
      filterEl.addEventListener("change", renderGaddiPlusTable);
      filterEl._listenerAdded = true;
    }
  }, 0);
}

// Fetch all GLAFI entries and store them, then render table
function listenToGlafiTableData() {
  const tbody = document.getElementById("glafiTableBody");
  if (!tbody) return;
  firebase
    .database()
    .ref("glafi")
    .on(
      "value",
      (snapshot) => {
        latestGlafiRows = [];
        snapshot.forEach((child) => {
          const data = child.val();
          if (
            data &&
            data.id &&
            data.product &&
            data.option &&
            data.amount &&
            data.status &&
            ((data.firstName && data.lastName) || data.name)
          ) {
            latestGlafiRows.push({
              id: data.id,
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              name: data.name || "",
              product: data.product,
              option: data.option,
              amount: data.amount,
              status: data.status,
              createdAt: data.createdAt,
              source: "glafi",
            });
          }
        });
        // Sort by ID ascending
        latestGlafiRows.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
        renderGlafiTable();
      },
      (err) => {
        tbody.innerHTML = '<tr><td colspan="6">Failed to load data</td></tr>';
      }
    );
  // Add filter event listener (only once)
  setTimeout(() => {
    const filterEl = document.getElementById("dropdownStatusFilterGlafi");
    if (filterEl && !filterEl._listenerAdded) {
      filterEl.addEventListener("change", renderGlafiTable);
      filterEl._listenerAdded = true;
    }
  }, 0);
}

// Render the GADDI table based on the current filter and latest data
function renderGaddiTable() {
  const tbody = document.getElementById("gaddiTableBody");
  if (!tbody) return;
  const filter = (
    document.getElementById("dropdownStatusFilter")?.value || ""
  ).toLowerCase();
  let filteredRows = latestGaddiRows;
  if (filter && filter !== "all") {
    filteredRows = latestGaddiRows.filter(
      (row) => row.status.toLowerCase() === filter
    );
  }
  tbody.innerHTML = "";
  for (const row of filteredRows) {
    let statusColor = "";
    const statusLower = row.status.toLowerCase();
    if (statusLower.includes("upcoming")) {
      statusColor = "color:#ffb74d;";
    } else if (statusLower.includes("overdue")) {
      statusColor = "color:#ef5350;";
    } else if (statusLower.includes("renew")) {
      statusColor = "color:#66bb6a;";
    }
    // Use firstName and lastName if present, else try to split name
    let firstName = row.firstName || "";
    let lastName = row.lastName || "";
    if (!firstName && !lastName && row.name) {
      const parts = row.name.split(" ");
      firstName = parts[0] || "";
      lastName = parts.slice(1).join(" ");
    }
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.id || ""}</td>
      <td>${firstName}</td>
      <td>${lastName}</td>
      <td>${row.product || ""}</td>
      <td>${row.option || ""}</td>
      <td>${row.amount || ""}</td>
      <td class="status ${row.status
        .toLowerCase()
        .replace(/\s/g, "")}" style="${statusColor}">${row.status || ""}</td>
    `;
    tbody.appendChild(tr);
  }
  if (filteredRows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7">No data found</td></tr>';
  }
}

// Render the GADDI Plus table based on the current filter and latest data
function renderGaddiPlusTable() {
  const tbody = document.getElementById("gaddiPlusTableBody");
  if (!tbody) return;
  const filter = (
    document.getElementById("dropdownStatusFilterPlus")?.value || ""
  ).toLowerCase();
  let filteredRows = latestGaddiPlusRows;
  if (filter && filter !== "all") {
    filteredRows = latestGaddiPlusRows.filter(
      (row) => row.status.toLowerCase() === filter
    );
  }
  tbody.innerHTML = "";
  for (const row of filteredRows) {
    let statusColor = "";
    const statusLower = row.status.toLowerCase();
    if (statusLower.includes("upcoming")) {
      statusColor = "color:#ffb74d;";
    } else if (statusLower.includes("overdue")) {
      statusColor = "color:#ef5350;";
    } else if (statusLower.includes("renew")) {
      statusColor = "color:#66bb6a;";
    }
    let firstName = row.firstName || "";
    let lastName = row.lastName || "";
    if (!firstName && !lastName && row.name) {
      const parts = row.name.split(" ");
      firstName = parts[0] || "";
      lastName = parts.slice(1).join(" ");
    }
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.id || ""}</td>
      <td>${firstName}</td>
      <td>${lastName}</td>
      <td>${row.product || ""}</td>
      <td>${row.option || ""}</td>
      <td>${row.amount || ""}</td>
      <td class="status ${row.status
        .toLowerCase()
        .replace(/\s/g, "")}" style="${statusColor}">${row.status || ""}</td>
    `;
    tbody.appendChild(tr);
  }
  if (filteredRows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7">No data found</td></tr>';
  }
}

// Render the GLAFI table based on the current filter and latest data
function renderGlafiTable() {
  const tbody = document.getElementById("glafiTableBody");
  if (!tbody) return;
  const filter = (
    document.getElementById("dropdownStatusFilterGlafi")?.value || ""
  ).toLowerCase();
  let filteredRows = latestGlafiRows;
  if (filter && filter !== "all") {
    filteredRows = latestGlafiRows.filter(
      (row) => row.status.toLowerCase() === filter
    );
  }
  tbody.innerHTML = "";
  for (const row of filteredRows) {
    let statusColor = "";
    const statusLower = row.status.toLowerCase();
    if (statusLower.includes("upcoming")) {
      statusColor = "color:#ffb74d;";
    } else if (statusLower.includes("overdue")) {
      statusColor = "color:#ef5350;";
    } else if (statusLower.includes("renew")) {
      statusColor = "color:#66bb6a;";
    }
    let firstName = row.firstName || "";
    let lastName = row.lastName || "";
    if (!firstName && !lastName && row.name) {
      const parts = row.name.split(" ");
      firstName = parts[0] || "";
      lastName = parts.slice(1).join(" ");
    }
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.id || ""}</td>
      <td>${firstName}</td>
      <td>${lastName}</td>
      <td>${row.product || ""}</td>
      <td>${row.option || ""}</td>
      <td>${row.amount || ""}</td>
      <td class="status ${row.status
        .toLowerCase()
        .replace(/\s/g, "")}" style="${statusColor}">${row.status || ""}</td>
    `;
    tbody.appendChild(tr);
  }
  if (filteredRows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7">No data found</td></tr>';
  }
}

// Update the dropdown list based on the filter
async function updateGaddiDropdownList() {
  const filter = (
    document.getElementById("dropdownStatusFilter")?.value || "upcoming due"
  ).toLowerCase();
  const ul = document.getElementById("dropdown-upcoming");
  if (!ul) return;
  ul.innerHTML = "";
  try {
    const snapshot = await firebase.database().ref("gaddi").once("value");
    let names = [];
    snapshot.forEach((child) => {
      const data = child.val();
      if (data && data.name && data.status) {
        if (data.status.toLowerCase() === filter) {
          names.push(data.name);
        }
      }
    });
    for (const name of names) {
      const li = document.createElement("li");
      li.textContent = name;
      ul.appendChild(li);
    }
    if (names.length === 0) {
      ul.innerHTML = "<li>No data found</li>";
    }
  } catch (err) {
    ul.innerHTML = "<li>Failed to load</li>";
  }
}

// Update the dropdown list based on the filter for GADDI Plus
async function updateGaddiPlusDropdownList() {
  const filter = (
    document.getElementById("dropdownStatusFilterPlus")?.value || "upcoming due"
  ).toLowerCase();
  const ul = document.getElementById("dropdown-upcoming-plus");
  if (!ul) return;
  ul.innerHTML = "";
  try {
    const snapshot = await firebase.database().ref("gaddiPlus").once("value");
    let names = [];
    snapshot.forEach((child) => {
      const data = child.val();
      if (data && data.name && data.status) {
        if (data.status.toLowerCase() === filter) {
          names.push(data.name);
        }
      }
    });
    for (const name of names) {
      const li = document.createElement("li");
      li.textContent = name;
      ul.appendChild(li);
    }
    if (names.length === 0) {
      ul.innerHTML = "<li>No data found</li>";
    }
  } catch (err) {
    ul.innerHTML = "<li>Failed to load</li>";
  }
}

// Update the dropdown list based on the filter for GLAFI
async function updateGlafiDropdownList() {
  const filter = (
    document.getElementById("dropdownStatusFilterGlafi")?.value ||
    "upcoming due"
  ).toLowerCase();
  const ul = document.getElementById("dropdown-upcoming-glafi");
  if (!ul) return;
  ul.innerHTML = "";
  try {
    const snapshot = await firebase.database().ref("glafi").once("value");
    let names = [];
    snapshot.forEach((child) => {
      const data = child.val();
      if (data && data.name && data.status) {
        if (data.status.toLowerCase() === filter) {
          names.push(data.name);
        }
      }
    });
    for (const name of names) {
      const li = document.createElement("li");
      li.textContent = name;
      ul.appendChild(li);
    }
    if (names.length === 0) {
      ul.innerHTML = "<li>No data found</li>";
    }
  } catch (err) {
    ul.innerHTML = "<li>Failed to load</li>";
  }
}

// Filter static HTML table rows (for when Firebase data is not available)
function filterStaticGaddiTable() {
  const tbody = document.getElementById("gaddiTableBody");
  if (!tbody) return;

  const filter = (
    document.getElementById("dropdownStatusFilter")?.value || ""
  ).toLowerCase();
  const rows = tbody.querySelectorAll("tr");

  rows.forEach((row) => {
    const statusCell = row.querySelector(".status");
    if (!statusCell) return;

    const status = statusCell.textContent.toLowerCase().trim();
    let shouldShow = true;

    if (filter && filter !== "all") {
      if (filter === "overdue") {
        shouldShow = status.includes("overdue");
      } else if (filter === "upcoming due") {
        shouldShow = status.includes("upcoming");
      } else if (filter === "renewed") {
        shouldShow = status.includes("renewed");
      }
    }

    row.style.display = shouldShow ? "" : "none";
  });

  // Show message if no rows are visible
  const visibleRows = tbody.querySelectorAll(
    "tr:not([style*='display: none'])"
  );
  if (visibleRows.length === 0) {
    // Add a "no data" row if none exist
    let noDataRow = tbody.querySelector(".no-data-row");
    if (!noDataRow) {
      noDataRow = document.createElement("tr");
      noDataRow.className = "no-data-row";
      noDataRow.innerHTML =
        '<td colspan="6" style="text-align: center; padding: 20px; color: #666;">No data found</td>';
    }
    tbody.appendChild(noDataRow);
  } else {
    // Remove "no data" row if it exists
    const noDataRow = tbody.querySelector(".no-data-row");
    if (noDataRow) {
      noDataRow.remove();
    }
  }
}

// Filter static HTML table rows (for when Firebase data is not available) for GADDI Plus
function filterStaticGaddiPlusTable() {
  const tbody = document.getElementById("gaddiPlusTableBody");
  if (!tbody) return;

  const filter = (
    document.getElementById("dropdownStatusFilterPlus")?.value || ""
  ).toLowerCase();
  const rows = tbody.querySelectorAll("tr");

  rows.forEach((row) => {
    const statusCell = row.querySelector(".status");
    if (!statusCell) return;

    const status = statusCell.textContent.toLowerCase().trim();
    let shouldShow = true;

    if (filter && filter !== "all") {
      if (filter === "overdue") {
        shouldShow = status.includes("overdue");
      } else if (filter === "upcoming due") {
        shouldShow = status.includes("upcoming");
      } else if (filter === "renewed") {
        shouldShow = status.includes("renewed");
      }
    }

    row.style.display = shouldShow ? "" : "none";
  });

  // Show message if no rows are visible
  const visibleRows = tbody.querySelectorAll(
    "tr:not([style*='display: none'])"
  );
  if (visibleRows.length === 0) {
    // Add a "no data" row if none exist
    let noDataRow = tbody.querySelector(".no-data-row");
    if (!noDataRow) {
      noDataRow = document.createElement("tr");
      noDataRow.className = "no-data-row";
      noDataRow.innerHTML =
        '<td colspan="6" style="text-align: center; padding: 20px; color: #666;">No data found</td>';
    }
    tbody.appendChild(noDataRow);
  } else {
    // Remove "no data" row if it exists
    const noDataRow = tbody.querySelector(".no-data-row");
    if (noDataRow) {
      noDataRow.remove();
    }
  }
}

// Filter static HTML table rows (for when Firebase data is not available) for GLAFI
function filterStaticGlafiTable() {
  const tbody = document.getElementById("glafiTableBody");
  if (!tbody) return;

  const filter = (
    document.getElementById("dropdownStatusFilterGlafi")?.value || ""
  ).toLowerCase();
  const rows = tbody.querySelectorAll("tr");

  rows.forEach((row) => {
    const statusCell = row.querySelector(".status");
    if (!statusCell) return;

    const status = statusCell.textContent.toLowerCase().trim();
    let shouldShow = true;

    if (filter && filter !== "all") {
      if (filter === "overdue") {
        shouldShow = status.includes("overdue");
      } else if (filter === "upcoming due") {
        shouldShow = status.includes("upcoming");
      } else if (filter === "renewed") {
        shouldShow = status.includes("renewed");
      }
    }

    row.style.display = shouldShow ? "" : "none";
  });

  // Show message if no rows are visible
  const visibleRows = tbody.querySelectorAll(
    "tr:not([style*='display: none'])"
  );
  if (visibleRows.length === 0) {
    // Add a "no data" row if none exist
    let noDataRow = tbody.querySelector(".no-data-row");
    if (!noDataRow) {
      noDataRow = document.createElement("tr");
      noDataRow.className = "no-data-row";
      noDataRow.innerHTML =
        '<td colspan="6" style="text-align: center; padding: 20px; color: #666;">No data found</td>';
    }
    tbody.appendChild(noDataRow);
  } else {
    // Remove "no data" row if it exists
    const noDataRow = tbody.querySelector(".no-data-row");
    if (noDataRow) {
      noDataRow.remove();
    }
  }
}

// Listen for filter changes and real-time updates
function setupGaddiDropdownFilterListener() {
  const filterEl = document.getElementById("dropdownStatusFilter");
  if (filterEl && !filterEl._listenerAdded) {
    filterEl.addEventListener("change", function () {
      // Try to filter static data first, then dynamic data
      filterStaticGaddiTable();
      // Also try to update dynamic data if available
      if (typeof renderGaddiTable === "function") {
        renderGaddiTable();
      }
    });
    filterEl._listenerAdded = true;
  }
  // Listen to real-time updates
  firebase
    .database()
    .ref("gaddi")
    .on("value", function () {
      // Update both static and dynamic filters
      filterStaticGaddiTable();
      if (typeof updateGaddiDropdownList === "function") {
        updateGaddiDropdownList();
      }
    });
}

// Listen for filter changes and real-time updates for GADDI Plus
function setupGaddiPlusDropdownFilterListener() {
  const filterEl = document.getElementById("dropdownStatusFilterPlus");
  if (filterEl && !filterEl._listenerAdded) {
    filterEl.addEventListener("change", function () {
      // Try to filter static data first, then dynamic data
      filterStaticGaddiPlusTable();
      // Also try to update dynamic data if available
      if (typeof renderGaddiPlusTable === "function") {
        renderGaddiPlusTable();
      }
    });
    filterEl._listenerAdded = true;
  }
  // Listen to real-time updates
  firebase
    .database()
    .ref("gaddiPlus")
    .on("value", function () {
      // Update both static and dynamic filters
      filterStaticGaddiPlusTable();
      if (typeof updateGaddiPlusDropdownList === "function") {
        updateGaddiPlusDropdownList();
      }
    });
}

// Listen for filter changes and real-time updates for GLAFI
function setupGlafiDropdownFilterListener() {
  const filterEl = document.getElementById("dropdownStatusFilterGlafi");
  if (filterEl && !filterEl._listenerAdded) {
    filterEl.addEventListener("change", function () {
      // Try to filter static data first, then dynamic data
      filterStaticGlafiTable();
      // Also try to update dynamic data if available
      if (typeof renderGlafiTable === "function") {
        renderGlafiTable();
      }
    });
    filterEl._listenerAdded = true;
  }
  // Listen to real-time updates
  firebase
    .database()
    .ref("glafi")
    .on("value", function () {
      // Update both static and dynamic filters
      filterStaticGlafiTable();
      if (typeof updateGlafiDropdownList === "function") {
        updateGlafiDropdownList();
      }
    });
}

// Fetch and display all data in home section results table
function fetchAndDisplayAllData() {
  const tbody = document.querySelector("#home-section .results-table tbody");
  if (!tbody) return;

  // Clear existing content
  tbody.innerHTML =
    '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #666;">Loading data...</td></tr>';

  // Fetch data from all three collections
  Promise.all([
    firebase.database().ref("gaddi").once("value"),
    firebase.database().ref("gaddiPlus").once("value"),
    firebase.database().ref("glafi").once("value"),
  ])
    .then(([gaddiSnapshot, gaddiPlusSnapshot, glafiSnapshot]) => {
      let allData = [];

      // Process GADDI data
      gaddiSnapshot.forEach((child) => {
        const data = child.val();
        if (
          data &&
          data.id &&
          data.product &&
          data.option &&
          data.amount &&
          data.status &&
          ((data.firstName && data.lastName) || data.name)
        ) {
          allData.push({
            id: data.id,
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            name: data.name || "",
            product: data.product,
            option: data.option,
            amount: data.amount,
            status: data.status,
            createdAt: data.createdAt,
            source: "gaddi",
          });
        }
      });

      // Process GADDI Plus data
      gaddiPlusSnapshot.forEach((child) => {
        const data = child.val();
        if (
          data &&
          data.id &&
          data.product &&
          data.option &&
          data.amount &&
          data.status &&
          ((data.firstName && data.lastName) || data.name)
        ) {
          allData.push({
            id: data.id,
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            name: data.name || "",
            product: data.product,
            option: data.option,
            amount: data.amount,
            status: data.status,
            createdAt: data.createdAt,
            source: "gaddiPlus",
          });
        }
      });

      // Process GLAFI data
      glafiSnapshot.forEach((child) => {
        const data = child.val();
        if (
          data &&
          data.id &&
          data.product &&
          data.option &&
          data.amount &&
          data.status &&
          ((data.firstName && data.lastName) || data.name)
        ) {
          allData.push({
            id: data.id,
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            name: data.name || "",
            product: data.product,
            option: data.option,
            amount: data.amount,
            status: data.status,
            createdAt: data.createdAt,
            source: "glafi",
          });
        }
      });

      // Sort by ID
      allData.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));

      // Update summary card counters
      updateSummaryCardCounters(allData);

      // Update home dashboard charts with full data
      updateHomeDashboardCharts(allData);

      // Display data in table
      displayAllDataInTable(allData);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      tbody.innerHTML =
        '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #e53935;">Failed to load data</td></tr>';
    });
}

// Display all data in the home section results table
function displayAllDataInTable(data) {
  const tbody = document.querySelector("#home-section .results-table tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #666;">No data found</td></tr>';
    return;
  }

  data.forEach((item) => {
    let statusColor = "";
    const statusLower = item.status.toLowerCase();
    if (statusLower.includes("upcoming")) {
      statusColor = "color:#ffb74d;";
    } else if (statusLower.includes("overdue")) {
      statusColor = "color:#ef5350;";
    } else if (statusLower.includes("renew")) {
      statusColor = "color:#66bb6a;";
    }
    let firstName = item.firstName || "";
    let lastName = item.lastName || "";
    if (!firstName && !lastName && item.name) {
      const parts = item.name.split(" ");
      firstName = parts[0] || "";
      lastName = parts.slice(1).join(" ");
    }
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${firstName} ${lastName}</td>
      <td>${item.product}</td>
      <td>${item.option}</td>
      <td>₱${item.amount}</td>
      <td class="status ${item.status
        .toLowerCase()
        .replace(/\s/g, "")}" style="${statusColor}">${item.status}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Filter data in home section based on dropdown selections
function filterHomeSectionData() {
  const monthFilter = document.getElementById("monthFilter");
  const statusFilter = document.getElementById("statusFilter");

  if (!monthFilter || !statusFilter) return;

  const selectedMonth = monthFilter.value.toLowerCase();
  const selectedStatus = statusFilter.value.toLowerCase();

  // Fetch data and apply filter
  Promise.all([
    firebase.database().ref("gaddi").once("value"),
    firebase.database().ref("gaddiPlus").once("value"),
    firebase.database().ref("glafi").once("value"),
  ])
    .then(([gaddiSnapshot, gaddiPlusSnapshot, glafiSnapshot]) => {
      let allData = [];

      // Process GADDI data
      gaddiSnapshot.forEach((child) => {
        const data = child.val();
        if (
          data &&
          data.id &&
          data.product &&
          data.option &&
          data.amount &&
          data.status &&
          ((data.firstName && data.lastName) || data.name)
        ) {
          allData.push({
            id: data.id,
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            name: data.name || "",
            product: data.product,
            option: data.option,
            amount: data.amount,
            status: data.status,
            createdAt: data.createdAt,
            source: "gaddi",
          });
        }
      });

      // Process GADDI Plus data
      gaddiPlusSnapshot.forEach((child) => {
        const data = child.val();
        if (
          data &&
          data.id &&
          data.product &&
          data.option &&
          data.amount &&
          data.status &&
          ((data.firstName && data.lastName) || data.name)
        ) {
          allData.push({
            id: data.id,
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            name: data.name || "",
            product: data.product,
            option: data.option,
            amount: data.amount,
            status: data.status,
            createdAt: data.createdAt,
            source: "gaddiPlus",
          });
        }
      });

      // Process GLAFI data
      glafiSnapshot.forEach((child) => {
        const data = child.val();
        if (
          data &&
          data.id &&
          data.product &&
          data.option &&
          data.amount &&
          data.status &&
          ((data.firstName && data.lastName) || data.name)
        ) {
          allData.push({
            id: data.id,
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            name: data.name || "",
            product: data.product,
            option: data.option,
            amount: data.amount,
            status: data.status,
            createdAt: data.createdAt,
            source: "glafi",
          });
        }
      });

      // Apply month filter
      if (selectedMonth && selectedMonth !== "all") {
        allData = allData.filter((item) => {
          if (!item.createdAt) return false;

          const createdDate = new Date(item.createdAt);
          const monthName = createdDate
            .toLocaleString("en-US", { month: "long" })
            .toLowerCase();

          return monthName === selectedMonth;
        });
      }

      // Apply status filter
      if (selectedStatus && selectedStatus !== "all") {
        allData = allData.filter((item) => {
          const itemStatus = item.status.toLowerCase();
          if (selectedStatus === "overdue") {
            return itemStatus.includes("overdue");
          } else if (selectedStatus === "upcoming") {
            return itemStatus.includes("upcoming");
          } else if (selectedStatus === "renewed") {
            return itemStatus.includes("renewed");
          }
          return true;
        });
      }

      // Sort by ID
      allData.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));

      // Update summary card counters with filtered data
      updateSummaryCardCounters(allData);

      // Display filtered data
      displayAllDataInTable(allData);
    })
    .catch((error) => {
      console.error("Error filtering data:", error);
    });
}

// Update summary card counters based on data
function updateSummaryCardCounters(allData) {
  let upcomingDueCount = 0;
  let overdueCount = 0;
  let inactiveCount = 0;
  let renewalCount = 0;

  allData.forEach((item) => {
    const status = item.status.toLowerCase();
    if (status.includes("upcoming")) {
      upcomingDueCount++;
    } else if (status.includes("overdue")) {
      overdueCount++;
    } else if (status.includes("inactive")) {
      inactiveCount++;
    } else if (status.includes("renewed")) {
      renewalCount++;
    }
  });

  // Update the counter elements
  const upcomingDueCard = document.querySelector(
    "#home-section .summary-cards .card.upcoming-due .card-number"
  );
  const overdueCard = document.querySelector(
    "#home-section .summary-cards .card.overdue .card-number"
  );
  const inactiveCard = document.querySelector(
    "#home-section .summary-cards .card.inactive .card-number"
  );
  const renewalCard = document.querySelector(
    "#home-section .summary-cards .card.renewal .card-number"
  );

  if (upcomingDueCard) upcomingDueCard.textContent = upcomingDueCount;
  if (overdueCard) overdueCard.textContent = overdueCount;
  if (inactiveCard) inactiveCard.textContent = inactiveCount;
  if (renewalCard) renewalCard.textContent = renewalCount;
}

// Set up real-time listeners for home section updates
function setupHomeSectionRealTimeListeners() {
  // Listen to GADDI changes
  firebase
    .database()
    .ref("gaddi")
    .on("value", function () {
      fetchAndDisplayAllData();
    });

  // Listen to GADDI Plus changes
  firebase
    .database()
    .ref("gaddiPlus")
    .on("value", function () {
      fetchAndDisplayAllData();
    });

  // Listen to GLAFI changes
  firebase
    .database()
    .ref("glafi")
    .on("value", function () {
      fetchAndDisplayAllData();
    });
}

// --- Robust real-time listener for Collection section charts ---
let transactionsChartListener = null;
function setupCollectionChartsRealtimeListener() {
  // Remove previous listener if any
  if (transactionsChartListener) {
    firebase
      .database()
      .ref("transactions")
      .off("value", transactionsChartListener);
    transactionsChartListener = null;
  }
  // Only set up listener if both charts exist
  if (!window.revenueChart || !window.transactionsChart) {
    setTimeout(setupCollectionChartsRealtimeListener, 300);
    return;
  }
  const monthsArr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  transactionsChartListener = function (snapshot) {
    let revenuePerMonth = Array(12).fill(0);
    let transactionsPerMonth = Array(12).fill(0);
    snapshot.forEach((child) => {
      const d = child.val();
      if (d && d.amount && d.date) {
        let dateObj = null;
        if (d.date.includes("T")) {
          dateObj = new Date(d.date);
        } else {
          dateObj = new Date(d.date + "T00:00:00");
        }
        if (!isNaN(dateObj)) {
          const monthIdx = dateObj.getMonth();
          let amt = d.amount;
          if (typeof amt === "string") {
            amt = amt.replace(/[^\d.]/g, "");
            amt = parseFloat(amt);
          }
          if (!isNaN(amt)) {
            revenuePerMonth[monthIdx] += amt;
          }
          transactionsPerMonth[monthIdx]++;
        }
      }
    });
    if (window.revenueChart) {
      window.revenueChart.data.labels = monthsArr;
      window.revenueChart.data.datasets[0].data = revenuePerMonth;
      window.revenueChart.update();
    }
    if (window.transactionsChart) {
      window.transactionsChart.data.labels = monthsArr;
      window.transactionsChart.data.datasets[0].data = transactionsPerMonth;
      window.transactionsChart.update();
    }
  };
  firebase
    .database()
    .ref("transactions")
    .on("value", transactionsChartListener);
}

// Initialize everything when DOM is loaded

document.addEventListener("DOMContentLoaded", function () {
  initializeCharts();
  populateTable("weekly");
  listenToGaddiTableData();
  setupGaddiDropdownFilterListener();
  listenToGaddiPlusTableData();
  setupGaddiPlusDropdownFilterListener();
  listenToGlafiTableData();
  setupGlafiDropdownFilterListener();

  // Initialize static filter for GADDI table
  filterStaticGaddiTable();
  filterStaticGaddiPlusTable();
  filterStaticGlafiTable();

  // Fetch and display all data in home section
  fetchAndDisplayAllData();

  // Set up filter event listeners for home section
  const monthFilter = document.getElementById("monthFilter");
  const statusFilter = document.getElementById("statusFilter");

  if (monthFilter) {
    monthFilter.addEventListener("change", filterHomeSectionData);
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", filterHomeSectionData);
  }

  const dropdownItems = document.querySelectorAll(".gdash-dropdown-content a");
  const dropdownButton = document.querySelector(".gdash-dropdown-button");

  dropdownItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const period = this.getAttribute("data-period");

      // Update dropdown button text
      dropdownButton.textContent = this.textContent + " ▾";

      // Update active state
      dropdownItems.forEach((i) => i.classList.remove("active"));
      this.classList.add("active");

      // Update chart data
      transactionsChart.data = getChartData(period);
      transactionsChart.update();

      // Update table data
      populateTable(period);
    });
  });

  // Set weekly as active by default
  document
    .querySelector('.gdash-dropdown-content a[data-period="weekly"]')
    .classList.add("active");

  // Event listeners for notifications
  document
    .getElementById("delete-selected")
    .addEventListener("click", deleteSelectedNotifications);
  document
    .getElementById("mark-all-read")
    .addEventListener("click", markAllAsRead);

  // Hover effect for delete buttons
  document.querySelectorAll(".notification-item").forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.querySelector(".notification-delete").style.opacity = "1";
    });
    item.addEventListener("mouseleave", function () {
      this.querySelector(".notification-delete").style.opacity = "0";
    });
  });

  // Set up real-time listeners for home section updates
  setupHomeSectionRealTimeListeners();

  // Home dashboard charts (line charts)
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  window.upcomingDueChartInstance = new Chart(
    document.getElementById("upcomingDueChart").getContext("2d"),
    {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Upcoming Due",
            data: Array(12).fill(0),
            fill: true,
            tension: 0.4,
            backgroundColor: "#ffb74d33",
            borderColor: "#ffb74d",
            pointBackgroundColor: "#ffb74d",
            pointBorderColor: "#ffb74d",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                if (Number.isInteger(value)) return value;
                return null;
              },
            },
          },
        },
      },
    }
  );
  window.overdueChartInstance = new Chart(
    document.getElementById("overdueChart").getContext("2d"),
    {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Overdue",
            data: Array(12).fill(0),
            fill: true,
            tension: 0.4,
            backgroundColor: "#ef535033",
            borderColor: "#ef5350",
            pointBackgroundColor: "#ef5350",
            pointBorderColor: "#ef5350",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                if (Number.isInteger(value)) return value;
                return null;
              },
            },
          },
        },
      },
    }
  );
  window.inactiveChartInstance = new Chart(
    document.getElementById("inactiveChart").getContext("2d"),
    {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Inactive",
            data: Array(12).fill(0),
            fill: true,
            tension: 0.4,
            backgroundColor: "#90a4ae33",
            borderColor: "#90a4ae",
            pointBackgroundColor: "#90a4ae",
            pointBorderColor: "#90a4ae",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                if (Number.isInteger(value)) return value;
                return null;
              },
            },
          },
        },
      },
    }
  );
  window.renewalChartInstance = new Chart(
    document.getElementById("renewalChart").getContext("2d"),
    {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Renewal",
            data: Array(12).fill(0),
            fill: true,
            tension: 0.4,
            backgroundColor: "#66bb6a33",
            borderColor: "#66bb6a",
            pointBackgroundColor: "#66bb6a",
            pointBorderColor: "#66bb6a",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                if (Number.isInteger(value)) return value;
                return null;
              },
            },
          },
        },
      },
    }
  );

  // Commission Add Modal event listeners
  const commissionAddBtn = document.querySelector(
    "#commission-fab-container .commadd"
  );
  const commissionUpdateBtn = document.querySelector(
    "#commission-fab-container .commupdate"
  );
  const commissionModal = document.getElementById("commissionModal");
  const commissionAddForm = document.getElementById("commissionAddForm");
  const commissionUpdateModal = document.getElementById(
    "commissionUpdateModal"
  );
  const commissionUpdateForm = document.getElementById("commissionUpdateForm");
  if (commissionAddBtn && commissionModal && commissionAddForm) {
    commissionAddBtn.addEventListener("click", function () {
      // Auto-generate Agent ID
      const nextId = (getMaxAgentId() + 1).toString().padStart(4, "0");
      commissionAddForm.agentId.value = nextId;
      commissionAddForm.agentId.readOnly = true;
      openCommissionModal();
    });
    commissionModal
      .querySelector(".modal-close")
      .addEventListener("click", closeCommissionModal);
    commissionAddForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      // Get form values
      const agentId = commissionAddForm.agentId.value;
      const firstName = commissionAddForm.firstName.value;
      const lastName = commissionAddForm.lastName.value;
      // Store in Firebase Realtime Database
      try {
        await firebase
          .database()
          .ref("agents/" + agentId)
          .set({
            agentId,
            firstName,
            lastName,
            numberOfInvites: 0,
            commission: 0,
            metrics: 0,
            createdAt: new Date().toISOString(),
          });
        // (Table will update automatically via real-time listener)
        commissionAddForm.reset();
        closeCommissionModal();
        alert("Agent added successfully!");
      } catch (err) {
        alert("Failed to add agent to Firebase: " + err.message);
      }
    });
  }
  // Update Agent Modal event listeners
  if (commissionUpdateBtn && commissionUpdateModal && commissionUpdateForm) {
    commissionUpdateBtn.addEventListener("click", async function () {
      // Populate agent select dropdown
      const select = commissionUpdateForm.agentId;
      select.innerHTML = '<option value="">Select Agent</option>';
      let agentData = {};
      try {
        const snapshot = await firebase.database().ref("agents").once("value");
        snapshot.forEach((child) => {
          const data = child.val();
          if (data && data.agentId) {
            agentData[data.agentId] = data;
            select.innerHTML += `<option value='${data.agentId}'>${data.agentId} - ${data.firstName} ${data.lastName}</option>`;
          }
        });
      } catch (err) {}
      // When an agent is selected, prefill the form
      select.onchange = function () {
        const data = agentData[select.value];
        if (data) {
          commissionUpdateForm.firstName.value = data.firstName;
          commissionUpdateForm.lastName.value = data.lastName;
        } else {
          commissionUpdateForm.firstName.value = "";
          commissionUpdateForm.lastName.value = "";
        }
      };
      openCommissionUpdateModal();
    });
    commissionUpdateModal
      .querySelector(".modal-close")
      .addEventListener("click", closeCommissionUpdateModal);
    commissionUpdateForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const agentId = commissionUpdateForm.agentId.value;
      const firstName = commissionUpdateForm.firstName.value;
      const lastName = commissionUpdateForm.lastName.value;
      if (!agentId) {
        alert("Please select an agent to update.");
        return;
      }
      try {
        await firebase
          .database()
          .ref("agents/" + agentId)
          .update({ firstName, lastName });
        closeCommissionUpdateModal();
        alert("Agent updated successfully!");
      } catch (err) {
        alert("Failed to update agent: " + err.message);
      }
    });
  }

  // Fetch and render all agents from Firebase in real-time
  listenToAgentsTable();
  // Fetch and render all agents from Firebase in real-time for both tables
  listenToAgentsTables();

  // Fetch and display all transactions in Collection section on page load
  fetchAndDisplayAllTransactions();
  // Add event listener to Collection menu item to refresh transactions when navigating
  const collectionMenuItem = document.querySelector(
    ".sidebar-menu .menu-item[onclick*=\"showSection('collection-section')\"]"
  );
  if (collectionMenuItem) {
    collectionMenuItem.addEventListener(
      "click",
      fetchAndDisplayAllTransactions
    );
  }

  // Set up real-time listeners for home section updates
  setupHomeSectionRealTimeListeners();

  // --- Add this: update Collection charts with real transaction data ---
  updateCollectionChartsWithTransactions();

  setupCollectionChartsRealtimeListener();
});

// Place the new function after updateSummaryCardCounters
function updateHomeDashboardCharts(allData) {
  // Prepare months
  const monthsArr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  // Initialize counts for each status
  const statusCounts = {
    upcoming: Array(12).fill(0),
    overdue: Array(12).fill(0),
    inactive: Array(12).fill(0),
    renewed: Array(12).fill(0),
  };
  // Get current year
  const currentYear = new Date().getFullYear();
  // Aggregate counts
  allData.forEach((item) => {
    if (!item.createdAt) return;
    const date = new Date(item.createdAt);
    if (date.getFullYear() !== currentYear) return;
    const monthIdx = date.getMonth();
    const status = item.status.toLowerCase();
    if (status.includes("upcoming")) statusCounts.upcoming[monthIdx]++;
    else if (status.includes("overdue")) statusCounts.overdue[monthIdx]++;
    else if (status.includes("inactive")) statusCounts.inactive[monthIdx]++;
    else if (status.includes("renewed")) statusCounts.renewed[monthIdx]++;
  });
  // Update each chart
  if (window.upcomingDueChartInstance) {
    window.upcomingDueChartInstance.data.labels = monthsArr;
    window.upcomingDueChartInstance.data.datasets[0].data =
      statusCounts.upcoming;
    window.upcomingDueChartInstance.update();
  }
  if (window.overdueChartInstance) {
    window.overdueChartInstance.data.labels = monthsArr;
    window.overdueChartInstance.data.datasets[0].data = statusCounts.overdue;
    window.overdueChartInstance.update();
  }
  if (window.inactiveChartInstance) {
    window.inactiveChartInstance.data.labels = monthsArr;
    window.inactiveChartInstance.data.datasets[0].data = statusCounts.inactive;
    window.inactiveChartInstance.update();
  }
  if (window.renewalChartInstance) {
    window.renewalChartInstance.data.labels = monthsArr;
    window.renewalChartInstance.data.datasets[0].data = statusCounts.renewed;
    window.renewalChartInstance.update();
  }
}

// Commission Add Modal logic
function openCommissionModal() {
  document.getElementById("commissionModal").classList.add("active");
}
function closeCommissionModal() {
  document.getElementById("commissionModal").classList.remove("active");
}

// Utility: Get the max Agent ID from the Agents table
function getMaxAgentId() {
  const tbody = document.querySelector(
    ".commission-half-box .commission-table tbody"
  );
  let maxId = 0;
  if (!tbody) return maxId;
  tbody.querySelectorAll("tr").forEach((row) => {
    const idCell = row.querySelector("td");
    if (idCell) {
      const val = parseInt(idCell.textContent, 10);
      if (!isNaN(val) && val > maxId) maxId = val;
    }
  });
  return maxId;
}

// Fetch and render all agents from Firebase in real-time
function listenToAgentsTable() {
  const tbody = document.querySelector(
    ".commission-half-box .commission-table tbody"
  );
  if (!tbody) return;
  firebase
    .database()
    .ref("agents")
    .on("value", (snapshot) => {
      tbody.innerHTML = "";
      snapshot.forEach((child) => {
        const data = child.val();
        if (data && data.agentId && data.firstName && data.lastName) {
          const tr = document.createElement("tr");
          tr.innerHTML = `<td>${data.agentId}</td><td>${data.firstName} ${
            data.lastName
          }</td><td>${data.numberOfInvites || 0}</td><td>${
            data.commission || 0
          }</td><td>${data.metrics || 0}</td>`;
          tbody.appendChild(tr);
        }
      });
    });
}

// Fetch and render all agents from Firebase in real-time for both tables
function listenToAgentsTables() {
  // Full-width Agent Reports table
  const fullTbody = document.getElementById("commissionTableBody");
  // Bottom left Agents table
  const leftTbody = document.querySelector(
    ".gray-boxes-container > .gray-box.commission-half-box.scrollable table.commission-table tbody"
  );
  if (!fullTbody || !leftTbody) return;
  firebase
    .database()
    .ref("agents")
    .on("value", (snapshot) => {
      // Populate full-width table
      fullTbody.innerHTML = "";
      // Populate left table
      leftTbody.innerHTML = "";
      snapshot.forEach((child) => {
        const data = child.val();
        if (data && data.agentId && data.firstName && data.lastName) {
          // Full-width table: all fields
          const trFull = document.createElement("tr");
          trFull.innerHTML = `<td>${data.agentId}</td><td>${
            data.firstName
          }</td><td>${data.lastName}</td><td>${
            data.numberOfInvites || 0
          }</td><td>${data.commission || 0}</td><td>${data.metrics || 0}</td>`;
          fullTbody.appendChild(trFull);
          // Left table: only ID and full name
          const trLeft = document.createElement("tr");
          trLeft.innerHTML = `<td>${data.agentId}</td><td>${data.firstName} ${data.lastName}</td>`;
          leftTbody.appendChild(trLeft);
        }
      });
    });
}

// Add modal open/close helpers
function openCommissionUpdateModal() {
  document.getElementById("commissionUpdateModal").classList.add("active");
}
function closeCommissionUpdateModal() {
  document.getElementById("commissionUpdateModal").classList.remove("active");
}

// --- Add this function to fetch and display all transactions from /transactions in the Collection section history table ---
let transactionsListener = null;
function fetchAndDisplayAllTransactions() {
  const tbody = document.querySelector(
    "#collection-section .gdash-history-box .gdash-table-scroll-wrapper .gdash-table tbody"
  );
  if (!tbody) return;
  tbody.innerHTML =
    '<tr><td colspan="7" style="text-align:center; color:#888; padding:20px;">Loading...</td></tr>';
  // Remove previous listener if any
  if (transactionsListener) {
    firebase.database().ref("transactions").off("value", transactionsListener);
  }
  transactionsListener = function (snapshot) {
    let all = [];
    snapshot.forEach((child) => {
      const d = child.val();
      if (
        d &&
        d.id &&
        d.firstName !== undefined &&
        d.lastName !== undefined &&
        d.product &&
        d.option &&
        d.amount &&
        d.date
      ) {
        all.push({
          id: d.id,
          lastName: d.lastName,
          firstName: d.firstName,
          product: d.product,
          option: d.option,
          payment: d.amount,
          date: d.date ? d.date.split("T")[0] : "",
        });
      }
    });
    // Sort by date descending
    all.sort((a, b) => (a.date < b.date ? 1 : -1));
    tbody.innerHTML = "";
    if (all.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="7" style="text-align:center; color:#888; padding:20px;">No transactions found</td></tr>';
      return;
    }
    all.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${item.id}</td><td>${item.lastName}</td><td>${item.firstName}</td><td>${item.product}</td><td>${item.option}</td><td>₱${item.payment}</td><td>${item.date}</td>`;
      tbody.appendChild(tr);
    });
  };
  firebase.database().ref("transactions").on("value", transactionsListener);
}

// --- Add this function to update Collection section charts with real transaction data ---
function updateCollectionChartsWithTransactions() {
  // Prepare months
  const monthsArr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  // Initialize revenue and transaction counts
  let revenuePerMonth = Array(12).fill(0);
  let transactionsPerMonth = Array(12).fill(0);

  firebase
    .database()
    .ref("transactions")
    .on("value", (snapshot) => {
      // Reset arrays each time
      revenuePerMonth = Array(12).fill(0);
      transactionsPerMonth = Array(12).fill(0);
      snapshot.forEach((child) => {
        const d = child.val();
        if (d && d.amount && d.date) {
          // Parse date
          let dateObj = null;
          if (d.date.includes("T")) {
            dateObj = new Date(d.date);
          } else {
            // Fallback: try parsing as yyyy-mm-dd
            dateObj = new Date(d.date + "T00:00:00");
          }
          if (!isNaN(dateObj)) {
            const monthIdx = dateObj.getMonth();
            // Parse amount (remove ₱ and commas if present)
            let amt = d.amount;
            if (typeof amt === "string") {
              amt = amt.replace(/[^\d.]/g, "");
              amt = parseFloat(amt);
            }
            if (!isNaN(amt)) {
              revenuePerMonth[monthIdx] += amt;
            }
            transactionsPerMonth[monthIdx]++;
          }
        }
      });
      // Only update if charts are defined
      if (window.revenueChart) {
        window.revenueChart.data.labels = monthsArr;
        window.revenueChart.data.datasets[0].data = revenuePerMonth;
        window.revenueChart.update();
      }
      if (window.transactionsChart) {
        window.transactionsChart.data.labels = monthsArr;
        window.transactionsChart.data.datasets[0].data = transactionsPerMonth;
        window.transactionsChart.update();
      }
    });
}

// Add this function to update user name in sidebar and header
async function updateDashboardUserName() {
  const user = firebase.auth().currentUser;
  if (!user) return;
  // Try to fetch user data from /users/{uid}
  const userRef = firebase.database().ref("users/" + user.uid);
  const snapshot = await userRef.once("value");
  let fullName = user.email;
  let role = "User";
  if (snapshot.exists()) {
    const data = snapshot.val();
    if (data.firstName || data.lastName) {
      fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();
    } else if (data.fullName) {
      fullName = data.fullName;
    } else if (data.email) {
      fullName = data.email;
    }
    if (data.role) {
      role = data.role.charAt(0).toUpperCase() + data.role.slice(1);
    }
  }
  // Sidebar name
  const sidebarSpan = document.querySelector(".user-profile .user-info span");
  if (sidebarSpan) sidebarSpan.textContent = fullName;
  // Sidebar role
  const sidebarRole = document.querySelector(".user-profile .user-info small");
  if (sidebarRole) sidebarRole.textContent = role;
  // Header
  const welcomeText = document.querySelector(".header-text .welcome-text");
  if (welcomeText) welcomeText.textContent = `Welcome, ${fullName}!`;
}

// ... existing code ...
// Attach to auth state
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    updateDashboardUserName();
    // ... (other logic can remain here)
  }
});
// ... existing code ...

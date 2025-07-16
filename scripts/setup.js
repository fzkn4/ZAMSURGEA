// setup.js - For future interactivity on setup.html

document.addEventListener("DOMContentLoaded", function () {
  const account = JSON.parse(localStorage.getItem("signupAccount") || "{}");
  if (account.email) document.getElementById("email").value = account.email;
  if (account.phone) document.getElementById("phone").value = account.phone;
  if (account.password)
    document.getElementById("password").value = account.password;
});

document.getElementById("setupNext").addEventListener("click", function () {
  const data = {
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    password: document.getElementById("password").value,
  };
  localStorage.setItem("signupAccount", JSON.stringify(data));
  window.location.href = "coverage.html";
});

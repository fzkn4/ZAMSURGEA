// signup2.js - For future interactivity on signup2.html

document.addEventListener("DOMContentLoaded", function () {
  const profile = JSON.parse(localStorage.getItem("signupProfile") || "{}");
  if (profile.firstName)
    document.getElementById("firstName").value = profile.firstName;
  if (profile.lastName)
    document.getElementById("lastName").value = profile.lastName;
  if (profile.middleName)
    document.getElementById("middleName").value = profile.middleName;
  if (profile.suffix) document.getElementById("suffix").value = profile.suffix;
  if (profile.motherMaidenName)
    document.getElementById("motherMaidenName").value =
      profile.motherMaidenName;
  if (profile.dob) document.getElementById("dob").value = profile.dob;
  if (profile.citizenship)
    document.getElementById("citizenship").value = profile.citizenship;
});

document.getElementById("signup2Next").addEventListener("click", function () {
  const data = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    middleName: document.getElementById("middleName").value,
    suffix: document.getElementById("suffix").value,
    motherMaidenName: document.getElementById("motherMaidenName").value,
    dob: document.getElementById("dob").value,
    citizenship: document.getElementById("citizenship").value,
  };
  localStorage.setItem("signupProfile", JSON.stringify(data));
  window.location.href = "setup.html";
});

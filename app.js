function startApp() {
  const title = document.getElementById("animated-title");
  setTimeout(() => {
    document.getElementById("main-content").style.display = "block";
  }, 2000); // Show content after title animates
}

function showTemplatePicker() {
  document.getElementById("template-picker").classList.remove("hidden");
}

function createNote(type) {
  localStorage.setItem("note_type", type);
  window.location.href = "editor.html"; // You’ll build this next!
}

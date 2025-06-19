function login() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;

  if (!user || !pass) {
    alert("Please enter both username and password!");
    return;
  }

  localStorage.setItem("smartnotes_user", user);
  // You could also verify here with a backend in future
  location.href = "notes.html";
}

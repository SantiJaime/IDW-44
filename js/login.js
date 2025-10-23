const adminUser = {
  username: "admin",
  password: "admin123",
};

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  
  if (username === adminUser.username && password === adminUser.password) {
    localStorage.setItem("admin", JSON.stringify(adminUser))
    window.location.href = "admin.html";
  } else {
    Swal.fire({
      icon: "error",
      title: "Algo salió mal",
      text: "Usuario y/o contraseña incorrectos",
    });
  }
});

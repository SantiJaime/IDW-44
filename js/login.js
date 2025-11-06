const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const usernameInput = document.getElementById("username").value;
  const passwordInput = document.getElementById("password").value;

  fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: usernameInput,
      password: passwordInput,
      expiresInMins: 30
    })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Credenciales incorrectas');
      }
      return res.json();
    })
    .then(data => {

      sessionStorage.setItem("token", data.accessToken);
      sessionStorage.setItem("userId", data.id);
      sessionStorage.setItem("username", data.username);
      window.location.href = "admin.html";
    })
    .catch(error => {
      console.error('Error en el login:', error);
      Swal.fire({
        icon: "error",
        title: "Algo salió mal",
        text: "Usuario y/o contraseña incorrectos",
      });
    });
});
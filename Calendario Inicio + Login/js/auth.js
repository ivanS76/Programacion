document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  // REGISTRO DE USUARIO
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      let users = JSON.parse(localStorage.getItem("users")) || [];

      // Verificar si el email ya está registrado
      if (users.find(u => u.email === email)) {
        alert("Este correo ya está registrado.");
        return;
      }

      // Guardar nuevo usuario
      users.push({ email, password });
      localStorage.setItem("users", JSON.stringify(users));

      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      window.location.href = "login.html";
    });
  }

  // INICIO DE SESIÓN
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        window.location.href = "../html/calendario_mes.html"; // Asegurate de que este archivo exista
      } else {
        alert("Correo o contraseña incorrectos.");
      }
    });
  }
});

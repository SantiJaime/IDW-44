if (!sessionStorage.getItem("token")) {
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  cargarUsuarios();
});

function cargarUsuarios() {
  fetch('https://dummyjson.com/users')
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error('No se pudieron cargar los usuarios');
      }
    })
    .then(data => {
      displayUsuarios(data.users);
    })
    .catch(error => {
      console.error('Error fetching users:', error);
      const tableBody = document.getElementById("usuarios-table-body");
      tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Error al cargar usuarios.</td></tr>`;
    });
}

function displayUsuarios(usuarios) {
  const tableBody = document.getElementById("usuarios-table-body");
  tableBody.innerHTML = "";

  if (usuarios && usuarios.length > 0) {
    usuarios.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.firstName}</td>
        <td>${user.lastName}</td>
        <td>${user.email}</td>
        <td>${user.username}</td>
        <td>${user.phone}</td>
      `;
      tableBody.appendChild(row);
    });
  } else {
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center">No se encontraron usuarios.</td></tr>`;
  }
}
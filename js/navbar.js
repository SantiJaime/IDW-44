function logOut() {
  localStorage.removeItem("admin");

  const pathName = window.location.pathname;
  const isInsideHtmlFolder = pathName.includes("/html/");
  
  window.location.href = isInsideHtmlFolder ? "../index.html" : "index.html";
}

function renderNavbar() {
  const pathName = window.location.pathname;
  const isInsideHtmlFolder = pathName.includes("/html/");

  let logoImgSrc;
  let indexHref;
  let contactoHref;
  let institucionalHref;
  let loginHref;
  let adminHref;

  if (isInsideHtmlFolder) {
    const rootPath = "../";

    logoImgSrc = rootPath + "img/logo.png";
    indexHref = rootPath + "index.html";

    contactoHref = "contacto.html";
    institucionalHref = "institucional.html";
    loginHref = "login.html";
    adminHref = "admin.html";
  } else {
    logoImgSrc = "img/logo.png";

    indexHref = "index.html";
    contactoHref = "html/contacto.html";
    institucionalHref = "html/institucional.html";
    loginHref = "html/login.html";
    adminHref = "html/admin.html";
  }

  const isActive = (fileName) => (pathName.includes(fileName) ? " active" : "");

  const isLoggedIn = JSON.parse(localStorage.getItem("admin"));

  const adminLink = isLoggedIn
    ? `<li class="nav-item">
                <a class="nav-link${isActive(
                  "admin.html"
                )}" href="${adminHref}">Panel de administrador</a>
              </li>`
    : `<li class="nav-item">
                <a class="nav-link${isActive(
                  "login.html"
                )}" href="${loginHref}">Acceso de administradores</a>
              </li>`;

  const logOutButton = isLoggedIn
    ? `<button class="btn btn-danger" onclick="logOut()">Cerrar sesión</button>`
    : "";

  const navbarHTML = `
    <nav class="navbar nav-color fixed-top p-1">
      <div class="container-fluid">
        <a href="${indexHref}">
          <img src="${logoImgSrc}" alt="Centro médico IDW-44" width="100" />
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          class="offcanvas offcanvas-end"
          tabindex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasNavbarLabel">IDW-44</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div class="offcanvas-body">
            <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li class="nav-item">
                <a class="nav-link${isActive(
                  "index.html"
                )}" aria-current="page" href="${indexHref}">Inicio</a>
              </li>
              <li class="nav-item">
                <a class="nav-link${isActive(
                  "contacto.html"
                )}" href="${contactoHref}">Contacto</a>
              </li>
              <li class="nav-item">
                <a class="nav-link${isActive(
                  "institucional.html"
                )}" href="${institucionalHref}">Institucional</a>
              </li>
              ${adminLink}
              ${logOutButton}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  `;

  const navbarContainer = document.getElementById("navbar-container");
  navbarContainer.innerHTML = navbarHTML;
}
document.addEventListener("DOMContentLoaded", renderNavbar);

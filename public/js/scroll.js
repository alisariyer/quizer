window.addEventListener("DOMContentLoaded", (e) => {
  const navbar = document.querySelector(".navbar-scroll");
  const btnMenus = document.querySelectorAll(".btn-menu");
  const menuToggle = document.querySelector(".menu-toggle");
  let isMenuToggled = false;
  let rectButton = document
    .querySelector(".btn-menu-main")
    .getBoundingClientRect();
  let rectBody = document.body.getBoundingClientRect();
  menuToggle.style.top = `${rectButton.bottom + 6}px`;
  menuToggle.style.right = `${
    rectBody.right - rectButton.left - rectButton.width
  }px`;

  btnMenus.forEach((btn) =>
    btn.addEventListener("click", () => {
      console.log(isMenuToggled);
      if (isMenuToggled) {
        menuToggle.classList.add("d-none");
        isMenuToggled = !isMenuToggled;
      } else {
        menuToggle.classList.remove("d-none");
        isMenuToggled = !isMenuToggled;
      }
    })
  );

  document.addEventListener("scroll", (e) => {
    if (window.scrollY > 60) {
      navbar.classList.remove("d-none");
      menuToggle.style.top = `${rectButton.bottom}px`;
    } else {
      navbar.classList.add("d-none");
      menuToggle.style.top = `${rectButton.bottom + 6}px`;
    }
  });

  window.addEventListener("resize", (e) => {
    rectButton = document
      .querySelector(".btn-menu-main")
      .getBoundingClientRect();
    rectBody = document.body.getBoundingClientRect();
    menuToggle.style.top = `${rectButton.bottom + 6}px`;
    menuToggle.style.right = `${
      rectBody.right - rectButton.left - rectButton.width
    }px`;
  });
});

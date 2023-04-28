window.addEventListener("DOMContentLoaded", (e) => {
  const navbar = document.querySelector(".navbar-scroll");

  // corner menu button
  const btnMenus = document.querySelectorAll(".btn-menu");
  const menuToggle = document.querySelector(".menu-toggle");

  // flag to use if menu opened or not in case of scrolled navbar menu button clicked again
  let isMenuToggled = false;

  // menu button coordinates to place toggle menu by these values
  let rectButton = document
    .querySelector(".btn-menu-main")
    .getBoundingClientRect();

  // body coordinates in order to get total width by using right property
  let rectBody = document.body.getBoundingClientRect();

  // set toggle menu display top value to below menu button plus a bit of space
  menuToggle.style.top = `${rectButton.bottom + 6}px`;

  // set menu display right value by body width minus menu button width
  // note that display right is distance by right side not from left to right distance
  menuToggle.style.right = `${
    rectBody.right - rectButton.left - rectButton.width
  }px`;

  // add click event for both menu button
  btnMenus.forEach((btn) =>
    btn.addEventListener("click", () => {
      // if menu is opened hide it and reverse logic
      if (isMenuToggled) {
        menuToggle.classList.add("d-none");
        isMenuToggled = !isMenuToggled;

        // else show etc.
      } else {
        menuToggle.classList.remove("d-none");
        isMenuToggled = !isMenuToggled;
      }
    })
  );

  // in case of scrolling manage hidden navbar
  // and change top value of menu
  document.addEventListener("scroll", (e) => {
    if (window.scrollY > 60) {
      navbar.classList.remove("d-none");
      menuToggle.style.top = `${rectButton.bottom}px`;
    } else {
      navbar.classList.add("d-none");
      menuToggle.style.top = `${rectButton.bottom + 6}px`;
    }
  });

  // in case of resize of window update menu top and right value
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

window.addEventListener("DOMContentLoaded", (e) => {
  const navbar = document.querySelector(".navbar-scroll");
  const btnMenus = document.querySelectorAll(".btn-menu");
  const menuToggle = document.querySelector(".menu-toggle");
  let isMenuToggled = false;

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
    console.log("window.innerHeight: ", window.innerHeight);
    console.log("window.scrollY: ", window.scrollY);
    console.log("document.body.offsetTop", document.body.offsetTop);
    console.log("document.body.offsetHeight", document.body.offsetHeight);
    if (window.scrollY > 60) {
      navbar.classList.remove("d-none");
      menuToggle.style.top = `${window.scrollY + 60}px`;
    } else {
      navbar.classList.add("d-none");
      menuToggle.style.top = `${64}px`;
    }
  });
});


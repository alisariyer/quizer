const navbar = document.querySelector(".navbar-scroll");
document.addEventListener("DOMContentLoaded", (e) => {
  document.addEventListener("scroll", (e) => {
    console.log("window.innerHeight: ", window.innerHeight);
    console.log("window.scrollY: ", window.scrollY);
    console.log("document.body.offsetTop", document.body.offsetTop);
    console.log("document.body.offsetHeight", document.body.offsetHeight);
    if (window.scrollY > 60) {
      navbar.classList.remove("hidden");
    } else {
      navbar.classList.add("hidden");
    }
  });
});

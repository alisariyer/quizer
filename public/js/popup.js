const popup = document.querySelector(".popup");
const popupP = document.querySelector(".popup p");

const showTempPopup = (message = "Checking...") => {
  popupP.innerText = message;
  popup.classList.remove("d-none");
  popup.classList.add("animation-running");
  setTimeout(() => {
    popup.classList.add("d-none");
    popup.classList.remove("animation-running");
    popupP.innerText = "";
  }, 1200);
};

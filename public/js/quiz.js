window.addEventListener("DOMContentLoaded", (e) => {
  const answers = document.querySelectorAll(".question__answer");
  answers.forEach((answer) =>
    answer.addEventListener("click", (e) => {
      if (e.target.classList.contains("question__answered")) {
        e.target.classList.remove("question__answered");
      } else {
        e.target.classList.add("question__answered");
      }
    })
  );
});

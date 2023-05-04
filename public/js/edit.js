window.addEventListener("DOMContentLoaded", (e) => {
  const form = document.querySelector(".form-edit");
  const questionID = form.dataset.id;

  const getUpdatedQuestion = () => {
    return {
      question: form.elements.question.value,
      answers: [
        form.elements["answers[0]"].value,
        form.elements["answers[1]"].value,
        form.elements["answers[2]"].value,
        form.elements["answers[3]"].value,
      ],
      correct: parseInt(form.elements.correct.value),
    };
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log(getUpdatedQuestion());
    const response = await fetch(`/questions/question/${questionID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(getUpdatedQuestion()),
    });
    const { message } = await response.json();
    showTempPopup(message);
  });
});

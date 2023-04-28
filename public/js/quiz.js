window.addEventListener("DOMContentLoaded", (e) => {
  // answer list items
  const answers = document.querySelectorAll(".question__answer");

  // question list
  const questions = document.querySelectorAll(".question__list");

  // to keep selected list items by pairing question list
  // use question list data-id dataset and list item data-choice dataset
  const selectedAnswers = [];

  // initial selected answers list
  // if not selected answer is -1
  questions.forEach((question) =>
    selectedAnswers.push({
      id: question.dataset.id,
      answer: "-1",
    })
  );

  // helper class to clean up selected styling
  // remove question__answered class from all
  const clearSelection = (parentEl) => {
    for (child of parentEl.children) {
      child.classList.remove("question__answered");
    }
  };

  // add click event for all list items so answers
  answers.forEach((answer) =>
    answer.addEventListener("click", (e) => {
      // get parent element in this case list (question)
      // we use it to check if question has a selected answer
      // and also using data-id send data for server
      const parentEl = e.target.parentElement;

      // clear possible selected items' styling classes
      clearSelection(parentEl);

      // add now styling class into selected list item
      e.target.classList.add("question__answered");

      // find question index by using parent list item data-id dataset
      // we use this index to update question & selected-answer pair
      const questionIndex = selectedAnswers.findIndex(
        (selectedAnswer) => selectedAnswer.id === parentEl.dataset.id
      );

      // updated selected answer for current question
      selectedAnswers[questionIndex] = {
        ...selectedAnswers[questionIndex],
        answer: e.target.dataset.choice,
      };
    })
  );
});

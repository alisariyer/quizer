window.addEventListener("DOMContentLoaded", (e) => {
  // answer list items
  const answers = document.querySelectorAll(".question__answer");

  // question list
  const questions = document.querySelectorAll(".question__list");

  // to keep selected list items by pairing question list
  // use question list data-id dataset and list item data-choice dataset
  const selectedAnswers = [];

  // two span elements keeping total answered questions and all questions number
  const totalAnswered = document.querySelector(".total-answered");
  const totalQuestions = document.querySelector(".total-questions");

  // update once total questions number
  totalQuestions.innerText = (questions.length + '').padStart(2, '0');

  // update function to update total answered questions
  const updateQuizState = () => {
    let totalSelectedAnswers = 0;
    selectedAnswers.forEach((answer) =>
      answer.answer !== "-1" ? totalSelectedAnswers++ : null
    );
    totalAnswered.innerText = `${(totalSelectedAnswers + "").padStart(2, "0")}`;
  };
  updateQuizState();

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

      // if list item (answer) is already selected, remove styling class
      //  and answers from selectedAnswers array
      if (e.target.classList.contains("question__answered")) {
        e.target.classList.remove("question__answered");

        // compare by parentEl.dataset.id so is same as selectedAnswer.id to not remove all answers
        selectedAnswers.forEach(selectedAnswer => parentEl.dataset.id === selectedAnswer.id ? selectedAnswer.answer = "-1" : null);

        // update quiz state
        updateQuizState();
        return null;
      }

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

      updateQuizState();
    })
  );
});

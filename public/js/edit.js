window.addEventListener('DOMContentLoaded', (e) => {
    const form = document.querySelector('.form-edit');
    const questionID = form.dataset.id;

    const getUpdatedQuestion = () => {
        return { 
            question: form.elements.question.value,
            answers: [
                form.elements['answers[0]'].value,
                form.elements['answers[1]'].value,
                form.elements['answers[2]'].value,
                form.elements['answers[3]'].value
            ],
            correct: form.elements.correct.value };
    }

    const putData = async ( url = "", data = {}) => {
        const response = await fetch(url, {
            method: 'PUT',
            body: data
        });
        const res = await response.json();
        return res;
    } 

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        putData(`/questions/question/${questionID}`, getUpdatedQuestion())
            .then(data => console.log(data));
    })
})
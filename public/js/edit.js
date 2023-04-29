window.addEventListener('DOMContentLoaded', (e) => {
    const form = document.querySelector('.form-edit');
    const questionID = form.dataset.id;
    const popup = document.querySelector('.popup');
    const popupP = document.querySelector('.popup p')

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

    const showTempPopup = () => {
        popup.classList.remove('d-none');
        popup.classList.add('animation-running');
        setTimeout(() => {
            popup.classList.add('d-none');
            popup.classList.remove('animation-running')
            popupP.innerText = "";
        }, 1200);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log(getUpdatedQuestion());
        const response = await fetch(`/questions/question/${questionID}`, { 
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(getUpdatedQuestion())
        });
        const { message } = await response.json()
        popupP.innerText = message;
        showTempPopup();
    })
})
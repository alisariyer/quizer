const closeIcons = document.querySelectorAll('.close-icon');
const modals = document.querySelectorAll('.modal');

closeIcons.forEach(closeIcon => {
    closeIcon.addEventListener('click', (e) => {
        modals.forEach(modal => modal.classList.add('d-none'));
    })
})
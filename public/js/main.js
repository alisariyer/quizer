const closeIcons = document.querySelectorAll('.close-icon');
const modals = document.querySelectorAll('.modal');

const hideModals = () => {
    modals.forEach(modal => modal.classList.add('d-none'));
}

closeIcons.forEach(closeIcon => {
    closeIcon.addEventListener('click', hideModals)
});

window.addEventListener('DOMContentLoaded', (e) => {
    // if a modal is shown, hide it in 1500 ms
    if (modals && modals.length) setTimeout(hideModals, 1500);
})
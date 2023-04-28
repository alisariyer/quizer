document.addEventListener("DOMContentLoaded", (e) => {
  const buttons = document.querySelectorAll(".btn-delete");
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // constate parent element so button to find data value
      const node = e.target.nodeName.toLowerCase();
      let id;
      switch (node) {
        case "svg":
          id = e.target.parentElement.dataset.id;
          break;
        case "path":
          id = e.target.parentElement.parentElement.dataset.id;
          break;
        default:
          id = e.target.dataset.id;
      }
      
      axios.delete(`/questions/question/${id}`)
        .then(data => window.location.reload())
        .catch(err => console.log(err));
    });
  });
});

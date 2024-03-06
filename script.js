

// function checkFields(fieldsQuantity){
//   let fieldsFilledQuantity = 0;
//   const textFields = document.querySelectorAll('input[type="text"]');
// }

document.getElementById('newBook').addEventListener('click', function (event) { 
  let modal = document.getElementById('modal');
  modal.innerHTML = createModalDialogBook();
  modal.style.display = 'block';
})

function closeModalDialog() { 
  let closeModal = document.getElementById('modalBook');
  let parenModal = closeModal.parentNode;
  parenModal.removeChild(closeModal);
  parenModal.style.display = 'none';
}

function createModalDialogBook(){
  return `
  <div id="modalBook" class="modal-book">
      <div onclick="closeModalDialog()" id="modalClose" class="modal-close"><i class="fa fa-times btn" aria-hidden="true"></i></div>
      <p class="modal-title">Add book:</p>
      <label class="label-text" for="modalNameBook">Name book:</label>
      <input id="modalNameBook" type="text">
      <label class="label-text" for="modalYearPublication">Year of publication:</label>
      <input id="modalYearPublication" type="text">
      <label class="label-text" for="modalPublishingHouse">Publishing house:</label>
      <input id="modalPublishingHouse" type="text">
      <label class="label-text" for="modalQuantityPages">Quantity pages:</label>
      <input id="modalQuantityPages" type="number" name="">
      <label class="label-text" for="modalQuantityBooks">Quantity books:</label>
      <input id="modalQuantityBooks" type="number">
      <button id="addBook" class="modal-btn" type="submit" disabled>Save</button>
  </div>`
}

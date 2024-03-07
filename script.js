//localStorage.clear();



document.getElementById('newBook').addEventListener('click', function (event) { 
  let modal = document.getElementById('modal');
  modal.innerHTML = createModalDialogBook();
  modal.style.display = 'block';
});

function addBook(){
  if(checkFields()){
    const name = document.getElementById('modalNameBook').value;
    const year = document.getElementById('modalYearPublication').value;
    const publishing = document.getElementById('modalPublishingHouse').value;
    const pages = document.getElementById('modalQuantityPages').value;
    const quantity = document.getElementById('modalQuantityBooks').value;

    addBookToTable(name, year, publishing, pages, quantity);
    addBookToStorage(name, year, publishing, pages, quantity);

    closeModalDialog('modalBook');
  }
  else{
    document.getElementById('warning').style.visibility = 'visible';
  }
  
}

function closeModalDialog(dialogName) { 
  let closeModal = document.getElementById(dialogName);
  let parentModal = closeModal.parentNode;
  parentModal.removeChild(closeModal);
  parentModal.style.display = 'none';
}

function createModalDialogBook(){
  return `
  <div id="modalBook" class="modal-book">
    <div id="modalClose" class="modal-close"><i onclick="closeModalDialog('modalBook')" class="fa fa-times btn" aria-hidden="true"></i></div>
    <p class="modal-title">Add book:</p>
    <label class="label-text" for="modalNameBook">Name book:</label>
    <input class="input-box" id="modalNameBook" type="text">
    <label class="label-text" for="modalYearPublication">Year of publication:</label>
    <input class="input-box" id="modalYearPublication" type="text">
    <label class="label-text" for="modalPublishingHouse">Publishing house:</label>
    <input class="input-box" id="modalPublishingHouse" type="text">
    <label class="label-text" for="modalQuantityPages">Quantity pages:</label>
    <input class="input-box" id="modalQuantityPages" type="number" name="">
    <label class="label-text" for="modalQuantityBooks">Quantity books:</label>
    <input class="input-box" id="modalQuantityBooks" type="number">
    <button id="addBook" class="modal-btn" onclick="addBook()">Save</button>
    <p id="warning" class="warning">Заполните все поля формы</p>
  </div>`
}

function checkFields(){
  const fields = document.querySelectorAll('.input-box');
  let fieldsFilled = 0;

  fields.forEach(field => {
    if (field.value != ''){
      fieldsFilled++;
    }
  });

  if (fields.length == fieldsFilled){
    return true;
  }
  else{
    return false;
  }
}

function addBookToTable(nameBook, yearPublication, publishingHouse, quantityPages, quantityBooks){
  let items = document.querySelectorAll('tr');
  let newItem = document.createElement('tr');

  newItem.innerHTML = `
    <td>${items.length}</td>
    <td>${nameBook}</td>
    <td>${yearPublication}</td>
    <td>${publishingHouse}</td>
    <td>${quantityPages}</td>
    <td>${quantityBooks}</td>
    <td><i class="fa fa-pencil btn" aria-hidden="true"></i></td>
    <td><i class="fa fa-trash btn" aria-hidden="true"></i></td>`;

  listBooks.appendChild(newItem);
}

function addBookToStorage(nameBook, yearPublication, publishingHouse, quantityPages, quantityBooks){
  let arrayObj = localStorage.getItem('books');
  let books = [];

  if (arrayObj != null){
    books = JSON.parse(arrayObj);
  }

  let newBook = {
    id: books.length + 1,
    name: nameBook,
    year: yearPublication,
    publishing: publishingHouse,
    pages: quantityPages,
    quantity: quantityBooks
  };

  books.push(newBook);

  localStorage.setItem('books', JSON.stringify(books));
}
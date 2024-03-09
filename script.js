//localStorage.clear();

const menuItems = document.querySelectorAll('li');
menuItems.forEach(item => {
  item.addEventListener('click', () => {
    menuItems.forEach(o => o.classList.remove('selected-item'));
    item.classList.add('selected-item');
  });
});

document.getElementById('pageBooks').addEventListener('click', function (event) {
  container.removeChild(content);

  showPageBooks();
});

document.getElementById('pageVisitors').addEventListener('click', function (event) {
  container.removeChild(content);

  showPageVisitors();
});

showPageBooks();

function showPageBooks(){
  let newItem = document.createElement('div');

  newItem.id = 'content';
  newItem.classList.add('content');
  newItem.innerHTML = createHTMLBooks();

  container.appendChild(newItem);

  document.getElementById('newBook').addEventListener('click', function (event) { 
    let modal = document.getElementById('modal');
    modal.innerHTML = createModalDialogBook('Add book:');
    modal.style.display = 'block';
  });

  document.getElementById('sort').addEventListener('click', function (event) {
    let comboBox = document.getElementById('combo');
    let strSortBy = comboBox.options[comboBox.selectedIndex].text;

    booksSortBy(strSortBy);
  });

  document.getElementById('search').addEventListener('click', function (event) {
    let searchText = document.getElementById('searchText');

    booksSearch(searchText.value);

    searchText.value = '';
  });

  let arrayObj = localStorage.getItem('books');
  let books = [];

  if (arrayObj != null){
    books = JSON.parse(arrayObj);

    books.forEach(book => {
      addBookToTable(book.id, book.name, book.author, book.year, book.publishing, book.pages, book.quantity);
    });
  }

}

function showPageVisitors(){
  let newItem = document.createElement('div');

  newItem.id = 'content';
  newItem.classList.add('content');
  newItem.innerHTML = createHTMLVisitors();

  container.appendChild(newItem);

  document.getElementById('newVisitor').addEventListener('click', function (event) { 
    let modal = document.getElementById('modal');
    modal.innerHTML = createModalDialogBook();
    modal.style.display = 'block';
  });


}

function addBook(){
  if(checkFields()){
    const name = document.getElementById('modalNameBook').value;
    const author = document.getElementById('modalAuthor').value;
    const year = document.getElementById('modalYearPublication').value;
    const publishing = document.getElementById('modalPublishingHouse').value;
    const pages = document.getElementById('modalQuantityPages').value;
    const quantity = document.getElementById('modalQuantityBooks').value;
    const title = document.getElementById('modalTitle').innerText;    

    if (title == 'Add book:'){
      let lastId = getLastBookId();
      addBookToTable(lastId, name, author, year, publishing, pages, quantity);
      addBookToStorage(name, author, year, publishing, pages, quantity);
    }
    else{
      let idBook = editBook(name, author, year, publishing, pages, quantity);
      editBooksStorage(idBook, name, author, year, publishing, pages, quantity);
    }    
    
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

function createModalDialogBook(title){
  return `
  <div id="modalBook" class="modal-book">
    <div id="modalClose" class="modal-close"><i onclick="closeModalDialog('modalBook')" class="fa fa-times btn" aria-hidden="true"></i></div>
    <p id="modalTitle" class="modal-title">${title}</p>
    <label class="label-text" for="modalNameBook">Name book:</label>
    <input class="input-box" id="modalNameBook" type="text">
    <label class="label-text" for="modalAuthor">Author:</label>
    <input class="input-box" id="modalAuthor" type="text">
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
  </div>`;
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

function addBookToTable(id, nameBook, authorBook, yearPublication, publishingHouse, quantityPages, quantityBooks){
  let newItem = document.createElement('tr');

  newItem.id = "rowId" + id;
  newItem.innerHTML = `
    <td>${id}</td>
    <td>${nameBook}</td>
    <td>${authorBook}</td>
    <td>${yearPublication}</td>
    <td>${publishingHouse}</td>
    <td>${quantityPages}</td>
    <td>${quantityBooks}</td>
    <td><i onclick="getDataForEditing(${newItem.id})" class="fa fa-pencil btn" aria-hidden="true"></i></td>
    <td><i onclick="deleteEntry('listBooks', ${newItem.id})" class="fa fa-trash btn" aria-hidden="true"></i></td>`;

  listBooks.appendChild(newItem);
}

function addBookToStorage(nameBook, authorBook, yearPublication, publishingHouse, quantityPages, quantityBooks){
  let arrayObj = localStorage.getItem('books');
  let books = [];

  if (arrayObj != null){
    books = JSON.parse(arrayObj);
  }

  let newBook = {
    id: getLastBookId(),
    name: nameBook,
    author: authorBook,
    year: yearPublication,
    publishing: publishingHouse,
    pages: quantityPages,
    quantity: quantityBooks
  };

  books.push(newBook);

  localStorage.setItem('books', JSON.stringify(books));
}

function createHTMLBooks(){
  let pageHTML = `
  <div class="header">
    <h3 class="color-title">ALL BOOKS:</h3>
    <button id="newBook" class="btn-new-book">New book</button>
  </div>
  <hr>
  <div class="sort-search">
    <div class="sort">
      <label for="combo">Sort by:</label>
      <select name="list" id="combo">
        <option value="0">ID</option>
        <option value="1">Name book</option>
        <option value="2">Author</option>
        <option value="3">Quantity books</option>
      </select>
      <button id="sort">Sort</button>
    </div>
    <div class="search">
      <label for="searchText">Search:</label>
      <input id="searchText" type="text">
      <button id="search">Search</button>
    </div>
  </div>
  <div class="list">
    <table id="listBooks">
      <tr>
        <th>ID</th>
        <th>Name book</th>
        <th>Author</th>
        <th>Year of publication</th>
        <th>Publishing house</th>
        <th>Quantity pages</th>
        <th>Quantity books</th>
        <th>Edit</th>
        <th>Delete</th>
      </tr>          
    </table>
  </div>`;

  return pageHTML;
}

function createHTMLVisitors(){
  let pageHTML = `
  <div class="header">
    <h3 class="color-title">ALL VISITORS:</h3>
    <button id="newVisitor" class="btn-new-book">New visitor</button>
  </div>
  <hr>
  <div class="sort-search">
    <div class="sort">
      <label for="combo">Sort by:</label>
      <select name="list" id="combo">
        <option value="0">ID</option>
        <option value="1">Name</option>
        <option value="2">Phone</option>
      </select>
      <button id="sort">Sort</button>
    </div>
    <div class="search">
      <label for="searchText">Search:</label>
      <input type="text">
      <button id="search">Search</button>
    </div>
  </div>
  <div class="list">
    <table id="listVisitors">
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Phone</th>
        <th>Edit</th>
        <th>Delete</th>
      </tr>          
    </table>
  </div>`

  return pageHTML;
}

function editBook(nameBook, authorBook, yearPublication, publishingHouse, quantityPages, quantityBooks){
  let rowId = localStorage.getItem('rowIdListBooks'); 
  let item = document.getElementById(rowId);

  item.children[1].innerText = nameBook;
  item.children[2].innerText = authorBook;
  item.children[3].innerText = yearPublication;
  item.children[4].innerText = publishingHouse;
  item.children[5].innerText = quantityPages;
  item.children[6].innerText = quantityBooks;

  localStorage.removeItem('rowIdListBooks');

   return parseInt(item.children[0].innerText);
}

function getDataForEditing(rowId){
  let modal = document.getElementById('modal');
  modal.innerHTML = createModalDialogBook('Edit book:');
  modal.style.display = 'block';

  localStorage.setItem('rowIdListBooks', rowId.id);

  let name = document.getElementById('modalNameBook');
  name.value = rowId.children[1].innerHTML;
  let author = document.getElementById('modalAuthor');
  author.value = rowId.children[2].innerHTML;
  let year = document.getElementById('modalYearPublication');
  year.value = rowId.children[3].innerHTML;
  let publishing = document.getElementById('modalPublishingHouse');
  publishing.value = rowId.children[4].innerHTML;
  let pages = document.getElementById('modalQuantityPages');
  pages.value = rowId.children[5].innerHTML;
  let quantity = document.getElementById('modalQuantityBooks');
  quantity.value = rowId.children[6].innerHTML;
}

function editBooksStorage(idBook, nameBook, authorBook, yearPublication, publishingHouse, quantityPages, quantityBooks){
  let books = JSON.parse(localStorage.getItem('books'));

  for (let i = 0; i < books.length; i++){
    if (books[i].id == idBook){
      books[i].name = nameBook;
      books[i].author = authorBook;
      books[i].year = yearPublication;
      books[i].publishing = publishingHouse;
      books[i].pages = quantityPages;
      books[i].quantity = quantityBooks;

      break;
    }
  }
  
  localStorage.setItem('books', JSON.stringify(books));
}

function deleteEntry(idTable, idRow){
  let idListBooks = document.getElementById(idTable);
  let idBook = idRow.children[0].innerText;

  idListBooks.removeChild(idRow);

  let books = JSON.parse(localStorage.getItem('books'));
  let index = books.findIndex(book => book.id == idBook);

  books.splice(index, 1);

  localStorage.setItem('books', JSON.stringify(books));
}

function getLastBookId(){
  let arrayObj = localStorage.getItem('books');
  let books = [];

  if (arrayObj != null){
    books = JSON.parse(arrayObj);

    if (books.length == 0){
      return 1;
    }
    
    return books[books.length - 1].id + 1;
  }

  return 1;
}

function deleteTableRows(idTable){
  let table = document.getElementById(idTable);

  while (table.childElementCount != 1){
    table.removeChild(table.children[1]);
  }
}

function booksSortBy(strSortBy){
  let arrayObj = localStorage.getItem('books');
  let books = [];

  if (arrayObj != null){
    books = JSON.parse(arrayObj);
  }

  deleteTableRows('listBooks');

  switch (strSortBy){
    case "ID":
      books.sort((a, b) => a.id - b.id);
      break;
    case "Name book":
      books.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "Author":
      books.sort((a, b) => a.author.localeCompare(b.author));
      break;
    case "Quantity books":
      books.sort((a, b) => a.quantity - b.quantity);
      break;
  }

  books.forEach(book => {
    addBookToTable(book.id, book.name, book.author, book.year, book.publishing, book.pages, book.quantity);
  });
}

function booksSearch(searchText){
  let arrayObj = localStorage.getItem('books');
  let books = [];
  let foundBooks = [];

  if (arrayObj != null){
    books = JSON.parse(arrayObj);
  }

  books.forEach(book => {
    let strNameLowerCase = book.name.toLowerCase();
    let strAuthorLowerCase = book.author.toLowerCase();
    let strPublishingLowerCase = book.publishing.toLowerCase();

    if (strNameLowerCase.indexOf(searchText) != -1){
      foundBooks.push(book);
    }
    else if (strAuthorLowerCase.indexOf(searchText) != -1){
      foundBooks.push(book);
    }
    else if (strPublishingLowerCase.indexOf(searchText) != -1){
      foundBooks.push(book);
    }
  });

  if (foundBooks.length != 0){
    deleteTableRows('listBooks');
    
    foundBooks.forEach(book => {
      addBookToTable(book.id, book.name, book.author, book.year, book.publishing, book.pages, book.quantity);
    });
  }
}

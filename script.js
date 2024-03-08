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
      let items = document.querySelectorAll('tr');
      addBookToTable(items.length, name, author, year, publishing, pages, quantity);
      addBookToStorage(name, author, year, publishing, pages, quantity);
    }
    else{
      let index = editBook(name, author, year, publishing, pages, quantity);
      editBooksStorage(index, name, author, year, publishing, pages, quantity);
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

  newItem.innerHTML = `
    <td>${id}</td>
    <td>${nameBook}</td>
    <td>${authorBook}</td>
    <td>${yearPublication}</td>
    <td>${publishingHouse}</td>
    <td>${quantityPages}</td>
    <td>${quantityBooks}</td>
    <td><i onclick="getDataForEditing(${id})" class="fa fa-pencil btn" aria-hidden="true"></i></td>
    <td><i class="fa fa-trash btn" aria-hidden="true"></i></td>`;

  listBooks.appendChild(newItem);
}

function addBookToStorage(nameBook, authorBook, yearPublication, publishingHouse, quantityPages, quantityBooks){
  let arrayObj = localStorage.getItem('books');
  let books = [];

  if (arrayObj != null){
    books = JSON.parse(arrayObj);
  }

  let newBook = {
    id: books.length + 1,
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
        <option value="1">Name</option>
        <option value="2">Author</option>
        <option value="3">Quantity</option>
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
  let row = localStorage.getItem('rowIndex');
  let item = listBooks.childNodes[parseInt(row) + 1];

  item.children[1].innerText = nameBook;
  item.children[2].innerText = authorBook;
  item.children[3].innerText = yearPublication;
  item.children[4].innerText = publishingHouse;
  item.children[5].innerText = quantityPages;
  item.children[6].innerText = quantityBooks;

  localStorage.removeItem('rowIndex');

  return parseInt(row);
}

function getDataForEditing(idItem){
  let modal = document.getElementById('modal');
  modal.innerHTML = createModalDialogBook('Edit book:');
  modal.style.display = 'block';

  localStorage.setItem('rowIndex', idItem);

  let item = listBooks.childNodes[idItem + 1];

  let name = document.getElementById('modalNameBook');
  name.value = item.children[1].innerHTML;
  let author = document.getElementById('modalAuthor');
  author.value = item.children[2].innerHTML;
  let year = document.getElementById('modalYearPublication');
  year.value = item.children[3].innerHTML;
  let publishing = document.getElementById('modalPublishingHouse');
  publishing.value = item.children[4].innerHTML;
  let pages = document.getElementById('modalQuantityPages');
  pages.value = item.children[5].innerHTML;
  let quantity = document.getElementById('modalQuantityBooks');
  quantity.value = item.children[5].innerHTML;
}

function editBooksStorage(index, nameBook, authorBook, yearPublication, publishingHouse, quantityPages, quantityBooks){
  let books = JSON.parse(localStorage.getItem('books'));

  console.log(books);

  books[index - 1].name = nameBook;
  books[index - 1].author = nameBook;
  books[index - 1].year = yearPublication;
  books[index - 1].publishing = publishingHouse;
  books[index - 1].pages = quantityPages;
  books[index - 1].quantity = quantityBooks;

  console.log(books);

  localStorage.setItem('books', JSON.stringify(books));
}
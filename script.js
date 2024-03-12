//localStorage.clear();
//localStorage.removeItem('books');
// let books = JSON.parse(localStorage.getItem('books'));
// books.splice(7, 1);
// localStorage.setItem('books-test', JSON.stringify(books));

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

showPageBooks();

//=================================== PAGE BOOKS ==========================================
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
      let lastId = getLastId('books');
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

function createModalDialogBook(title){
  return `
  <div id="modalBook" class="modal-dialog">
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
    <td><i onclick="deleteEntry('listBooks', ${newItem.id}, 'books')" class="fa fa-trash btn" aria-hidden="true"></i></td>`;

  listBooks.appendChild(newItem);
}

function addBookToStorage(nameBook, authorBook, yearPublication, publishingHouse, quantityPages, quantityBooks){
  let arrayObj = localStorage.getItem('books');
  let books = [];

  if (arrayObj != null){
    books = JSON.parse(arrayObj);
  }

  let newBook = {
    id: getLastId('books'),
    name: nameBook,
    author: authorBook,
    year: yearPublication,
    publishing: publishingHouse,
    pages: quantityPages,
    quantity: quantityBooks,
    rating: 0
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

function booksSortBy(strSortBy){
  let arrayObj = localStorage.getItem('books');
  let books = [];

  if (arrayObj != null){
    books = JSON.parse(arrayObj);
  }

  if (books.length == 0){
    let modal = document.getElementById('modal');
    modal.innerHTML = createMessageBox('Message', 'The data array for sorting is empty');
    modal.style.display = 'block';
    
    return;
  }

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

  deleteTableRows('listBooks');

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

  if (books.length == 0){
    let modal = document.getElementById('modal');
    modal.innerHTML = createMessageBox('Message', 'The data array for searching is empty');
    modal.style.display = 'block';
    
    return;
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

//=================================== PAGE VISITORS ==========================================

document.getElementById('pageVisitors').addEventListener('click', function (event) {
  container.removeChild(content);

  showPageVisitors();
});

function showPageVisitors(){
  let newItem = document.createElement('div');

  newItem.id = 'content';
  newItem.classList.add('content');
  newItem.innerHTML = createHTMLVisitors();

  container.appendChild(newItem);

  document.getElementById('newVisitor').addEventListener('click', function (event) { 
    let modal = document.getElementById('modal');
    modal.innerHTML = createModalDialogVisitor('Add visitor:');
    modal.style.display = 'block';
  });

  document.getElementById('sort').addEventListener('click', function (event) {
    let comboBox = document.getElementById('combo');
    let strSortBy = comboBox.options[comboBox.selectedIndex].text;

    visitorsSortBy(strSortBy);
  });

  document.getElementById('search').addEventListener('click', function (event) {
    let searchText = document.getElementById('searchText');

    visitorsSearch(searchText.value);

    searchText.value = '';
  });

  let arrayObj = localStorage.getItem('visitors');
  let visitors = [];

  if (arrayObj != null){
    visitors = JSON.parse(arrayObj);

    visitors.forEach(visitor => {
      addVisitorToTable(visitor.id, visitor.name, visitor.phone);
    });
  }

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

function createModalDialogVisitor(title){
  return `
  <div id="modalVisitor" class="modal-dialog">
    <div id="modalClose" class="modal-close"><i onclick="closeModalDialog('modalVisitor')" class="fa fa-times btn" aria-hidden="true"></i></div>
    <p id="modalTitle" class="modal-title">${title}</p>
    <label class="label-text" for="modalNameVisitor">Name visitor:</label>
    <input class="input-box" id="modalNameVisitor" type="text">
    <label class="label-text" for="modalPhoneVisitor">Phone:</label>
    <input class="input-box" id="modalPhoneVisitor" type="text">
    <button id="addVisitor" class="modal-btn" onclick="addVisitor()">Save</button>
    <p id="warning" class="warning">Заполните все поля формы</p>
  </div>`;
}

function addVisitor(){
  if(checkFields()){
    const name = document.getElementById('modalNameVisitor').value;
    const phone = document.getElementById('modalPhoneVisitor').value;
    const title = document.getElementById('modalTitle').innerText;    

    if (title == 'Add visitor:'){
      let lastId = getLastId('visitors');
      addVisitorToTable(lastId, name, phone);
      addVisitorToStorage(name, phone);
    }
    else{
      let idVisitor = editVisitor(name, phone);
      editVisitorStorage(idVisitor, name, phone);
    }    
    
    closeModalDialog('modalVisitor');
  }
  else{
    document.getElementById('warning').style.visibility = 'visible';
  }
}

function editVisitor(nameVisitor, phoneVisitor){
  let rowId = localStorage.getItem('rowIdListVisitors'); 
  let item = document.getElementById(rowId);

  item.children[1].innerText = nameVisitor;
  item.children[2].innerText = phoneVisitor;

  localStorage.removeItem('rowIdListVisitors');

   return parseInt(item.children[0].innerText);
}

function addVisitorToTable(id, nameVisitor, phoneVisitor){
  let newItem = document.createElement('tr');

  newItem.id = "rowId" + id;
  newItem.innerHTML = `
    <td>${id}</td>
    <td>${nameVisitor}</td>
    <td>${phoneVisitor}</td>
    <td><i onclick="getDataForEditingVisitor(${newItem.id})" class="fa fa-pencil btn" aria-hidden="true"></i></td>
    <td><i onclick="deleteEntry('listVisitors', ${newItem.id}, 'visitors')" class="fa fa-trash btn" aria-hidden="true"></i></td>`;

    listVisitors.appendChild(newItem);
}

function addVisitorToStorage(nameVisitor, phoneVisitor){
  let arrayObj = localStorage.getItem('visitors');
  let visitors = [];

  if (arrayObj != null){
    visitors = JSON.parse(arrayObj);
  }

  let newVisitor = {
    id: getLastId('visitors'),
    name: nameVisitor,
    phone: phoneVisitor,
    rating: 0
  };

  visitors.push(newVisitor);

  localStorage.setItem('visitors', JSON.stringify(visitors));
}

function editVisitorStorage(idVisitor, nameVisitor, phoneVisitor){
  let visitors = JSON.parse(localStorage.getItem('visitors'));

  for (let i = 0; i < visitors.length; i++){
    if (visitors[i].id == idVisitor){
      visitors[i].name = nameVisitor;
      visitors[i].phone = phoneVisitor;

      break;
    }
  }
  
  localStorage.setItem('visitors', JSON.stringify(visitors));
}

function getDataForEditingVisitor(rowId){
  let modal = document.getElementById('modal');
  modal.innerHTML = createModalDialogVisitor('Edit visitor:');
  modal.style.display = 'block';

  localStorage.setItem('rowIdListVisitors', rowId.id);

  let name = document.getElementById('modalNameVisitor');
  name.value = rowId.children[1].innerHTML;
  let phone = document.getElementById('modalPhoneVisitor');
  phone.value = rowId.children[2].innerHTML;
}

function visitorsSortBy(strSortBy){
  let arrayObj = localStorage.getItem('visitors');
  let visitors = [];

  if (arrayObj != null){
    visitors = JSON.parse(arrayObj);
  }

  if (visitors.length == 0){
    let modal = document.getElementById('modal');
    modal.innerHTML = createMessageBox('Message', 'The data array for sorting is empty');
    modal.style.display = 'block';
    
    return;
  }

  switch (strSortBy){
    case "ID":
      visitors.sort((a, b) => a.id - b.id);
      break;
    case "Name":
      visitors.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  deleteTableRows('listVisitors');

  visitors.forEach(visitor => {
    addVisitorToTable(visitor.id, visitor.name, visitor.phone);
  });
}

function visitorsSearch(searchText){
  let arrayObj = localStorage.getItem('visitors');
  let visitors = [];
  let foundVisitors = [];

  if (arrayObj != null){
    visitors = JSON.parse(arrayObj);
  }

  if (visitors.length == 0){
    let modal = document.getElementById('modal');
    modal.innerHTML = createMessageBox('Message', 'The data array for searching is empty');
    modal.style.display = 'block';
    
    return;
  }

  visitors.forEach(visitor => {
    let strNameLowerCase = visitor.name.toLowerCase();

    if (strNameLowerCase.indexOf(searchText) != -1){
      foundVisitors.push(visitor);
    }
    else if (visitor.phone.indexOf(searchText) != -1){
      foundVisitors.push(visitor);
    }
  });

  if (foundVisitors.length != 0){
    deleteTableRows('listVisitors');
    
    foundVisitors.forEach(visitor => {
      addVisitorToTable(visitor.id, visitor.name, visitor.phone);
    });
  }
}

//=================================== PAGE CARDS ==========================================

document.getElementById('pageCards').addEventListener('click', function (event) {
  container.removeChild(content);

  showPageCards();
});

function showPageCards(){
  let newItem = document.createElement('div');

  newItem.id = 'content';
  newItem.classList.add('content');
  newItem.innerHTML = createHTMLCards();

  container.appendChild(newItem);

  document.getElementById('newCard').addEventListener('click', function (event) { 
    let modal = document.getElementById('modal');
    modal.innerHTML = createModalDialogCard();
    modal.style.display = 'block';

    initializeComboBoxes();
  });

  document.getElementById('sort').addEventListener('click', function (event) {
    let comboBox = document.getElementById('combo');
    let strSortBy = comboBox.options[comboBox.selectedIndex].text;

    cardsSortBy(strSortBy);
  });

  document.getElementById('search').addEventListener('click', function (event) {
    let searchText = document.getElementById('searchText');

    cardsSearch(searchText.value);

    searchText.value = '';
  });

  let arrayObj = localStorage.getItem('cards');
  let cards = [];

  if (arrayObj != null){
    cards = JSON.parse(arrayObj);

    cards.forEach(card => {
      addCardToTable(card.id, card.visitor, card.book, card.borrowDate, card.returnDate);
    });
  }

}

function createHTMLCards(){
  let pageHTML = `
  <div class="header">
    <h3 class="color-title">ALL CARDS:</h3>
    <button id="newCard" class="btn-new-book">New card</button>
  </div>
  <hr>
  <div class="sort-search">
    <div class="sort">
      <label for="combo">Sort by:</label>
      <select name="list" id="combo">
        <option value="0">ID</option>
        <option value="1">Visitor</option>
        <option value="2">Book</option>
        <option value="3">Borrow Date</option>
        <option value="4">Return Date</option>
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
    <table id="listCards">
      <tr>
        <th>ID</th>
        <th>Visitor</th>
        <th>Book</th>
        <th>Borrow Date</th>
        <th>Return Date</th>
      </tr>          
    </table>
  </div>`

  return pageHTML;
}

function createModalDialogCard(){
  return `
  <div id="modalCard" class="modal-dialog">
    <div id="modalClose" class="modal-close"><i onclick="closeModalDialog('modalCard')" class="fa fa-times btn" aria-hidden="true"></i></div>
    <p id="modalTitle" class="modal-title">New card:</p>
    <label class="label-text" for="comboVisitors">Visitor:</label>
    <select name="list" class="combo-box" id="comboVisitors"></select>
    <label class="label-text" for="comboBooks">Book:</label>
    <select name="list" class="combo-box" id="comboBooks"></select>
    <button id="createCard" class="modal-btn" onclick="createCard()">Create card</button>
    <p id="warning" class="warning">Заполните все поля формы</p>
  </div>`;
}

function initializeComboBoxes(){
  let visitors = JSON.parse(localStorage.getItem('visitors'));
  let books = JSON.parse(localStorage.getItem('books'));
  let comboVisitors = document.getElementById('comboVisitors');
  let comboBooks = document.getElementById('comboBooks');

  visitors.forEach(visitor => {
    let newOption = document.createElement('option');
    newOption.text = visitor.name;
    newOption.value = visitor.id;
    comboVisitors.add(newOption);
  });

  books.forEach(book => {
    if (book.quantity > 0){
      let newOption = document.createElement('option');
      newOption.text = book.name;
      newOption.value = book.id;
      comboBooks.add(newOption);
    }
  });
}

function createCard(){
  let comboVisitors = document.getElementById('comboVisitors');
  let comboBooks = document.getElementById('comboBooks');

  let visitor = comboVisitors.options[comboVisitors.selectedIndex].text;
  let idVisitor = comboVisitors.options[comboVisitors.selectedIndex].value;
  editVisitorRating(idVisitor);

  let book = comboBooks.options[comboBooks.selectedIndex].text;
  let idBook = comboBooks.options[comboBooks.selectedIndex].value;
  editBookRating(idBook);
  editBookQuantity(idBook, -1); // книгу забирают

  let lastId = getLastId('cards');
  addCardToTable(lastId, visitor, book, today(), null);
  addCardToStorage(visitor, book, idBook);

  closeModalDialog('modalCard');
}

function editVisitorRating(id){
  let visitors = JSON.parse(localStorage.getItem('visitors'));

  for (let i = 0; i < visitors.length; i++){
    if (visitors[i].id == id){
      visitors[i].rating++;

      break;
    }
  }

  localStorage.setItem('visitors', JSON.stringify(visitors));
}

function editBookRating(id){
  let books = JSON.parse(localStorage.getItem('books'));

  for (let i = 0; i < books.length; i++){
    if (books[i].id == id){
      books[i].rating++;

      break;
    }
  }

  localStorage.setItem('books', JSON.stringify(books));
}

function editBookQuantity(id, num){
  let books = JSON.parse(localStorage.getItem('books'));

  for (let i = 0; i < books.length; i++){
    if (books[i].id == id){
      if (num > 0){
        books[i].quantity++;
      }
      else{
        books[i].quantity--;
      }

      break;
    }
  }

  localStorage.setItem('books', JSON.stringify(books));
}

function addCardToTable(id, nameVisitor, nameBook, borrowDate, returnDate){
  let newItem = document.createElement('tr');
  let del = "del" + id;

  newItem.id = "rowId" + id;
  let childNode = returnDate == null ? `<i onclick="dateReturnBook(${newItem.id}, ${del})" id="${del}" class="fa fa-reply btn" aria-hidden="true"></i>` : returnDate;

  newItem.innerHTML = `
    <td>${id}</td>
    <td>${nameVisitor}</td>
    <td>${nameBook}</td>
    <td>${borrowDate}</td>
    <td>${childNode}</td>`;

    listCards.appendChild(newItem);
}

function addCardToStorage(nameVisitor, nameBook, idBook){
  let arrayObj = localStorage.getItem('cards');
  let cards = [];

  if (arrayObj != null){
    cards = JSON.parse(arrayObj);
  }

  let newCard = {
    id: getLastId('cards'),
    visitor: nameVisitor,
    book: nameBook,
    idBook: idBook,
    borrowDate: today(),
    returnDate: null
  };

  cards.push(newCard);

  localStorage.setItem('cards', JSON.stringify(cards));
}

function dateReturnBook(idRow, idDel){
  let cards = JSON.parse(localStorage.getItem('cards'));

  for (let i = 0; i < cards.length; i++){
    if (cards[i].id == idRow.children[0].innerText){
      cards[i].returnDate = today();

      editBookQuantity(cards[i].idBook, 1); // книгу вернули

      break;
    }
  }
  
  localStorage.setItem('cards', JSON.stringify(cards));

  idRow.children[4].removeChild(idDel);
  idRow.children[4].innerText = today();
}

function cardsSortBy(strSortBy){
  let arrayObj = localStorage.getItem('cards');
  let cards = [];

  if (arrayObj != null){
    cards = JSON.parse(arrayObj);
  }

  if (cards.length == 0){
    let modal = document.getElementById('modal');
    modal.innerHTML = createMessageBox('Message', 'The data array for sorting is empty');
    modal.style.display = 'block';
    
    return;
  }

  switch (strSortBy){
    case "ID":
      cards.sort((a, b) => a.id - b.id);
      break;
    case "Visitor":
      cards.sort((a, b) => a.visitor.localeCompare(b.visitor));
      break;
    case "Book":
      cards.sort((a, b) => a.book.localeCompare(b.book));
      break;
    case "Borrow Date":
      cards.sort((a, b) => {
        let arrDate1 = a.borrowDate.split('.');
        let arrDate2 = b.borrowDate.split('.');
        let date1 = new Date(arrDate1[2], arrDate1[1] - 1, arrDate1[0]);
        let date2 = new Date(arrDate2[2], arrDate2[1] - 1, arrDate2[0]);

        if (date1 > date2) return 1;
        else if (date1 < date2) return -1;
        else return 0;
      });
      break;
    case "Return Date":
      cards.sort((a, b) => {
        let strDate1 = a.returnDate;
        let strDate2 = b.returnDate;

        if (strDate1 == null && strDate2 == null){
          strDate1 = "01." + "01." + "9999";
          strDate2 = "01." + "01." + "9999";
        }
        else if (strDate1 == null){
          strDate1 = "01." + "01." + "9999";
        }
        else if (strDate2 == null){
          strDate2 = "01." + "01." + "9999";
        }

        let arrDate1 = strDate1.split('.');
        let arrDate2 = strDate2.split('.');

        let date1 = new Date(arrDate1[2], arrDate1[1] - 1, arrDate1[0]);
        let date2 = new Date(arrDate2[2], arrDate2[1] - 1, arrDate2[0]);

        
        if (date1 > date2) return 1;
        else if (date1 < date2) return -1;
        else return 0;
      });
      break;
  }

  deleteTableRows('listCards');

  cards.forEach(card => {
    addCardToTable(card.id, card.visitor, card.book, card.borrowDate, card.returnDate);
  });
}

function cardsSearch(searchText){
  let arrayObj = localStorage.getItem('cards');
  let cards = [];
  let foundCards = [];

  if (arrayObj != null){
    cards = JSON.parse(arrayObj);
  }

  if (cards.length == 0){
    let modal = document.getElementById('modal');
    modal.innerHTML = createMessageBox('Message', 'The data array for searching is empty');
    modal.style.display = 'block';
    
    return;
  }

  cards.forEach(card => {
    let strBookLowerCase = card.book.toLowerCase();
    let strVisitorLowerCase = card.visitor.toLowerCase();
    let strReturnDate = card.returnDate;

    if (strReturnDate == null){
      strReturnDate = "01." + "01." + "9999";
    }

    if (strBookLowerCase.indexOf(searchText) != -1){
      foundCards.push(card);
    }
    else if (strVisitorLowerCase.indexOf(searchText) != -1){
      foundCards.push(card);
    }
    else if (card.borrowDate.indexOf(searchText) != -1){
      foundCards.push(card);
    }
    else if (card.returnDate != null && card.returnDate.indexOf(searchText) != -1){
      foundCards.push(card);
    }
  });

  if (foundCards.length != 0){
    deleteTableRows('listCards');
    
    foundCards.forEach(card => {
      addCardToTable(card.id, card.visitor, card.book, card.borrowDate, card.returnDate);
    });
  }
}

function today(){
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  month = month < 10 ? '0' + month : month;
  let day = today.getDate();
  day = day < 10 ? '0' + day : day;

  return day + '.' + month + '.' + year;
}

//=================================== GENERAL FUNCTIONS ==========================================

function createMessageBox(titleMsg, textMsg){
  return `
  <div id="msgBox" class="msg-box">
    <div class="msg-box-header">
      <p id="msgBoxTitle" class="msg-box-title">${titleMsg}</p>
      <div id="msgBoxClose" class="modal-close">
        <i onclick="closeModalDialog('msgBox')" class="fa fa-times btn" aria-hidden="true"></i>
      </div>      
    </div>
    <div class="msg-box-discription">
      <i class="fa fa-info-circle fa-3x color-icon" aria-hidden="true"></i>
      <p id="msgBoxText" class="msg-box-text">${textMsg}</p>
    </div>      
  </div>`
}

function closeModalDialog(dialogName) { 
  let closeModal = document.getElementById(dialogName);
  let parentModal = closeModal.parentNode;
  parentModal.removeChild(closeModal);
  parentModal.style.display = 'none';
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

function deleteTableRows(idTable){
  let table = document.getElementById(idTable);

  while (table.childElementCount != 1){
    table.removeChild(table.children[1]);
  }
}

function deleteEntry(idTable, idRow, keyStorage){
  let parentElemTable = document.getElementById(idTable);
  let idEntry = idRow.children[0].innerText;

  parentElemTable.removeChild(idRow);

  let objectsArray = JSON.parse(localStorage.getItem(keyStorage));
  let index = objectsArray.findIndex(object => object.id == idEntry);

  objectsArray.splice(index, 1);

  localStorage.setItem(keyStorage, JSON.stringify(objectsArray));
}

function getLastId(keyStorage){
  let arrayObj = localStorage.getItem(keyStorage);
  let array = [];

  if (arrayObj != null){
    array = JSON.parse(arrayObj);

    if (array.length == 0){
      return 1;
    }
    
    return array[array.length - 1].id + 1;
  }

  return 1;
}
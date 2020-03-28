class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  static addBookToList(book) {
    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="delete">X</a></td>`;
      list.appendChild(row);
  } 

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    setTimeout(function(){
      document.querySelector('.alert').remove();
    }, 2000);
  }

  static deleteBook(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }
}

//Local Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static displayBooks(){
    const books = this.getBooks();
    books.forEach(function(book){
      UI.addBookToList(book);
    });
  }
  
  static addBook(book){
    const books = this.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn){
    const books = this.getBooks();
    books.forEach(function(book, index){
      if (book.isbn === isbn) {
        books.splice(index, 1);
      } 
      localStorage.setItem('books', JSON.stringify(books));
    });
  }
}

//Event Listeners
document.addEventListener('DOMConentLoaded', Store.displayBooks());

document.querySelector('#book-form').addEventListener('submit', function(e){
  const title = document.querySelector('#title').value,
        author = document.querySelector('#author').value,
        isbn = document.querySelector('#isbn').value;

  const book = new Book(title, author, isbn);

  //Validate
  if (title === '' || author === '' || isbn === '') {
    UI.showAlert('Please fill in all fields', 'error');
  } else {
    UI.showAlert('Book added', 'success');
    UI.addBookToList(book);
    Store.addBook(book);
    UI.clearFields();
  }

  e.preventDefault();      
});

document.querySelector('#book-list').addEventListener('click', function(e){
  UI.deleteBook(e.target);
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  UI.showAlert('Book deleted', 'success');

  e.preventDefault();
});
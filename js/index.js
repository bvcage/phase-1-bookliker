window.addEventListener("DOMContentLoaded", function() {

    const bookList = document.querySelector('ul#list');
    const bookDetailPanel = document.querySelector('div#show-panel');

    fetch('http://localhost:3000/books')
    .then((response) => response.json())
    .then((data) => {
        listBooks(data);
    })
    .catch((error) => console.log(error));
    

    function listBooks (inventory) {
        Object.values(inventory).forEach((book) => {
            // add book to book list
            const newBook = document.createElement('li');
            newBook.textContent = book.title;
            bookList.appendChild(newBook);

            // display details on click
            newBook.addEventListener('click', () => {showDetails(book)});
        });
    }


    function showDetails (book) {
        const {title, subtitle, author, description, img_url, users} = book;

        bookDetailPanel.innerHTML = ''; // clear any existing selection

        const bookImg = document.createElement('img');
        const bookTitle = document.createElement('h1');
        const bookSubtitle = document.createElement('h2');
        const bookAuthor = document.createElement('h2');
        const bookDesc = document.createElement('p');

        bookImg.src = img_url;
        bookTitle.textContent = title;
        bookSubtitle.textContent = subtitle;
        bookAuthor.textContent = author;
        bookDesc.textContent = description;

        bookDetailPanel.append(bookImg, bookTitle, bookSubtitle, bookAuthor, description);


    }


});




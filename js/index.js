window.addEventListener("DOMContentLoaded", function() {

    fetch('http://localhost:3000/books')
    .then((response) => response.json())
    .then((data) => {
        listBooks(data);
    })
    .catch((error) => console.log(error));
    
});

function listBooks (inventory) {
    const bookList = document.querySelector('ul#list');
    Object.values(inventory).forEach((book) => {
        const newBookLine = document.createElement('li');
        newBookLine.textContent = book.title;
        bookList.appendChild(newBookLine);
        newBookLine.addEventListener('click', showDetails);
    });
}



function showDetails () {
    console.log(event.target);
}
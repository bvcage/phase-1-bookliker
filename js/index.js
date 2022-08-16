var USER;
const USER_ID = Math.floor( Math.random() * 10 ) + 1;
console.log('USER_ID = ' + USER_ID);
fetch(`http://localhost:3000/users/${USER_ID}`)
.then((response) => response.json())
.then((data) => {
    USER = data;
});

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

        if (img_url) {
            const bookImg = document.createElement('img');
            bookImg.src = img_url;
            bookDetailPanel.append(bookImg);
        }
        if (title) {
            const bookTitle = document.createElement('h1');
            bookTitle.textContent = title;
            bookDetailPanel.append(bookTitle);
        }
        if (subtitle) {
            const bookSubtitle = document.createElement('h2');
            bookSubtitle.textContent = subtitle;
            bookDetailPanel.append(bookSubtitle);
        }
        if (author) {
            const bookAuthor = document.createElement('h2');
            bookAuthor.textContent = author;
            bookDetailPanel.append(bookAuthor);
        }
        if (description) {
            const bookDesc = document.createElement('p');
            bookDesc.textContent = description;
            bookDetailPanel.append(bookDesc);
        }
        if (users) {
            const bookLikeList = makeUserLikeList(users);
            bookDetailPanel.append(bookLikeList);
        }

        function makeUserLikeList (users) {
            const bookLikeList = document.createElement('ul');
            users.forEach((user) => {
                const bookLike = document.createElement('li');
                bookLike.textContent = user.username;
                bookLikeList.append(bookLike);
            });
            return bookLikeList;
        }

        function appendLikeButton () {
            const likeBtn = document.createElement('button');
            likeBtn.textContent = 'LIKE';
            bookDetailPanel.append(likeBtn);
            likeBtn.addEventListener('click', updateUserLikes);
        }

        function updateUserLikes () {
            // check if user already liked
            if (users.find(user => user.id === USER_ID)) {
                console.log(USER_ID + " has already liked this book.");
            } else {
                users.push(USER);
                const updatedLikes = {
                    "users": users
                }
                const patchUserLikes = {
                    method: 'PATCH',
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(updatedLikes)
                }
                fetch(`http://localhost:3000/books/${book.id}`, patchUserLikes)
                .then(response => response.json())
                .then(updatedBook => {
                    const oldLikeList = bookDetailPanel.querySelector('ul');
                    const newLikeList = makeUserLikeList(updatedBook.users);
                    bookDetailPanel.replaceChild(makeUserLikeList(updatedBook.users), oldLikeList);
                });
            }
        }

        appendLikeButton();

    }

});




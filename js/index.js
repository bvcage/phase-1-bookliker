
// random generate user for testing
var USER;
const USER_ID = Math.floor( Math.random() * 10 ) + 1;
console.log('USER_ID = ' + USER_ID);
fetch(`http://localhost:3000/users/${USER_ID}`)
.then((response) => response.json())
.then((userObj) => {
    USER = userObj;
});

// constants
const BOOK_URL = 'http://localhost:3000/books';

// HTML elements
const bookList = document.querySelector('ul#list');
const bookDetailPanel = document.querySelector('div#show-panel');

window.addEventListener("DOMContentLoaded", function() {

    populateBookListFrom(BOOK_URL);

});

function populateBookListFrom (url) {
    fetch(url)
    .then(response => response.json())
    .then(booksAry => listBooks(booksAry))
    .catch(error => console.log(error));
}

function listBooks (booksAry) {
    bookList.innerHTML = '';    // clear any existing
    booksAry.forEach(book => {
        // add book to list
        const newBook = document.createElement('li');
        newBook.textContent = book.title;
        bookList.appendChild(newBook);
        // display details on click
        newBook.addEventListener('click', (event) => {showDetails(book)});
    });
}

function showDetails (book) {
    bookDetailPanel.innerHTML = ''; // clear any existing selection

    // get book info
    const {title, subtitle, author, description, img_url} = book;
    let likes = book.users;

    // check if current user has liked this book
    let hasLiked = false;
    if (likes.length > 0 && likes.find(user => user.id === USER_ID)) {
        hasLiked = true;
    }

    // populate static details
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

    // create & append likes list
    if (typeof likes !== 'object') {likes = []}
    const likeList = createLikeList(likes);
    bookDetailPanel.append(likeList);

    // create & append like button
    const likeBtn = createLikeButton(hasLiked);
    likeBtn.addEventListener('click', async (event) => {
        likes = await updateLikeList(book.id, likes, hasLiked);
        hasLiked = toggleLikeButton(hasLiked);
    });

    function toggleLikeButton (hasLiked) {
        if (hasLiked) {
            hasLiked = false;
            likeBtn.textContent = 'LIKE';
        } else {
            hasLiked = true;
            likeBtn.textContent = 'UNLIKE';
        }
        return hasLiked;
    }

}

function createLikeList (likesAry) {
    const likeList = document.createElement('ul');
    likesAry.forEach((like) => {
        const bookLike = document.createElement('li');
        bookLike.textContent = like.username;
        likeList.append(bookLike);
    });
    return likeList;
}

function createLikeButton (hasLiked) {
    const likeBtn = document.createElement('button');
    if (hasLiked) {
        likeBtn.textContent = 'UNLIKE';
    } else {
        likeBtn.textContent = 'LIKE';
    }
    bookDetailPanel.append(likeBtn);
    return likeBtn;
}

function updateLikeList (bookId, currLikes, hasLiked) {

    let newLikes;
    if (hasLiked) {
        newLikes = currLikes.filter(user => user.id !== USER_ID);
    } else {
        newLikes = currLikes.concat(USER);
    }

    const updatedLikes = {
        "users": newLikes
    }

    const patchUserLikes = {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(updatedLikes)
    }

    return fetch(`http://localhost:3000/books/${bookId}`, patchUserLikes)
    .then(response => response.json())
    .then(updatedBook => {
        const oldLikesList = bookDetailPanel.querySelector('ul');
        const newLikesList = createLikeList(updatedBook.users);
        bookDetailPanel.replaceChild(newLikesList, oldLikesList);
        return updatedBook.users;
    });

}
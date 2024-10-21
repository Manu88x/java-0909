const quoteList = document.getElementById('quote-list');
const quoteForm = document.getElementById('quote-form');
const sortToggle = document.getElementById('sort-toggle');
let quotes = [];
let sortByAuthor = false;

// Fetch quotes and display them
function fetchQuotes() {
    fetch('http://localhost:3000/quotes?_embed=likes')
        .then(response => response.json())
        .then(data => {
            quotes = data;
            renderQuotes();
        });
}

// Render quotes to the DOM
function renderQuotes() {
    quoteList.innerHTML = '';
    const sortedQuotes = sortByAuthor 
        ? [...quotes].sort((a, b) => a.author.localeCompare(b.author)) 
        : quotes;

    sortedQuotes.forEach(quote => {
        const li = document.createElement('li');
        li.className = 'quote-card';
        li.innerHTML = `
            <blockquote class="blockquote">
                <p class="mb-0">${quote.content}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn-success' onclick="likeQuote(${quote.id})">Likes: <span>${quote.likes.length}</span></button>
                <button class='btn-danger' onclick="deleteQuote(${quote.id})">Delete</button>
                <button class='btn-edit' onclick="editQuote(${quote.id})">Edit</button>
            </blockquote>
        `;
        quoteList.appendChild(li);
    });
}

// Add a new quote
quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newQuote = {
        content: document.getElementById('quote-input').value,
        author: document.getElementById('author-input').value
    };

    fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuote)
    })
    .then(() => {
        fetchQuotes();
        quoteForm.reset();
    });
});

// Delete a quote
function deleteQuote(id) {
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'DELETE'
    })
    .then(() => fetchQuotes());
}

// Like a quote
function likeQuote(id) {
    fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quoteId: id })
    })
    .then(() => fetchQuotes());
}

// Toggle sort
sortToggle.addEventListener('click', () => {
    sortByAuthor = !sortByAuthor;
    sortToggle.textContent = sortByAuthor ? 'Sort by ID' : 'Sort by Author';
    renderQuotes();
});

// Initial fetch
fetchQuotes();

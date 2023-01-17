const fs = require('fs');
const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));
app.set("view engine","ejs");


let books =[];
let bookId = books.length;

app.get('/',(req,res) => {
    res.render('home.ejs', {Books:books});
})

app.get('/style.css',(req,res) => {
    res.sendFile(__dirname + '/style.css')
})

// add book
app.post('/addbook', (req,res) => {
    req.body.id = bookId++;
    books.push(req.body);
    res.render('redirect.ejs');
    savebooksdata();
})

// delete book
app.get('/delete/:id', (req,res) => {
    let delBookIdx = req.params.id.slice(1);
    books.splice(+delBookIdx, 1);
    res.render('redirect.ejs');
    savebooksdata();
})

// search book
app.get('/search', (req,res) => {
    let searchValue = req.query.search;
    let searchResult = books.filter(e => e.book.indexOf(searchValue) > -1 || e.author.indexOf(searchValue) > -1);
    res.render('home.ejs', {Books:searchResult});
})

// update book
app.get('/update/:id', (req,res) => {
    let updateBookIdx = req.params.id.slice(1);
    res.render('updatebook.ejs', {BookUpdateId: books[updateBookIdx].id, BookUpdateName: books[updateBookIdx].book, BookUpdateAuthor: books[updateBookIdx].author});
})

app.post('/updatebook', (req,res) => {
    let updateBookIdx = books.findIndex(e => e.id == req.body.id);
    books[updateBookIdx].book = req.body.book;
    books[updateBookIdx].author = req.body.author;
    res.render('redirect.ejs');
    savebooksdata();
})

function savebooksdata() {
    fs.writeFile('booksdata.db', JSON.stringify(books),(err) => {
        if (err) {
            console.log(err)
        }
    })
}

function loadbooksdata() {
    fs.readFile('booksdata.db',(err,data) => {
        if(err){
            console.log(err)
        }else{
            books = JSON.parse(data);
            bookId = books.length;
        }
    })
}

loadbooksdata();

const port = process.env.port || 3000;
app.listen(port);
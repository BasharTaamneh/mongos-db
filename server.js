'use strict';

const express = require('express');

const cors = require('cors');

const { request } = require('http');

const server = express();

server.use(cors());
require('dotenv').config();

server.use(express.json());

const PORT = process.env.PORT;

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/BOOKSINFO', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

const { query } = require('express');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log('connected to database');
});



const BookSchema = new mongoose.Schema({
    email: String,
    bookname: String,
    bookdiscr: String,
    bookstatus: String,
    author_name: String,
    Book_src: String,
});


const Bookinfomodal = new mongoose.model('Bookinfo', BookSchema);


function SEEDBookinfomodal() {

    const book1 = new Bookinfomodal({
        email: 'BasharTaamneh55@gmail.com',
        bookname: 'BIG MAGIC',
        bookdiscr:"in progres",
        bookstatus: 'readed',
        author_name:"bashar",
        Book_src:'https://kbimages1-a.akamaihd.net/b3f00c5f-ec69-4df8-8786-8da68bd60901/1200/1200/False/big-magic-7.jpg'
    })
    book1.save();
}
// SEEDBookinfomodal();

server.get('/books', (getbooksdata));

//http://localhost:3001/books?uemail=exambl
function getbooksdata(request, response) {
    let uemail = request.query.uemail
    Bookinfomodal.find({email:uemail  }, function (error, emaildata) {
        if (error) { console.error(error); }
        else { response.send(emaildata); }
    })
}

server.post('/Addbook',(AddbookHandler));

function AddbookHandler(request, response){
    //  requestdata: {
//     email: 'bashartaamneh55@gmail.com',
//     bookname: 'the old see',
//     bookdiscr: 'readed',
//     bookstatus: 'readed book stil',
//     author_name: 'Jonathan Hale',
//     Book_src: 'https://covers.openlibrary.org/b/isbn/0395605733-M.jpg'
//   }
let {email,bookname,bookdiscr,bookstatus,author_name,Book_src}= request.body;
const newbook = new Bookinfomodal({
    email: email,
    bookname: bookname,
    bookdiscr:bookdiscr,
    bookstatus:bookstatus,
    author_name:author_name,
    Book_src:Book_src
})
newbook.save();
    console.log(request.body);
}

/////////////////////////////////////////////////////////////////////////////////////////

server.get('/', (request, response) => {
    response.send("ready to start server");
})


server.get('/test', (request, response) => {
    response.send("all good")
})


server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})
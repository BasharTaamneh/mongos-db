'use strict';

const express = require('express');

const cors = require('cors');

const { request } = require('http');

const server = express();

server.use(cors());
require('dotenv').config();
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

const PORT = process.env.PORT;

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_LOCAL_LINK, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

const { query } = require('express');
///////////////////////////////////////////////
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log('connected to database');
});
//////////////////////////////////////////////

const BookSchema = new mongoose.Schema({
    email: String,
    bookname: String,
    bookdiscr: String,
    bookstatus: String,
    author_name: String,
    Book_src: String,
});


const Bookinfomodal = new mongoose.model('Bookinfo', BookSchema);
////////////////////////////////////////////////////
server.get('/books', (getbooksdata));

//http://localhost:3001/books?uemail=exambl
function getbooksdata(request, response) {
    let uemail = request.query.uemail
    Bookinfomodal.find({ email: uemail }, function (error, emaildata) {
        if (error) { console.error(error); }
        else { response.send(emaildata); }
    })
}
////////////////////////////////////////
server.post('/Addbook', (AddbookHandler));

async function AddbookHandler(request, response) {

    let { email, bookname, bookdiscr, bookstatus, author_name, Book_src } = request.body;
    await Bookinfomodal.create({ email, bookname, bookdiscr, bookstatus, author_name, Book_src })

    Bookinfomodal.find({ email }, function (err, emailData) {
        if (err) {
            console.log('error in getting the data')
        } else {
            console.log(emailData);
            response.send(emailData)
        }
    })
    console.log(request.body);
}

/////////////////////////////////////////////////////////////////////////////////////////

server.delete('/deletbook/:bookId', deletebookHandler);

function deletebookHandler(req, response) {
    // console.log(req)
    // console.log(req.params)
    // console.log(req.params.bookId);

    let email = req.query.uemail;
    console.log(email)
    let bookDataID = req.params.bookId;
    Bookinfomodal.deleteOne({ _id: bookDataID }, (error, bookDataID) => {
        if (error) {
            console.log('error in deleteing the data')
        } else {
            console.log('data deleted', bookDataID)
            Bookinfomodal.find({ email }, function (err, emailData) {
                if (err) {
                    console.log('error in getting the data')
                } else {
                    console.log(emailData);
                    response.send(emailData)
                }
            })
        }
    })



}
////////////////////////////////////////////////////////////////////////////////////////
server.put('/Updatebook/:book_ID', Updatebookhandler);

function Updatebookhandler(request, response) {
    let Book_id = request.params.book_ID
    //   console.log(Book_id)
      console.log('sssssssssss',request.body)
    let {author_name, Book_src, bookname, bookdiscr, bookstatus, uemail } = request.body;

    Bookinfomodal.find({ _id: Book_id }, (error, Book_id) => {
        if (error) {
            console.log('error in updating the data')
        }
        else {
            // console.log(Book_id) 
            Book_id[0].bookname = bookname;
            Book_id[0].bookdiscr = bookdiscr;
            Book_id[0].bookstatus = bookstatus;
            Book_id[0].author_name=author_name;
            Book_id[0].Book_src=Book_src;
            Book_id[0].uemail=uemail;
            Book_id[0].save().then(() => {
                Bookinfomodal.find({ uemail }, function (err, emailData) {
                    if (err) {
                        console.log('error in getting the data')
                    } else {
                        console.log('aaaaaaaaaa'.emailData);
                        response.send(emailData)
                    }
                })
            })
        }
    }
    )
}
////////////////////////////////////////////////////////////////////////////////////////

server.get('/', (request, response) => {
    response.send("ready to start server");
})


server.get('/test', (request, response) => {
    response.send("all good")
})


server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})
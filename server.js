'use strict';

const express = require('express');

const cors = require('cors');

const { request } = require('http');

const server = express();

server.use(cors());

require('dotenv').config();

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
    title: String,
    status: String,
    email: String,
    Booksrc: String,
});


const Bookinfomodal = new mongoose.model('Bookinfo', BookSchema);


function SEEDBookinfomodal() {
    const book1 = new Bookinfomodal({
        title: 'BIG MAGIC',
        status: 'readed',
        email: 'BasharTaamneh55@gmail.com',
        Booksrc:'https://kbimages1-a.akamaihd.net/b3f00c5f-ec69-4df8-8786-8da68bd60901/1200/1200/False/big-magic-7.jpg'
    });
    const book2 = new Bookinfomodal({
        title: 'DARING GREATLY',
        status: 'unreaded',
        email: 'BasharTaamneh55@gmail.com',
        Booksrc:'https://images-na.ssl-images-amazon.com/images/I/816gtATacXL.jpg'
    });
    const book3 = new Bookinfomodal({
        title: 'WHEN',
        status: 'in discover',
        email: 'BasharTaamneh55@gmail.com',
        Booksrc:'https://images-na.ssl-images-amazon.com/images/I/71pjsvmP0XL.jpg'
    });
    book1.save();
    book2.save();
    book3.save();
}


server.get('/books', (getbooksdata));

//http://localhost:3001/books?utitle=exambl
function getbooksdata(request, response) {
    let utitle = request.query.utitle
    Bookinfomodal.find({  }, function (error, status) {
        if (error) { console.error(error); }
        else { response.send(status); }
    })
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
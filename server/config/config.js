
// Estableciendo un puerto según el entorno
process.env.PORT = process.env.PORT || 3000;

//Environment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// DB
let urlDB;

if ( process.env.NODE_ENV === 'dev' ) {
    urlDB = 'mongodb://localhost:27017/insight';
} else {
    urlDB = 'mongodb+srv://k7:sDrxCbBG6JOngg5P@ins.i0nnz.mongodb.net/insight';
}

process.env.KDB = urlDB;

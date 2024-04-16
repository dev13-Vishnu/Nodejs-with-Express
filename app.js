//IMPORT PACKAGE
const express = require ('express');
const moviesRouter = require('./Routes/moviesRoutes');

const app = express();


const logger = function (req,res,next){
    console.log('Custom Middeleware called');
    next();
}


app.use(express.json());
app.use(logger);
app.use(express.static('./public'))
app.use((req,res,next) =>{
    req.requestedAt= new Date().toISOString();
    next();
})


// using routes
app.use('/api/v1/movies',moviesRouter);

module.exports = app;
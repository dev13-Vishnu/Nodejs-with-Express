//IMPORT PACKAGE
const express = require ('express');
const fs = require('fs');

const app = express();

let movies = JSON.parse(fs.readFileSync('./data/movies.json'));

const logger = function (req,res,next){
    console.log('Custom Middeleware called');
    next();
}


app.use(express.json());
app.use(logger);
app.use((req,res,next) =>{
    req.requestedAt= new Date().toISOString();
    next();
})




//ROUTE = HTTP METHOD + URL
// app.get('/',(req,res) =>{
    // res.status(200).send('Hello from server');
    // res.status(200).send('<h4>Hello from server</h4>');
    // res.status(200).json({message:"hello world",status:200});
// });

const getAllMovies = (req,res) => {
    res.status(200).json({
        status: "success",
        time: req.requestedAt,
        count: movies.length,
        data : {
            movies : movies
        }
    })
};

const getMovie = (req,res) => {
    
    const id = req.params.id * 1;
    let movie = movies.find(el => el.id === id);

    if(!movie) {
        return res.status(404).json({
            status : "fail",
            message : "Movie with ID '" + id + "' not found"
        })
    }

    res.status(200).json({
        status:"success",
        data : {
            movie : movie
        }
    });
};

const createMovie = (req,res) => {
    const newId = movies[movies.length-1].id + 1;
    const newMovie = Object.assign({id : newId},req.body)

    movies.push(newMovie);

    fs.writeFile('./data/movies.json',JSON.stringify(movies),(err) => {
        res.status(201).json({
            status : "success",
            data : {
                movie : newMovie
            }
        })
    })
    // res.send('Created');
    // console.log(req.body);
};

const updateMovie = (req,res) => {
    let id = req.params.id * 1
    let movieToUpdate = movies.find (el => el.id === id);
    if(!movieToUpdate) {
        return res.status(404).json({
            status: "fail",
            message : "Movie with ID '"+id+"' not found"
        })
    }
    let index = movies.indexOf(movieToUpdate);

    Object.assign(movieToUpdate,req.body);

    movies[index] = movieToUpdate;

    fs.writeFile('./data/movies.json',JSON.stringify(movies),(err) =>{
        res.status(200).json({
            status : "success",
            data: {
                movie: movieToUpdate
            }
        })
    })
};

const deleteMovie = (req,res) =>{
    let id = req.params.id;
    let movieToDelete = movies.find(el => el.id == id);

    if(!movieToDelete) {
        return res.status(404).json({
            status: "fail",
            message : "Movie with ID '"+id+"' not found"
        })
    }

    let index = movies.indexOf(movieToDelete);
    
    movies.splice(index,1);

    fs.writeFile('./data/movies.json',JSON.stringify(movies),(err) =>{
        res.status(204).send({
            status : "success",
            data: null
        })
    })
};


// app.get('/api/v1/movies',getAllMovies);
// app.get('/api/v1/movies/:id',getMovie)
// app.post('/api/v1/movies',createMovie);
// app.patch('/api/v1/movies/:id',updateMovie);
// app.delete('/api/v1/movies/:id',deleteMovie);

const moviesRouter = express.Router();

moviesRouter.route('/')
.get(getAllMovies)
.post(createMovie);


moviesRouter.route('/:id')
.get(getMovie)
.patch(updateMovie)
.delete(deleteMovie);

app.use('/api/v1/movies',moviesRouter);

//CREATE SERVER
const port = 3004;
app.listen(port,() => {
    console.log('server is started...');
});
//IMPORT PACKAGE
const express = require ('express');
const app = express();

//ROUTE = HTTP METHOD + URL
app.get('/',(req,res) =>{
    // res.status(200).send('Hello from server');
    // res.status(200).send('<h4>Hello from server</h4>');
    res.status(200).json({message:"hello world",status:200});

});

//CREATE SERVER
const port = 3004;
app.listen(port,() => {
    console.log('server is started...');
});
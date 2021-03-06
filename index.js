const express = require('express');

var bodyParser = require('body-parser');

const app = express();

var router =express.Router();

//for socket i am creating a server lie below

const http = require('http').Server(app);

const io = require('socket.io')(http);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

const cors = require('cors');

const mongoose=require('mongoose');
const config=require('./config/database');

const path =require('path');

const authentication=require('./routes/authentication')(router);
const blogs=require('./routes/blog')(router);

const port = process.env.PORT || 8080

mongoose.connect(config.uri,(err)=>{
    if(err){
        console.log('Could Not Connect Database'+ err);
    }else{ 
        console.log(config.secret);
        console.log('connected to database'+ config.db);
    }
});

io.on('connection', (socket) => {

    console.log('user connected');

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('add-message', (message) => {
        io.emit('message', { type: 'new-message', text: message });
        // Function above that stores the message in the database
        console.log(message)
    });

});

app.use(cors({
    origin:'http://localhost:4200'
}))

app.use(express.static(__dirname+'/public'));

app.use('/authentication',authentication);

app.use('/blogs',blogs);

app.get('*',(req,res)=>{
    //res.send('Hello World');
    res.sendFile(path.join(__dirname+'/public/index.html'));
})


http.listen(port,()=>{
    console.log('Listening on port'+ port)
})
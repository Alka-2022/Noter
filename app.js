const express= require('express');
const app= express();
const path = require('path');
const mongoose = require('mongoose');
const notes = require('./models/notes')
// Connect MongoDB at default port 27017.
mongoose.connect('mongodb://localhost:27017/Hackathon', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology:true
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.')
    } else {
        console.log('Error in DB connection: ' + err)
    }
});

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'))
app.set('public',path.join(__dirname,'public'))

app.use(express.static("public"))

app.use(express.urlencoded({extended:true}));


app.get('/',(req,res)=>{
    res.send('hello there')
})

app.get('/notes', (req, res) => {
    res.render('new.ejs')
})

app.post('/notes', async (req, res)=>{
        const n = new notes(req.body);
        await n.save();
        res.redirect('/');

})

app.listen('5000',() => {
    console.log('up and running on 5000');
})
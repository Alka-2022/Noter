const express= require('express');
const app= express();
const path = require('path');
const mongoose = require('mongoose');
const notes = require('./models/notes')
const session=require('express-session')
const flash= require('connect-flash')
const passport = require('passport');
const LocalStrategy= require('passport-local')
const User=require('./models/user')

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

const sessionConfig={
    secret:'somesecret',
    resave:false,
    saveUninitialized:true
}

app.use(session(sessionConfig))

app.use(flash())

app.use((req, res, next)=>{
    res.locals.error=req.flash('error');
    res.locals.success=req.flash('success')
    next();
})

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.get('/',(req, res) =>{
    res.send('helo')
}
)

app.get('/register',(req,res)=>{
    res.render('register.ejs')
})


app.post('/register',async (req, res)=>{
    try{
    const {email,username,password} = req.body;
    const user=new User({email,username})
    const registeredUser=await User.register(user,password)
    console.log(registeredUser)
    req.flash('success','you are successfully registered')
    res.redirect('/login')
    }
    catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
})

app.get('/login',(req, res)=>{
    res.render('login.ejs')
})

app.post('/login',passport.authenticate('local', { failureFlash:true, failureRedirect:'/login'}),(req, res)=>{
    req.flash('success','you are successfully logged in')
        res.redirect('/notes')
})

app.get('/notes',async (req,res)=>{
    const note= await notes.find();
    res.render('show.ejs',{note})
})

app.get('/notes/new', async (req, res) => {
    if(!req.isAuthenticated()){
        req.flash('error','you must be signed in to make notes')
        return res.redirect('/login')
    }
    const note= await notes.find();
    res.render('new.ejs',{note})
})

app.post('/notes', async (req, res)=>{
        const n = new notes(req.body);
        await n.save();
        res.redirect('/notes');

})

app.all('*',(req,res)=>{
    res.render('error.ejs')
})

app.listen('5000',() => {
    console.log('up and running on 5000');
})
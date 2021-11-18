const express = require('express')
const app = express()
const sequelize = require('./database/db')
const cookieParser = require('cookie-parser') 
const cookie = require('cookie-signature')
const uid = require('uid-safe') 
//Setting 
const PORT = process.env.PORT || 3000; 
app.use(express.json())
app.use(express.urlencoded({extends:false})) 
app.use(cookieParser())

//Middleware 
function validateCookie(req, res, next) {
    const {cookies} = req
    console.log(cookies)
    if('session_id' in cookies) {
        console.log('Session ID Exists.')
        if(cookies.session_id === '123456'){
            next();
        }else{
            res.status(403).send({msg: 'Forbidden. Incorrect authorization'})
        }
    }else{
        res.status(403).send({msg: 'Forbidden. Incorrect authorization'})
    }
}
//Routes
app.get('/',  (req, res) => {
    
    res.cookie('session_id',uid.sync(18), {maxAge : 30000 })
    var valor = req.headers.cookie['session_id']
    console.log(v)
    var val = cookie.sign('hola',process.env.COOKIE_SECRET );
    console.log(cookie.unsign(val, process.env.COOKIE_SECRET))
    console.log(cookie.unsign(val, 'luna')) 
    
    res.status(200).json({msg: `here is your cookie ${req.headers.cookie}`})
})
app.get('/protected',validateCookie, (req, res) => {
    res.send(`I have been sent these cookies ${req.headers.cookie}`)
})
//Start 
app.listen(PORT, () => {
    console.log(`DruTest app listening on port ${PORT}`); 
    // Database conection 
    sequelize.authenticate().then(() => {
        console.log(`We're conect to database`)
    })
    .catch(err =>{
        console.log(`error: ${err}`)
    })
})

//cookie-parser para manejar cookies 
//cookie-signature para darle seguridad al valor de la cookie
//
const express = require('express')
const app = express()
const sequelize = require('./database/db')
const cookieParser = require('cookie-parser') 
const cookie = require('cookie-signature')
const uid = require('uid-safe') 
const Session =require('./database/models/Sessions')

//Setting 
const PORT = process.env.PORT || 3000; 
app.use(express.json())
app.use(express.urlencoded({extends:false})) 
app.use(cookieParser(process.env.COOKIE_SECRET))

//Middleware 
async function validateCookie(req, res, next) {
    const {cookies} = req
    if('sessionId' in cookies) {
        if(cookies.sessionId === '123456'){

            const SessionDB = await Session.findOne({ where: { data: 'sessionId=123456' } });
            req.session.session = SessionDB 
            console.log(SessionDBJson)
            if (SessionDB === null) {
            console.log('Not found!');
            } else {
            console.log(SessionDB instanceof Session); // true
            }
            next();
        }else{
            res.status(403).send({msg: 'Forbidden. Incorrect authorization'})
        }
    }else{
        res.status(403).send({msg: 'Forbidden. Incorrect authorization'})
    }
}
reqSaveSesion = (data) => {
    Session.create(
        {
            data: `${data}`
        }
    )
}

//Routes
app.get('/',  async (req, res) => {
    
    res.cookie('sessionId','123456', {maxAge : 60000})
    //var {cookie} = req
    //console.log(cookie)
    //var val = cookie.sign('hola',process.env.COOKIE_SECRET );
    //console.log(cookie.unsign(val, process.env.COOKIE_SECRET))
    //console.log(cookie.unsign(val, 'luna')) 
    reqSaveSesion(req.headers.cookie)
    //res.status(200).json({msg: `here is your cookie ${req.headers.cookie}`})
    res.send(`Views: [x]`)
})
app.get('/protected',validateCookie, (req, res) => {
    res.send(`I have been sent these cookies ${req.headers.cookie}`)
})
//Start 
app.listen(PORT, () => {
    console.log(`DruTest app listening on port ${PORT}`); 
    // Database conection 
    sequelize.sync({force:false}).then(() => {
        console.log(`We're conect to database`)
    })
    .catch(err =>{
        console.log(`error: ${err}`)
    })
})

//cookie-parser para manejar cookies 
//cookie-signature para darle seguridad al valor de la cookie

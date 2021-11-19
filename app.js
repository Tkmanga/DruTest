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

            const SessionDB = await Session.findOne({ where: { data: 'sessionId=123456' } }); //Aca tengo que consultar por la sessionID fija! 
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
reqSaveSesion = (sessionId, data) => {
    let dataJson = JSON.stringify(data)
    Session.create(
        {
            sessionId: `${sessionId}`,
            data: `${dataJson}`
        }
    )
}

//Routes
app.get('/',  async (req, res) => {
    
    res.cookie('sessionId','123456', {maxAge : 60000})
    const {cookies} = req
    if(cookies.sessionId!== undefined){
        req.session = uid.sync(18)
        reqSaveSesion(req.session,cookies.sessionId)
    }
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

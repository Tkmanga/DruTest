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
        const SessionDB = await Session.findOne({attributes: ['data'], where: { sessionId: "Probando" } }); // where sessionId: req.session (not work req.session)
            //Aca tengo que consultar por la sessionID fija! 
            if (SessionDB === null) {
                console.log('Not found!');
            } else {
                console.log(SessionDB); // Object Session 
                next();
            }
    }else{
        //Aqui deberia darle la cookie al user ? seteando tmb el req.session ?
        res.status(403).send({msg: 'Forbidden. Incorrect authorization, try again'})
    }
}
reqSaveSesion = async(sessionId, data) => {

    const SessionDB = await Session.findOne({attributes: ['data'], where: { sessionId: "Probando" } }); // there are any sessinID in db ? 

    if (SessionDB === null) {
        let dataJson = JSON.stringify(data)
        Session.create(
        {
            sessionId: `${sessionId}`,
            data: `${dataJson}`
        }
    )
    } else {
        //Update ! session 
        SessionDB.dataValues.data = 'ABCD'
        await SessionDB.save();
        next();
    }
    
}

//Routes
app.get('/',  async (req, res) => {
    
    res.cookie('sessionId','123456', {maxAge : 60000});
    const {cookies} = req
    if(cookies.sessionId!== undefined){
        req.session = uid.sync(18) //seteando req.session 
        reqSaveSesion(req.session,cookies.sessionId)
    }
    res.send(`Views: [x]`)
})
/*
app.get('/protected',validateCookie, (req, res) => {
    res.send(`I have been sent these cookies ${req.headers.cookie}`)
})

*/
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

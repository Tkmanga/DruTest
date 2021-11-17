const express = require('express')
const app = express()
const sequelize = require('./database/db')
//Setting 
const PORT = process.env.PORT || 3000; 
//Routes
app.get('/',  (req, res) => {
    res.send('Hello World!')
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
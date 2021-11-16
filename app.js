const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000; 

app.get('/', () => {
    res.send('Hello World')
})

app.listen(PORT, () => {
    console.log(`DruTest app listening on port ${PORT}`); 
})
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const postRoute = require('./routes/posts')
const userRoute = require('./routes/users')

app.use(bodyParser.json({limit:'30mb',extended : true}))
app.use(bodyParser.urlencoded({limit:'30mb',extended : true}))
app.use(cors())

const CONNECTION_URL = process.env.CONNECTION_URL
const PORT = process.env.PORT || 5000

mongoose.connect(CONNECTION_URL,{
    useNewUrlParser : true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("database connection successfull");
}).catch((e)=>{
    console.log("database connection failed :" + e.message);
})


app.use('/posts',postRoute)
app.use('/user',userRoute)
app.use('/',(req,res)=>{
    res.send('welcome to memories API')
})

app.listen(PORT,()=>{
    console.log("http://localhost:5000");
})

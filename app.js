var express = require('express')
const logger = require('morgan');
const axios = require('axios');
const list = require('./data');
const firebase = require('./firebase');

var app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(express.static('public'));

app.get('/', (req, res)=>{
    res.sendFile('index.html');
})

/*app.get('/', (req, res) => {
  res.send('Hello World!')
})*/

app.get('/user/:id', (req, res) =>{
    res.send(`User ID is: ${req.params.id}`);
});

app.get('/user', (req, res) =>{
    res.send(`User ID is ${req.query.id}`);
}); 

app.get('/likes', async(req, res) =>{
    var db = firebase.firestore();
    const snapshot = await db.collection('likes').get().catch(e=>console.log(e));
    var results = [];
    if (snapshot.empty){
        console.log('No result');
        res.json([]);
        return;
    }else{
        snapshot.forEach(doc => {
            results.push({id : doc.id, like : doc.data().like})
            console.log(doc.id, '=>', doc.data());
    })
    res.json(results);
    }
});
app.post('/likes', async(req, res) =>{
    let item = req.body;
    let db = firebase.firestore();
    let r = await db.collection('likes').doc(item.collectionId.toString()).set(item);

    res.json({msg : 'ok'});
});

app.delete('/likes/:id', async(req, res) =>{
    let db = firebase.firestore();
    let r = await db.collection('likes').doc(req.params.id).delete();

    res.json({msg : 'deleted'});      
});

//curl -X POST localhost:3000/user -d '{"id" : "nomiyaa", "name" : "Nomi"}' -H "Content-Type: application/json"
app.post('/user', (req, res)=>{
    console.log(req.body.name);
    res.send(req.body);
});

app.get('/musicSearch/:term', async(req,res)=>{
    const params = {
        term : req.params.term,
        entity : "album",

    }
    var response = await axios.get("https://itunes.apple.com/search", {params: params});
    console.log(response.data);
    res.json(response.data);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});


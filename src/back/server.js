const express = require('express');
const cors = require('cors');
const parser = require('body-parser');
const routes = require('./routes');

const app = express();

app.use(cors({
    origin: '*'
}))

app.get('/', function (req, res) {
    res.send('Bonjour le monde');
});

for (const k in routes) {
    app.post(k, parser.json(), async function(req, res) {
        const output = await routes[k](req.body)
        
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(output));
    })
}

app.listen(3000, async () => {
    console.log('server running at http://localhost:3000');
})
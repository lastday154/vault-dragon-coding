const db = require('./db');
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
// use bodyParser to parse json
app.use(bodyParser.json());


const Object = require('./models/object');

app.post('/object', (req, res) => {
	if (req.body.length === 0) {
		res.json({error: 'Please provide key'});
	}

	let object = {};
	let created_at = Date.now();
	for (var key in req.body) {
		object.key = key;
		object.value = {created_at : created_at, value : req.body[key]};
	}

	/* update if the key already exists, otherwise create new record */
	Object.saveObject(
		{key: key}, 
		{$push : {values : object.value}} ,
		{upsert:true},
		(err, result) => {
			if (err) {
				throw err;
			}
			res.json(result);
	})
})

app.get('/object/:key', (req, res) => {
	const key =  req.params.key;
	if (req.query.timestamp) {
		const timestamp = req.query.timestamp;
		res.json(timestamp);
	}
	const query = {
		key: key
	}

	Object.findObject(query, (err, result) => {
		res.json({value : result.value});
	});
})

app.get('/object/', (req, res) => {
	Object.findAllObject((err, result) => {
		res.json(result);
	});
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
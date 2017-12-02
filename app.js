const db = require('./db');
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
// use bodyParser to parse json
app.use(bodyParser.json());

const Object = require('./models/object');

/* create or update existing object */
app.post('/object', (req, res) => {
	if (req.body.length === 0) {
		res.json({error: 'Please provide key'});
	}

	let object = {};
	let created_at = Date.now();
	let value;
	for (var key in req.body) {
		object.key = key;
		value = req.body[key];
		object.value = {created_at : created_at, value : value};
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
			res.json({key : key, value : value, timestamp : created_at});
	})
})

/* get object by key or (key and timestamp) */
app.get('/object/:key', (req, res) => {
	const key =  req.params.key;
	const query = {
		key: key
	}
	Object.findObject(query, (err, result) => {
		console.log(result);
		if (!result.values || result.values.length == 0) {
			res.json({error: 'value is empty'})
		}

		const values = result.values;
		let value = values[values.length-1].value;
		/* if timestamp present in url, find value by timestamp */
		if (req.query.timestamp) {
			values.forEach((val) => {
				if (val.created_at == req.query.timestamp) {
					value = val.value;
				}
			});
		}

		res.json({value : value});
		res.end();
	});
})

/* get all objects */
app.get('/object/', (req, res) => {
	Object.findAllObject((err, result) => {
		res.json(result);
	});
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
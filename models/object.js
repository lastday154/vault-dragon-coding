const mongoose = require('mongoose');

const objectSchema = new mongoose.Schema({
	key: {type: String, required: true},
	values: {type: [{}], required: true}
}, { timestamps: { createdAt: 'created_at' } });

const Object = mongoose.model('Object', objectSchema);

/* create or update existing object */
module.exports.saveObject = (query, object, options, callback) => {
	Object.update(query, object, options, callback);
}

/* find object by query */
module.exports.findObject = (query, callback) => {
	Object.findOne(query).exec(callback);
}

/* get all objects */
module.exports.findAllObject = (callback) => {
	Object.find({}).exec(callback);
}

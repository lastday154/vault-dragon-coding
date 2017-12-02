const mongoose = require('mongoose');

const objectSchema = new mongoose.Schema({
	key: {type: String, required: true},
	values: {type: [{}], required: true}
}, { timestamps: { createdAt: 'created_at' } });

const Object = mongoose.model('Object', objectSchema);

module.exports.saveObject = (query, object, options, callback) => {
	Object.update(query, object, options, callback);
}

module.exports.findObject = (query, callback) => {
	Object.findOne(query).exec(callback);
}

module.exports.findAllObject = (callback) => {
	Object.find({}).exec(callback);
}

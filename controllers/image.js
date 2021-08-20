const Clarifai = require('clarifai');

/*using API Key in Backend to keep it secure*/
const app = new Clarifai.App({
 apiKey: '08a93ffa3c1d49fb9f137cc4123f6504'
});

const handleApiCall = (req, res) => {
app.models
	.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
	.then(data => {
		res.json(data);
	})
	.catch(err => res.status(400).json('unable to activate API'))
}

const handleImagePut = (req, res, db) => {
	const { id } = req.body;
	db('users').where('id', '=', id)								/*Nur ein =, weil hier SQL Syntax*/
		.increment('entries',1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0]);
		})
		.catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
	handleImagePut: handleImagePut
};
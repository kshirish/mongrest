let express = require('express');
let router = express.Router();
let mongoapi = require('../mongo/api.js');
const configDb = require('../config/database.js');
const AUTH_ERROR = { data: 'Authentication Error.', error: true };
const TOKEN_ERROR = { data: 'Token Error.', error: true };

// function setSession(req, userid) {

// 	req.session.userid = userid;
// 	res.cookie('userid', userid, { maxAge: tokenExpirationTimeHours*3600, httpOnly: false });
// }

let generateAccessToken = length => {
	length = length || 20;
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
};

///////////////////////////////////////////////////////////////////////////
//////////////////////// TOKEN GENERATION ////////////////////////////////
/////////////////////////////////////////////////////////////////////////

router.get('/', (req, res, next) => {

	let collection,
		db,
		accessToken,
		query;

	db = mongoapi.getDatabase(configDb.auth.usersDb);

	collection = mongoapi.getCollection(db, configDb.auth.usersCollection);
	query = req.body.query;	// username and password

	mongoapi.findDocs(collection, query, criteria, options, (err, data) => {

		if(!err && data[0].username === query.username && data[0].password === query.password ) {

			accessToken = generateAccessToken();

			collection = mongoapi.getCollection(db, configDb.auth.tokensCollection);
			query = {username: data[0].username};
			postObj = {token: accessToken};

			mongoapi.addDocs(collection, postObj, err => {

		        if(err) {
		            res.status(500).json(TOKEN_ERROR);
		        } else {
		        	res.json({ data: accessToken, error: false });
		        }

		    });

		} else {

			res.status(500).json(AUTH_ERROR);
		}

	});

});

module.exports = router;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CustomModal = require('./models/model');

mongoose.Promise = global.Promise;

// return a mongoose model based on a structure
module.exports.toModel = (name) => {	

	CustomModal.find({name})
		.then(obj => {

			const o = {};

			obj.columns.forEach(column => {

				switch(column.value) {

					case 'String'	: 	o[column.name] = String;	
										break;
					case 'Buffer'	: 	o[column.name] = Buffer;	
										break;
					case 'Boolean'	: 	o[column.name] = Boolean;	
										break;

					case 'Date'		: 	o[column.name] = {type : Date , default : Date.now};
										break;

					case 'Mixed'	: 	o[column.name] = Schema.Types.Mixed;	
										break;

					case 'ObjectId'	: 	o[column.name] = Schema.Types.ObjectId;	
										break;

					case 'Array'	: 	o[column.name] = {type : Array, default : []}	
										break;

		  			case 'ArrayOfString'	: 	o[column.name] = [String];
		  										break;

		  			case 'ArrayOfNumber'	: 	o[column.name] = [Number];
		  										break;

		  			case 'ArrayOfDates'		: 	o[column.name] = [Date];
		  										break;

		  			case 'ArrayOfBuffer'	: 	o[column.name] = [Buffer];
		  										break;

		  			case 'ArrayOfBoolean'	: 	o[column.name] = [Boolean];
		  										break;

		  			case 'ArrayOfMixed'		: 	o[column.name] = [Schema.Types.Mixed];
		  										break;

		  			case 'ArrayOfObjectId'	: 	o[column.name] = [Schema.Types.ObjectId];
		  										break;

					default					: 	o[column.name] = [{
													type: Schema.Types.ObjectId,
													ref: column.value
												}];
				}				

			});

			return mongoose.model(obj.name, new Schema(o));
		});
};


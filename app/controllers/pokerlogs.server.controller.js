'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Pokerlog = mongoose.model('Pokerlog'),
	_ = require('lodash');

/**
 * Create a Pokerlog
 */
exports.create = function(req, res) {
	var pokerlog = new Pokerlog(req.body);
	pokerlog.user = req.user;
    
	pokerlog.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pokerlog);
		}
	});
};

/**
 * Show the current Pokerlog
 */
exports.read = function(req, res) {
	res.jsonp(req.pokerlog);
};

/**
 * Update a Pokerlog
 */
exports.update = function(req, res) {
	var pokerlog = req.pokerlog ;

	pokerlog = _.extend(pokerlog , req.body);

	pokerlog.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pokerlog);
		}
	});
};

/**
 * Delete an Pokerlog
 */
exports.delete = function(req, res) {
	var pokerlog = req.pokerlog ;

	pokerlog.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pokerlog);
		}
	});
};

/**
 * List of Pokerlogs
 */
exports.list = function(req, res) { 
	Pokerlog.find().sort('-created').populate('user', 'displayName').exec(function(err, pokerlogs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pokerlogs);
		}
	});
};

/**
 * Pokerlog middleware
 */
exports.pokerlogByID = function(req, res, next, id) { 
	Pokerlog.findById(id).populate('user', 'displayName').exec(function(err, pokerlog) {
		if (err) return next(err);
		if (! pokerlog) return next(new Error('Failed to load Pokerlog ' + id));
		req.pokerlog = pokerlog ;
		next();
	});
};

/**
 * Pokerlog authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.pokerlog.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

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
    var count = req.query.count || 100;
    var page = (req.query.page || 0)*count;
    console.log('DEBUG list:', page, count);
    //TODO: sort parameter
    Pokerlog.find().sort('-created').skip(page).limit(count).populate('user', 'displayName').exec(function(err, pokerlogs) {
	//Pokerlog.find().sort('-created').populate('user', 'displayName').exec(function(err, pokerlogs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            console.log('DEBUG list:',pokerlogs.length);
			res.jsonp(pokerlogs);
		}
	});
};

exports.count = function(req, res){
    Pokerlog.find().count(function(err, count){
        if(err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(count);
        }
    });
};

exports.data = function(req, res){
  for(var i=0; i < 100; i++){
      Pokerlog.create({location: 'win-river'+i, gametype: 'Limit Holdem', buyins: [100+i], cashout: 200+i });
  }
};

exports.page = function(req, res){
    console.log('page', req.params.page, req.query.count);
    var count = req.query.count || 100;
    var page = (req.params.page || 0)*count;
    //TODO: sort parameter
    Pokerlog.find().sort('-created').skip(page).limit(count).populate('user', 'displayName').exec(function(err, pokerlogs) {
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

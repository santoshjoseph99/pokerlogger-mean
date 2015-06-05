'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Pokerlog Schema
 */
var PokerlogSchema = new Schema({
    location: {
        type: String,
        trim: true,
        required: 'Location cannot be blank'
    },
    start: {
        type: Date,
        default: Date.now
    },
    end: {
        type: Date
    },
    gametype: {
        type:String,
        trim: true,
        required: 'Game type is required'
    },
    cashout: {
        type: Number
    },
    limits: {
        type: String
    },
    placed: {
        type: Number
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    buyins: [Number],
    notes: {
        type: String
    }
});

PokerlogSchema.pre('save', function(next){

    next();
});

mongoose.model('Pokerlog', PokerlogSchema);

/**
 * Created by caleb on 06/12/2016.
 */
var db = require('./../helpers/databaseConfiguration');
var async = require('async');
//var moment = require('moment');
const session = require('./session.js');

exports.performCreateWine = function (req, res) {
    console.log('*< Started create Wine >*');
    async.waterfall([
        function (next) {
            session.sessionManagement(req, next)
        },
        function (document , next) {
            createWine(req, next)
        }
    ], function (error, response) {
        if (error == "Error") {
            console.log('Creating of Wine failed');
            res.status(200).json({createWine: "CreateWineFailure", message: response});
        } else if (error == null && response) {
            console.log('Creating of Wine success');
            var body = response.ops[0];
            var objectToResponse = {
                id: body._id,
                wine_Name: body.wine_Name,
                description: body.description,
                colour: body.colour,
                brew_year: body.brew_year
            };
            res.status(200).json({createWine: "CreateWineSuccess", message: objectToResponse});
        }
        console.log('*> Finished create Wines <*')
    })
};

exports.performFindWines = function (req, res) {
    console.log('*< Started Find Wines >*');
    async.waterfall([
        function (next) {
            session.sessionManagement(req, next)
        },
        function (document, next) {
            findAllWines(req, next)
        }
    ], function (error, response) {
        if (error == "Error") {
            console.log('Find Wines failed');
            res.status(200).json({findWines: "FindWinesFailure", message: response});
        } else if (error == null && response) {
            console.log('Find Wines success');
            res.status(200).json({findWines: "FindWinesSuccess", message: response});
        }
        console.log('*> Finished find Wines <*')
    })

};


/********************************************************************************************************************
 *                      Private functions                                                                           *
 ********************************************************************************************************************/

/**
 * createWine - Create a Wine
 */
var createWine = function (Wine, next) {
    console.log('** createWine **');
    var wine_Name = Wine.body.wine_Name;
    var description = Wine.body.description;
    var colour = Wine.body.colour;
    var brew_year = Wine.body.brew_year;
    objectToInsert = {wine_Name: wine_Name, description: description, colour: colour, brew_year: brew_year};
    console.log('Will add this Wine to the database: '+Wine_id);
    WineTable().insertOne(objectToInsert, {new: true}, function (error, document) {
        if (document) {
            console.log('Wine created');
            next(null, document);
        } else {
            console.log('Wine could not be born');
            next("Error", null);
        }
    })
};

/**
 * findWine - Find a Wine
 */
var findAllWines = function (User, next) {
    console.log('** findWine **');
    var user = family.body.username;
    console.log('Finding Wines for User: '+user);
    taskTable().find({username: user}).toArray(function (error, document) {
        if (document.length == 0) {
            console.log('No Wines found, document: '+document);
            next("Error", 'No Wines found.')
        } else if (document.length > 0) {
            console.log('Wines found');
            next(null, document);
        } else {
            console.log('Something went wrong');
            next("Error", 'Something went wrong');
        }
    })
};

/********************************************************************************************************************
 *                      Private util functions                                                                      *
 ********************************************************************************************************************/

function WineTable() {
    return db.get().collection('wines');
}
/**
 * Created by caleb on 06/12/2016.
 */
var db = require('./../helpers/databaseConfiguration');
var async = require('async');
//var moment = require('moment');
const session = require('./session.js');
var ObjectID = require('mongodb').ObjectID

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
                username: body.username,
                description: body.description,
                colour: body.colour,
                brew_year: body.brew_year,
                quantity: body.quantity
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

exports.performUpdateWine = function (req, res) {
    console.log('*< Started Update of Wines >*');
    async.waterfall([
        function (next) {
            session.sessionManagement(req, next)
        },
        function (document, next) {
            updateWine(req, next)
        }
    ], function (error, response) {
        if (error == "Error") {
            console.log('Update Wines failed');
            res.status(200).json({updateWinesStatus: "UpdateWinesFailure", message: response});
        } else if (error == null && response) {
            console.log('Update Wines call successful');
            res.status(200).json({updateWinesStatus: "UpdateWinesSuccess", message: response});
        }
        console.log('*> Finished update Wines <*')
    })

};

exports.performDeleteWine = function (req, res) {
    console.log('*< Started Delete Wine >*');
    async.waterfall([
        function (next) {
            session.sessionManagement(req, next)
        },
        function (document, next) {
            findAllWines(req, next)
        },
        function (document, next) {
            deleteWine(req, document, next)
        }
    ], function (error, response) {
        if (error == "Error") {
            console.log('Deletion of Wine failed');
            res.status(200).json({deleteWine: "DeleteWineFailure", message: response});
        } else if (error == null && response) {
            console.log('Deletion of Wine success');
            res.status(200).json({deleteWine: "DeleteWineSuccess", message: "Removed"});
        }
        console.log('*> Finished delete Wine <*')
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
    var user = User.body.username;
    console.log('Finding Wines for User: '+user);
    wineTable().find({username: user}).toArray(function (error, document) {
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
/**
 * updateQuantity - Update how many wines you have
 */
var updateWine = function(Wine, next) {
    console.log('** Update Wine **');
    var uWwine_Id = Wine.body.wineId;
    var uWwineName = Wine.body.wine_Name;
    var uWusername = Wine.body.username;
    var uWdescription = Wine.body.description;
    var uWcolour = Wine.body.colour;
    var uWbrew_year = Wine.body.brew_year;
    var uWquantity = Wine.body.quantity;
    console.log('Updating this Wine: '+uWwine_Id+' With wine name: '+uWwineName);
    wineTable().updateOne(
        { '_id' : ObjectID(uWwine_Id) },
        { $set: {
            wine_Name: uWwineName,
            username: uWusername,
            description: uWdescription,
            colour: uWcolour,
            brew_year: uWbrew_year,
            quantity: uWquantity
        } }, function (error, document) {
            //console.log(document);
            console.log('ModifiedCount: '+document.modifiedCount);
            console.log('MatchedCount: '+document.matchedCount);
            if (document.modifiedCount == 0) {
                console.log('Nothing updated')
                next(null, "Nothing updated");
            } else if (document) {
                console.log('Wine updated');
                next(null, "Successful");
            } else {
                console.log('Wine could not be updated');
                next("Error", null);
            }
        })
};

/**
 * deleteWine - Delete a Wine
 */
var deleteWine = function (wine, document, next) {
    console.log('** deleteWine **');
    console.log(document);
    var wineId = Wine.body.wineId;
    console.log('Deleting this wine: '+wineId);
    wineTable().remove({_id: wineId }, function (error, document) {
        if (document) {
            console.log('Wine deleted');
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

function wineTable() {
    return db.get().collection('wines');
}
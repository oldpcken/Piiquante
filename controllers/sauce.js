// in controllers/sauce.js

const Sauce = require('../models/sauce');
const fs = require('fs');

// Retrieve All of the Sauces
exports.getAllSauces = (req, res, next) => {

    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => {
            res.status(400).json({
                error: error
            });
        });
};

// Create a sauce for the database
exports.createSauce = (req, res, next) => {

    const url = req.protocol + '://' + req.get('host');

    console.log(url);

    req.body.sauce = JSON.parse(req.body.sauce);

    const sauce = new Sauce({
        userId: req.body.sauce.userId,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: url + '/images/' + req.file.filename,
        heat: req.body.sauce.heat 
    });

    console.log(sauce);

    sauce.save()
        .then(() => {
            res.status(201).json({
                message: 'Sauce Successfully Created!'
            });
        })
        .catch((error) => {
            res.status(400).json({
                error: error
            });
        });
};

// Select one sauce
exports.getOneSauce = (req, res, next) => {

    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch((error) => {
            res.status(404).json({
                error: error
            });
        });
};

// Modify a sauce with or without an image change
exports.modifySauce = (req, res, next) => {
    
    let updatedSauce = new Sauce({_id: req.params._id});

    Sauce.findOne({_id: req.params.id})
        .then((oldSauce) => {
            if (!oldSauce) {
                return res.status (404).json({
                    error: new Error('Sauce Not Found!')
                });
            }
            if (oldSauce.userId !== req.auth.userId) {
                return res.status (403).json({ 
                    error: new Error('403: Unauthorized Request!')
                });
            }
            if (req.file) {

                req.body.sauce = JSON.parse(req.body.sauce);
                const url = req.protocol + '://' + req.get('host');
                const filename = oldSauce.imageUrl.split('/images/')[1];
                fs.unlink('images/' + filename, () => {
                    // if (error) {
                    //     console.log(error);
                    //     throw error;
                    // }
                });
                
                updatedSauce = {
                    _id: req.params.id,
                    userId: req.body.sauce.userId,
                    name: req.body.sauce.name,
                    manufacturer: req.body.sauce.manufacturer,
                    description: req.body.sauce.description,
                    mainPepper: req.body.sauce.mainPepper,
                    imageUrl: url + '/images/' + req.file.filename,
                    heat: req.body.sauce.heat,                    
                } 
            } else {
                updatedSauce = {
                    _id: req.params.id,
                    userId: oldSauce.userId,
                    name: req.body.name,
                    manufacturer: req.body.manufacturer,
                    description: req.body.description,
                    mainPepper: req.body.mainPepper,
                    imageUrl: req.body.imageUrl, 
                    heat: req.body.heat,                                          
                };
            }
            
            Sauce.updateOne({_id: req.params.id}, updatedSauce)
                .then(() => {
                    res.status(201).json({
                        message: 'Sauce Successfully Updated!'
                    });
                })
                .catch((error) => {
                    res.status(400).json({
                        error: error
                    });
                });
        });
        
       
};

// User owned delete of a sauce
exports.deleteSauce = (req, res, next) => {

    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (!sauce) {
                return res.status (404).json({
                    error: new Error('Sauce Not Found!')
                });
            }
            // if (req.sauce.userId !== req.auth) {
            //     return res.status(403).json({
            //         error: new Error('403: Unauthorized Request!')
            //     })
            // }
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink('images/' + filename, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => {
                        res.status(200).json({
                            message: 'Your Sauce Has Been Deleted!'
                        });
                    })
                    .catch((error) => {
                        res.status(400).json({
                            error: error
                        });
                    });
            });
        
        })
        .catch((error) => {
            res.status(500).json({ 
                error: error
            });
        });
};

// Like or dislike a sauce, track those users
exports.likeOrDislikeSauce = (req, res, next) => {
    
    // Sauce.findOne({ _id: req.params.id })
    //     .then((sauce) => {
    //         req.body.sauce = JSON.parse(req.body.sauce);    
    //         const likeReqest = req.body.like
    //         sauce = {
    //             likes: sauce.likes,
    //             dislikes: sauce.dislikes,
    //             usersLiked: sauce.usersLiked,
    //             usersDisliked: sauce.usersDisliked
    //         }      
    //         if (!sauce) {
    //             return res.status (404).json({
    //                 error: new Error('Sauce not found!')
    //             });
    //         }
    //         if (sauce.userId !== req.auth.userId) {
    //             return res.status(403).json({
    //                 error: new Error('403: unauthorized request')
    //             });
    //         }
    // go through a conditional to add or remove likes and userIds from the arrays
    //         if (likeRequest === 1) {
    //          *  add 1 to req.body.likes count
    //             req.body.likes++
    //          *  add userId to the userLikes array
    //             push.req.body.usersLiked(usersLiked);    
    //         }
    //         if (likeRequest === -1) {
    //           * add 1 to req.body.disLikes count
    //             req.body.dislikes++
    //           * add userId to the userDislikes array    
    //             push.req.body.usersDisliked(usersDisliked);        
    //         }
    //         if (likeRequest === 0) {
    //             subtract 1 from likes or dislikes
    //             remove userId from the userLikes array      
    //             remove userId from the userDislikes array         
    //         }
    // Sauce.updateOne({_id: req.params.id}, sauceUpdate)
    //     .then(() => {
    //         res.status(201).json({
    //             message: 'Like or Dislike Processed!'
    //         });
    //     })
    //     .catch((error) => {
    //         res.status(400).json({
    //             error: error
    //         });
    //     });
    //     };
    // });
    
    // create an empty update object
    // sauceUpdate = {
    //    empty object goes here
    // } 
       
};
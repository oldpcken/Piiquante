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
                    error: new Error('404: Sauce Not Found!')
                });
            }
            if (oldSauce.userId !== req.auth.userId) {
                return res.status (401).json({ 
                    error: new Error('401: Unauthorized Request!')
                });
            }
            if (req.file) {
                req.body.sauce = JSON.parse(req.body.sauce);
                const url = req.protocol + '://' + req.get('host');
                const filename = oldSauce.imageUrl.split('/images/')[1];
                fs.unlink('images/' + filename, () => {
                    if (error) {
                        console.log(error);
                        throw error;
                    }
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
                    error: new Error('404: Sauce Not Found!')
                });
            }
            if (sauce.userId !== req.auth.userId) {
                return res.status(401).json({
                    error: new Error('401: Unauthorized Request!')
                })
            }
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
        
    const userId = req.body.userId;
    const likeRequest = req.body.like;
    
    Sauce.findOne({ _id: req.params.id})
        .then((oldSauce) => {
            if (!oldSauce) {
                return res.status (404).json({
                    error: new Error('404: Sauce Not Found!')
                });
            }
            console.log('old found sauce is ', oldSauce);

            console.log('req-body is ', req.body); 

            // console.log('new sauce is ', Sauce);
            // const sauceObj = req.body.sauce;
            // console.log('sauceObj is ', sauceObj);
            // req.body.sauce = JSON.parse(req.body.sauce);

            console.log('the like request is ', likeRequest);

            // create update object with current sauce values
            sauceUpdate = {
                likes: oldSauce.likes,
                dislikes: oldSauce.dislikes,
                usersLiked: oldSauce.usersLiked,
                usersDisliked: oldSauce.usersDisliked
            };
            
            const userAlreadyLiked = oldSauce.usersLiked.includes(userId);
            const userAlreadyDisliked = oldSauce.usersDisliked.includes(userId);

            console.log('likes = ', oldSauce.likes);
            console.log('dislikes = ', oldSauce.dislikes);
            console.log('users liked array: ', oldSauce.usersLiked);
            console.log('users disliked array: ', oldSauce.usersDisliked);

            if (likeRequest < -1 || likeRequest > 1) {
                return res.status(400).json({ 
                    message: 'Like Request is Invalid!'
                });
            }

            // go through a conditional to add or remove likes and userIds from the arrays
            if (likeRequest === 1 && !userAlreadyLiked) {
                sauceUpdate.likes++;                  // add 1 to likes count
                sauceUpdate.usersLiked.push(userId);  // add userId to the userLikes array
             }
            if (likeRequest === -1 && !userAlreadyDisliked) {
                sauceUpdate.dislikes++;                  // add 1 to disLikes count
                sauceUpdate.usersDisliked.push(userId);  // add userId to the userDislikes array         
            }
            if (likeRequest === 0) {
                // remove userId from the userLikes array if there & subtract 1 from likes 
                    if (sauceUpdate.usersLiked.includes(userId)) {
                        sauceUpdate.usersLiked.pull(userId);
                        sauceUpdate.likes--;
                    }
                // remove userId from the userDislikes array if there & subtract 1 from dislikes
                    if (sauceUpdate.usersDisliked.includes(userId)) {
                        sauceUpdate.usersDisliked.pull(userId);
                        sauceUpdate.dislikes--;
                    }  
            }
            Sauce.updateOne({_id: req.params.id}, sauceUpdate)
                .then(() => {
                    res.status(201).json({
                        message: 'Like or Dislike Processed!'
                    });
                })
                .catch((error) => {
                    res.status(400).json({
                    error: error
                });
            });
        })
        .catch((error) => {

            console.log(error);
            
            res.status(400).json({
                error: error
            });
    //     };
    });       
};
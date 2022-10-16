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
  
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (!sauce) {
                return res.status (404).json({
                    error: new Error('Sauce not Found!')
                });
            }
            if (sauce.userId !== req.auth.userId) {
                return res.status(403).json({
                    error: new Error('403: Unauthorized Request!')
                });
            }
        });

    // let sauce = new Sauce({ _id: req.params._id });

    console.log('sauce.userid is ', sauce.userid);
    console.log('req.auth.userid is ', req.auth.userid);

    //   if (req.file) {
    //       const url = req.protocol + '://' + req.get('host');
    //       req.body.sauce = JSON.parse(req.body.sauce);
    //       sauce = {
    //           _id: req.params.id,
    //           userId: req.body.sauce.userId,
    //           name: req.body.sauce.name,
    //           manufacturer: req.body.sauce.manufacturer,
    //           description: req.body.sauce.description,
    //           mainPepper: req.body.sauce.mainPepper,
    //           imageUrl: url + '/images/' + req.file.filename,
    //           heat: req.body.sauce.heat   
    //       };
    //   } else {
    //       sauce = {
    //           _id: req.params.id,
    //           userId: req.body.sauce.userId,
    //           name: req.body.sauce.name,
    //           manufacturer: req.body.sauce.manufacturer,
    //           description: req.body.sauce.description,
    //           mainPepper: req.body.sauce.mainPepper,
    //           imageUrl: req.body.sauce.imageUrl,
    //           heat: req.body.sauce.heat   
    //       };
    //   }
    
    // Sauce.updateOne({_id: req.params.id}, sauce)
    //     .then(() => {
    //         res.status(201).json({
    //             message: 'Sauce updated successfully!'
    //         });
    //     })
    //     .catch((error) => {
    //         res.status(400).json({
    //             error: error
    //         });
    //     });
};

// User owned delete of a sauce
exports.deleteSauce = (req, res, next) => {

    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId !== req.auth.userId) {
                return res.status(403).json({
                    error: new Error('403: Unauthorized Request!')
                });
            }
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink('images/' + filename, () => {
            Sauce.deleteOne({_id: req.params.id})
                .then(() => {
                    res.status(200).json({
                        message: 'Your Sauce has been Deleted!'
                    });
                })
                .catch((error) => {
                    res.status(400).json({
                        error: error
                    });
                });
        })
        .catch((error) => {
            res.status(500).json({ 
                error: error
            });
        });
    });
};

// Like or dislike a sauce, track those users
exports.likeOrDislikeSauce = (req, res, next) => {
    // Sauce.findOne({ _id: req.params.id })
    //     .then((sauce) => {
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
    //     });
    
    // if (req.file) {
    //     const url = req.protocol + '://' + req.get('host');
    //     req.body.sauce = JSON.parse(req.body.sauce);
    //     sauce = {
    //         _id: req.params.id,
    //         likes: req.body.sauce.likes,
    //         dislikes: req.body.sauce.dislikes,
    //         usersLiked: req.body.sauce.usersLiked,
    //         usersDisliked: req.body.sauce.usersDisliked      
    //     };
    // }
  
    // Sauce.updateOne({_id: req.params.id}, sauce)
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
    
};
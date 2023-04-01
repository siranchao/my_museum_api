const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = require('./models/userModel');
const dotenv = require("dotenv");
dotenv.config();

let mongoDBConnectionString = process.env.MONGO_URL;

let User;

module.exports.connect = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(mongoDBConnectionString);

        db.on('error', err => {
            reject(err);
        });

        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

module.exports.registerUser = function (userData) {
    return new Promise(function (resolve, reject) {

        if (userData.password != userData.password2) {
            reject("Passwords do not match");
        } else {

            bcrypt.hash(userData.password, 10).then(hash => {

                userData.password = hash;

                let newUser = new User(userData);

                newUser.save().then(() => {
                    resolve({ msg: "User successfully registered", user: newUser });
                }).catch(err => {
                    if (err.code == 11000) {
                        reject("User Name already taken");
                    } else {
                        reject("There was an error creating the user: " + err);
                    }
                })
            }).catch(err => reject(err));
        }
    });
};

module.exports.checkUser = function (userData) {
    return new Promise(function (resolve, reject) {

        User.findOne({ userName: userData.userName })
            .exec()
            .then(user => {
                bcrypt.compare(userData.password, user.password).then(res => {
                    if (res === true) {
                        resolve(user);
                    } else {
                        reject("Incorrect password for user " + userData.userName);
                    }
                });
            }).catch(err => {
                reject("Unable to find user " + userData.userName);
            });
    });
};

module.exports.getFavorites = function (id) {
    return new Promise(function (resolve, reject) {

        User.findById(id)
            .exec()
            .then(user => {
                resolve(user.favorites)
            }).catch(err => {
                reject(`Unable to get favorites for user with id: ${id}`);
            });
    });
}

module.exports.addFavorite = function (id, favId) {

    return new Promise(function (resolve, reject) {

        User.findById(id).exec().then(user => {
            if (user.favorites.length < 50) {
                User.findByIdAndUpdate(id,
                    { $addToSet: { favorites: favId } },
                    { new: true }
                ).exec()
                    .then(user => { resolve(user.favorites); })
                    .catch(err => { reject(`Unable to update favorites for user with id: ${id}`); })
            } else {
                reject(`Unable to update favorites for user with id: ${id}`);
            }

        })

    });
}

module.exports.removeFavorite = function (id, favId) {
    return new Promise(function (resolve, reject) {
        User.findByIdAndUpdate(id,
            { $pull: { favorites: favId } },
            { new: true }
        ).exec()
            .then(user => {
                resolve(user.favorites);
            })
            .catch(err => {
                reject(`Unable to update favorites for user with id: ${id}`);
            })
    });
}

module.exports.getHistory = function (id) {
    return new Promise(function (resolve, reject) {

        User.findById(id)
            .exec()
            .then(user => {
                resolve(user.history)
            }).catch(err => {
                reject(`Unable to get history for user with id: ${id}`);
            });
    });
}

module.exports.addHistory = function (id, historyId) {
    return new Promise(function (resolve, reject) {

        User.findById(id).exec().then(user => {
            if (user.favorites.length < 50) {
                User.findByIdAndUpdate(id,
                    { $addToSet: { history: historyId } },
                    { new: true }
                ).exec()
                    .then(user => { resolve(user.history); })
                    .catch(err => { reject(`Unable to update history for user with id: ${id}`); })
            } else {
                reject(`Unable to update history for user with id: ${id}`);
            }
        })
    });
}

module.exports.removeHistory = function (id, historyId) {
    return new Promise(function (resolve, reject) {
        User.findByIdAndUpdate(id,
            { $pull: { history: historyId } },
            { new: true }
        ).exec()
            .then(user => {
                resolve(user.history);
            })
            .catch(err => {
                reject(`Unable to update history for user with id: ${id}`);
            })
    });
}
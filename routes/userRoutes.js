const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const userService = require("../user-service");


router.post("/register", (req, res) => {
    userService.registerUser(req.body)
        .then((val) => {
            res.json({
                "message": val.msg,
                "token": generateToken(val.id)
            });
        }).catch((msg) => {
            res.status(422).json({ "message": msg });
        });
});

router.post("/login", (req, res) => {
    userService.checkUser(req.body)
        .then((user) => {
            res.json({
                "message": "login successful",
                "token": generateToken(user._id)
            });
        }).catch(msg => {
            res.status(422).json({ "message": msg });
        });
});

router.get("/favorites", (req, res) => {
    userService.getFavorites(req.user._id)
        .then(data => {
            res.json(data);
        }).catch(msg => {
            res.status(422).json({ error: msg });
        })

});

router.put("/favorites/:id", (req, res) => {
    userService.addFavorite(req.user._id, req.params.id)
        .then(data => {
            res.json(data)
        }).catch(msg => {
            res.status(422).json({ error: msg });
        })
});

router.delete("/favorites/:id", (req, res) => {
    userService.removeFavorite(req.user._id, req.params.id)
        .then(data => {
            res.json(data)
        }).catch(msg => {
            res.status(422).json({ error: msg });
        })
});

router.get("/history", (req, res) => {
    userService.getHistory(req.user._id)
        .then(data => {
            res.json(data);
        }).catch(msg => {
            res.status(422).json({ error: msg });
        })

});

router.put("/history/:id", (req, res) => {
    userService.addHistory(req.user._id, req.params.id)
        .then(data => {
            res.json(data)
        }).catch(msg => {
            res.status(422).json({ error: msg });
        })
});

router.delete("/history/:id", (req, res) => {
    userService.removeHistory(req.user._id, req.params.id)
        .then(data => {
            res.json(data)
        }).catch(msg => {
            res.status(422).json({ error: msg });
        })
});


//generate JWT token
const generateToken = (id) => {
    const payload = { id }
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}


module.exports = router
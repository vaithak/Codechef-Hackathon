const router = require('express').Router();

const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/');
    } else {
        next();
    }
};

router.get('/', authCheck, (req, res) => {
    res.render('profile', { user: req.user.codechefId });
});

router.get('/notes', authCheck, (req, res) => {
    res.render('notes', { user: req.user.codechefId });
});

module.exports = router;

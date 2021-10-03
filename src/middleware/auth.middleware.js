
exports.authCheck = (req, res, next) => {
    const is_athenticate = req?.session?.user_session?.is_athenticate;
    if (is_athenticate) {
        next();
    } else {
        res.redirect('/login')
    }
};

exports.authNotCheck = (req, res, next) => {
    const is_athenticate = req?.session?.user_session?.is_athenticate;
    if (is_athenticate) {
        res.redirect('/dashboard')
    } else {
        next();
    }
};


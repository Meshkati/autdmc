const asyncMiddleware = fn => (req, res, next) => {
    console.log(req.body);
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };

module.exports = asyncMiddleware;

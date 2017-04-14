/**
 * Created by sergey on 03.03.2017.
 */
module.exports = (req,res,next)=>{
    if (!req.session.cartMaxAge){
        next();
    } else if (req.session.cartMaxAge < Date.now()){
        delete req.session.cart;
        delete req.session.cartMaxAge;
        next();
    } else {
        next();
    }
};
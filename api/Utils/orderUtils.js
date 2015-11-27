/**
 * Created by Ezehollar on 26/11/2015.
 */

var Order = mongoose.model('Order');
var Pizza = mongoose.model('Pizza');
var User = mongoose.model('User');
var Class = mongoose.model('Class');


module.exports.addPizzaIntoOrder = function (pizza, order, req, res) {

    /*Order.findOne({
            _id: order._id
        }, function (err, user) {
            //console.log(user);
            if (err || !user) {
                console.log(err);
                return next(new UnauthorizedAccessError("401", {
                    message: 'Invalid username or password'
                }));
            }
    var order1;*/
    return order;
};
const { attributes } = require('structure');

const Order = attributes({
    id: Number,
    username: {
        type: String,
        required: true
    },
    productOrder: {
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    deletedAt: {
        type: Date
    }
})(class Order {
});

module.exports = Order;

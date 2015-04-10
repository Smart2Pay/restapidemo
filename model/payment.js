/*Payment model*/

var Payment = function (data) {  
    this.data = data;
}

Payment.prototype.data = {}

Payment.prototype.getUserJSON = function () {  
    return JSON.stringify(this.data)
}


module.exports = Payment;
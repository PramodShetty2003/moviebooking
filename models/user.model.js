const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    userid:{ type:Number, unique:true},
    email:{ type:String, required: true},
    first_name:{ type:String, required: true},
    last_name:{ type:String, required: true},
    username:{ type:String, required: true},
    contact: { type: String, required: true },
    password:{ type:String, required: true},
    role:{ type:String, required: true},
    isLoggedIn:{ type:Boolean , required: true},
    uuid:{ type:String ,unquie:true},
    accesstoken:{ type:String , unquie:true},    
    // instead of coupons i have used coupens as it was provided in lms course mongodb insertion data , so that data clashes doesn't happens 
    coupens:[
        {
            id: { type:Number, required: true},
            discountValue: { type:Number, required: true}
        }
    ],
    bookingRequests:[
        {
            reference_number: { type:Number },
            coupon_code: { type:Number },
            show_id: { type:Number },
            tickets:[
                {type:Number}
            ]
        }
    ]
});


module.exports = mongoose.model('User', userSchema);
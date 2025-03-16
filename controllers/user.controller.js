const { User } = require('../models');
const {v4: uuidv4} = require('uuid');

const signUp = async (req,res)=>{
    const {  email_address ,first_name, last_name ,mobile_number ,password } = req.body;
    console.log(req.body);
    // For finding the last userid to assign to new user incremented id
    const lastUser = await User.findOne().sort({ userid: -1 });

    // assign the role if not provided
    const role = req.body.role || "user";
    // generate username
    const username = first_name + last_name;
    try{
    // check if user already exists
    const existingUser = await User.findOne({email:email_address});
    if(existingUser){
      return res.status(400).json({message:"User already exists"});
    }
    // assign default coupons based on role
    let defaultCoupons = [];
    if (role === "user") {
      defaultCoupons = [
        { id: 101, discountValue: 101 }, 
        { id: 102, discountValue: 102 }  
      ];
    } else if (role === "admin") {
      defaultCoupons = [
        { id: 103, discountValue: 103 }, 
        { id: 104, discountValue: 104 }
      ];
    }
    // generate uuid
    const user_uid = uuidv4();
    // encode password
    const encoded_password = Buffer.from(password).toString('base64');
    
    const newUser = new User({
    userid: lastUser ? lastUser.userid + 1 : 1,
    email:email_address,
    first_name: first_name,
    last_name: last_name,
    username: username,
    contact: mobile_number,
    password: encoded_password,
    role: role,
    isLoggedIn:false,
    uuid:user_uid,
    accesstoken:"",    
    coupens:defaultCoupons,
    bookingRequests:[]
    });
    console.log(newUser);
    // Save user to the database
    await newUser.save();

    // Return success response
    res.status(201).json({ message: "User created successfully", user: newUser });
    }catch(error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = { signUp};
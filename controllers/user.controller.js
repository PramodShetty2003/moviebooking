const { User } = require('../models');
const {v4: uuidv4} = require('uuid');
const TokenGenerator = require("uuid-token-generator");

// Function to generate a unique reference number
const generateReferenceNumber = () => {
     // Random 5-digit number
    return Math.floor(10000 + Math.random() * 90000);
};

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

const login = async (req,res)=>{
   try {
    // Extract username & password from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return res.status(400).json({ message: "Missing Authorization header" });
    }

    // Decode Base64 username:password
    const base64Credentials = authHeader.split(" ")[1];
    const decodedCredentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [username, password] = decodedCredentials.split(":");

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    /* Compare password :- assuming passwords are stored in Base64 encoded format ,
     if not stored then update the password with encoded format */
    const isBase64 = (str) => {
        try {
          return Buffer.from(str, "base64").toString("base64") === str;
        } catch (err) {
          return false;
        }
      };
      
      let storedPassword = user.password;
      
      // If password is NOT encoded, encode it and update the database
      if (!isBase64(storedPassword)) {
        storedPassword = Buffer.from(storedPassword, "utf-8").toString("base64");
      
        // Update the database with the encoded password
        user.password = storedPassword;
        await user.save();
      }
      
      // Decode the stored password for matching
      const decodedPassword = Buffer.from(storedPassword, "base64").toString("utf-8");
      
      // Compare passwords
      if (decodedPassword !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }      
    
    //Check if the uuid is already present in the database or not and generate uuid if not present.
    if (!user.uuid || user.uuid === "") {
        user.uuid = uuidv4();
    }

    // Generate access token using uuid-token-generator
    const tokGen = new TokenGenerator(256, TokenGenerator.BASE62);
    const accessToken = tokGen.generate(); // Generates a unique token
    
    // Update user's access token in the database
    user.accesstoken = accessToken;
    user.isLoggedIn = true;
    await user.save();

     // Set access token in header for client to pick up
     res.setHeader("access-token", accessToken);

     // Return success response with access token
     res.status(200).json({
       id: user.uuid,
       "access-token": accessToken,
       message: "Login successful",
     });
      
   }catch(error){
    res.status(500).json({ message: "Internal server error", error: error.message });
   }
};

const logout = async(req,res)=>{
    try {
        // Extract access token and user UUID from headers
        const accessToken = req.headers.authorization?.split(" ")[1]; 
        const uuid = req.headers["uuid"]; 
        // Check if access token and UUID are provided
        if (!accessToken || !uuid) {
          return res.status(400).json({ message: "Missing access token or UUID" });
        }
    
        // Find the user with the given UUID
        const user = await User.findOne({ uuid });
        // Check if user exists
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        // Clear the access token in DB (if stored)
        user.accesstoken = "";
        user.isLoggedIn = false;
    
        await user.save();
    
        res.status(200).json({ message: "Logout successful" });
      } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
};

const getCouponCode = async (req, res) => {
    try {
        console.log("Headers received:", req.headers); // Debugging

        // Extract access token
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(400).json({ message: "Missing Authorization header" });
        }

        const accessToken = authHeader.split(" ")[1];

        if (!accessToken) {
            return res.status(400).json({ message: "Invalid Authorization format" });
        }

        console.log("Extracted accessToken:", accessToken); // Debugging

        // Find the user by access token
        const user = await User.findOne({ accesstoken: accessToken });
  
      // Check if user exists
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the user has any coupons
      if (!user.coupens || user.coupens.length === 0) {
        return res.status(404).json({ message: "No coupons available" });
      }
  
      // Get coupon code from query params
      const { code } = req.query;
      if (!code) {
        return res.status(400).json({ error: "Coupon code is required" });
      }
  
      const couponCode = parseInt(code, 10);
  
      // Check if the user has this specific coupon
      const userCoupon = user.coupens.find(c => c.id === couponCode);
      if (!userCoupon) {
        return res.status(400).json({ error: "Coupon not available for user" });
      }
  
      // Remove the used coupon from the user's coupons array
      user.coupens = user.coupens.filter(c => c.id !== couponCode);
      await user.save();
  
      // Return the discount value
      return res.status(200).json({
        discountValue: userCoupon.discountValue,
        message: "Coupon applied successfully",
      });
  
    } catch (error) {
      console.error("Error applying coupon:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
 // To book the show 
 const bookShow = async(req,res)=>{
    const { customerUuid, bookingRequest } = req.body;
    console.log(customerUuid , bookingRequest);
    try{
    if (!customerUuid || !bookingRequest) {
        return res.status(400).json({ error: "Invalid request data" });
      }
  
      // Find the user by uuid
      const user = await User.findOne({ uuid: customerUuid });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
    // Generate unique reference number
    const referenceNumber = generateReferenceNumber();

    // Create new booking object
    const newBooking = {
      reference_number: referenceNumber,
      coupon_code: bookingRequest.coupon_code,
      show_id: bookingRequest.show_id,
      tickets: bookingRequest.tickets.map(Number),
    };
    // Add new booking to user's bookingRequests array
    user.bookingRequests.push(newBooking);
    // Save user to database
    await user.save();
    // Return success response
    res.status(201).json({
        message: "Booking Confirmed",
        reference_number: referenceNumber,
        updatedBookings: user.bookingRequests,
      });
    }catch(error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
 };

module.exports = { signUp , login , logout , getCouponCode ,bookShow};
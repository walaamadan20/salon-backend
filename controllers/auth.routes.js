const User = require("../models/User")

const router = require("express").Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const verifyToken = require("../middleware/verify-token")


router.post("/sign-up",async(req,res)=>{
    try{
        const foundUser = await User.findOne({username:req.body.username})
        
        if(foundUser){
            return res.status(409).json({err:"username already taken"})
        }
        const createdUser = await User.create({
            username:req.body.username,
            hashedPassword: bcrypt.hashSync(req.body.password,12),
            isAdmin:req.body.isAdmin
        })
        console.log(createdUser)


        const convertedObject = createdUser.toObject()
        delete convertedObject.hashedPassword
        res.json(convertedObject)


    if (foundUser) {
      return res.status(409).json({ err: "username already taken" });
    }

    const createdUser = await User.create({
      username: req.body.username,
      hashedPassword: bcrypt.hashSync(req.body.password, 12),
      isAdmin: req.body.isAdmin,
    });

    const userObj = createdUser.toObject();
    delete userObj.hashedPassword;

    res.json(userObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const foundUser = await User.findOne({ username });

    if (!foundUser) {
      return res.status(401).json({ err: "username not signed up. Please sign up" });
    }

    const isPasswordMatch = bcrypt.compareSync(password, foundUser.hashedPassword);

    if (!isPasswordMatch) {
      return res.status(401).json({ err: "username or password incorrect" });
    }

    const payload = foundUser.toObject();
    delete payload.hashedPassword;

const token = jwt.sign({ payload }, process.env.JWT_SECRET, { expiresIn: "30m" });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/verify",verifyToken,(req,res)=>{
    console.log(req.user)
    res.json(req.user)
})




module.exports = router
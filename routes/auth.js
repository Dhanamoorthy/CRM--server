import express from 'express'
import {User} from '../models/User.js'
import bcrypt from 'bcryptjs'
import {Lead} from '../models/Lead.js'
import jwt from 'jsonwebtoken'

const router = express.Router()


router.post('/register', async (req, res) => {
    try {
      const { username,firstName,lastName,password,role} = req.body;
  const existingUser = await User.findOne({username})
  if(existingUser){
    return res.status(400).json({message:'Email already exists'})
  }
  const hashpassword = await bcrypt.hash(req.body.password,10);

  const newUser = new User({
    username:req.body.username,
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    password:hashpassword,
    role:req.body.role
  });
  await newUser.save();
  return res.json({registered:true})
    }catch(error){
        console.log(error)
    }
  });



  router.post('/login', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Validate role (optional)
        if (!['admin', 'manager', 'employee'].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        // Find user by username and role
        const user = await User.findOne({ username, role });

        if (!user) {
            return res.json({ message: "User not Registered" });
        }

        // Compare hashed password
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.json({ message: "Wrong Password" });
        }

        // Generate JWT token based on user role
        const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET_KEY);

        // Set token in cookie (optional)
        res.cookie('token', token, { httpOnly: true, secure: true });

        // Return login success message with role
        return res.json({ login: true, role: user.role });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
  
router.post('/leads', async (req, res) => {
  const { firstName, lastName, phone, designation, leadStatus, description } = req.body;

  try {
    const newLead = new Lead({
      firstName,
      lastName,
      phone,
      designation,
      leadStatus,
      description
    });

    const savedLead = await newLead.save();
    res.status(201).json(savedLead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read all leads
router.get('/leadlist', async (req, res) => {
  try {
    const leads = await Lead.find();
    res.send(leads);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a lead
router.put('/leadlist/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByIdAndUpdate(id, req.body, { new: true });
    res.send(lead);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a lead
router.delete('/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Lead.findByIdAndDelete(id);
    res.send({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(400).send(err);
  }
});



router.get('/logout', (req, res) => {
  res.clearCookie('token')
  return res.json({ logout: true })
})


export {router as AdminRouter }
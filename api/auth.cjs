const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../DB/client.cjs');
const { createUser } = require('../DB/users.cjs');

const secretKey = process.env.JWT_SECRET_KEY || 'secret';

const registerUser = async(req, res) => {
  const {username, password } = req.body;
  try{
    const newUser = await createUser(username, password);
    res.status(201).json({
      message: `User: ${newUser.username} Registered Successfully!`,
      user: newUser
    })
  } catch(error) {
    console.log(`Error while registerUser: `, error);
  }
}

const loginUser = async (req,res) => {
  const { username, password } = req.body
  try {
    const user = await prisma.user.findUnique({
      where: { username }
    });
    return user
  } catch(error) {
    console.log('Error while loggin in: ', error)
  }
}

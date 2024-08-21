const bcrypt = require('bcrypt');
const prisma = require('../DB/client.cjs');

const registerUser = async(req, res) => {
  const {username, password } = req.body;
  try{
    
  } catch(error) {
    console.log(`Error while registerUser: `, error);
  }
}

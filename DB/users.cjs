const bcrypt = require('bcrypt');
const prisma = require('./client.cjs');

const createUser = async(email, username, password) =>{
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const resultofSearch = await prisma.user.findUnique({
      where: {username, email} // ==> null
    })
    if(badCredentials){
      res.status(409).json({message: 'Invalid login credentials'})
    }
    const newUser = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: hashedPassword
      }
    });



    return newUser
  } catch(error) {
    console.log(`Error creating user: `, error);
  }
}

const getAllUsers = async() => {
  try{
    const users = await prisma.user.findMany();
    return users;
  }catch(error) {
    console.log(`error while getAllUsers: `, error);
  }
}

const getUserById = async(userId) => {
  try{
    const user = await prisma.user.findOne({
      where: { id: userId}
    });
    return user;
  }catch(error) {
    console.log(`error while getUserById: `, error);
  }
}

const updateUser = async(userId) => {
  try{
    const updatedUser = await prisma.user.update({
      where: { id: userId},
      data: { username: 'Lemon Larry'}
    });
    console.log(`User updated: ${updatedUser.username}`)
  }catch(error) {
    console.log(`error while updateUser`, error);
  }
}

const deleteUser = async(userId) => {
  try{
    await prisma.user.delete({
      where: { id: userId}
  });
  console.log(`User with ID ${userId} has been deleted.`);
  }catch(error){
    console.log(`Error while deleteUser: `, error);
  }
}

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser
}

const prisma = require('./client.cjs');

const createUser = async(username, password) =>{
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
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
    const user = await prisma.user.findUnique({
      where: { id: userId}
    });
    return user;
  }catch(error) {
    console.log(`error while getUserById: `, error);
  }
}

const updateUser = async(userId, newUsername) => {
  try{
    const updatedUser = await prisma.user.update({
      where: { id: userId},
      data: { username: newUsername}
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

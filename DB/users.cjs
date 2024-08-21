const bcrypt = require('bcrypt');
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


const test = async() => {
  await deleteUser(9)
  const newUser = await createUser();
  await updateUser(newUser.id);
  await prisma.$disconnect();
}

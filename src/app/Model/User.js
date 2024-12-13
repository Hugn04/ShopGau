const { default: mongoose } = require('mongoose');

mongoose.set('strictQuery', false);

const Schema = mongoose.Schema;

const UserModel = new Schema({
    name: String,
    password: String,
    email: String,
    role: String,
});
const User = mongoose.model('users', UserModel);
module.exports = User;

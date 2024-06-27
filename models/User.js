
import mongoose from 'mongoose'


const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
});

const UserModel = mongoose.model("User",UserSchema);


export {UserModel as User}
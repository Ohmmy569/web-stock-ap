import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: "user"
        },
    }, 
    { timestamps: true }
)

const UserMember = mongoose.models.UserMember || mongoose.model("UserMember", userSchema);
export default UserMember;
import mongoose, { Schema } from "mongoose";

const typepartSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        }
    }, 
    { timestamps: true }
)

const TypePart = mongoose.models.TypePart || mongoose.model("TypePart", typepartSchema);
export default TypePart;
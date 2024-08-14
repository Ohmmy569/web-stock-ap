import mongoose, { Schema } from "mongoose";

const partSchema = new Schema(
    {
        code: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        brand:{
            type: String,
            required: true
        },
        model:{
            type: String,
            required: true
        },
        costPrice:{
            type: Number,

            required: true
        },
        sellPrice:{
            type: Number,
            required: true
        },
        amount:{
            type: Number,
            default: 0
        },
    }, 
    { timestamps: true }
)

const Part = mongoose.models.Part || mongoose.model("Part", partSchema);
export default Part;
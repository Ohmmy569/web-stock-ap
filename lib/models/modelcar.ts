import mongoose, { Schema } from "mongoose";

const modelcar = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        brand:{
            type: String,
            require: true
        
        }
    }, 
    { timestamps: true }
)

const Modelcar = mongoose.models.Modelcar || mongoose.model("Modelcar", modelcar);
export default Modelcar;
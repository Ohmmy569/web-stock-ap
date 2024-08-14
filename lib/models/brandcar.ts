import mongoose, { Schema } from "mongoose";

const brandcar = new Schema(
    {
        brand: {
            type: String,
            required: true
        }
    }, 
    { timestamps: true }
)

const Brandcar = mongoose.models.Brandcar || mongoose.model("Brandcar", brandcar);
export default Brandcar;
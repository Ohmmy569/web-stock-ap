import mongoose, { Schema } from "mongoose";


const history = new Schema(
    {
        user: {
            type: String,
            required: true
        },
        partCode:{
            type: String,
            require: true
        },
        type:{
            type: String,
            require: true
        },
        partName:{
            type: String,
            require: true
        },
        amount:{
            type: Number,
            require: true
        },
        brand:{
            type: String,
            require: true
        },
        costPrice:{
            type: Number,
            require: true
        },
        sellPrice:{
            type: Number,
            require: true
        },
        action:{
            type: String,
            require: true
        }
    }, 
    { timestamps: true }
)

const History = mongoose.models.History || mongoose.model("History", history);
export default History;
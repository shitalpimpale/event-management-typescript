import { Schema,model } from "mongoose";
const UserSchema = new Schema({
    name : {type : String,required : true},
    email : { type : String,required : true},
    password : {type : String},
    role: { type: String, enum: ["admin", "organizer", "attendee"], default: "attendee" },
    createdAt: { type: Date, default: Date.now }
});

export const User = model('User',UserSchema);
import { Schema,model } from "mongoose";

const EventSchema = new Schema({
    title : {type : String,required : true},
    description: { type: String, required: true },
    category: { type: String, enum: ["conference", "workshop", "meetup", "seminar"], required: true },
    date: { type: Date, required: true },
    location: { type: String }, // For physical events
    onlineLink: { type: String }, // For virtual events (Zoom, Google Meet)
    organizer : {type : Schema.Types.ObjectId,ref : "User",required : true},
    createdAt: { type: Date, default: Date.now }
})
export const Event = model('Event',EventSchema);
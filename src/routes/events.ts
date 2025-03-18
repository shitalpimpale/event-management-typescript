import express  from "express";
import { Event } from "../models/Event";
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();

//Create an Event
router.post('/',authMiddleware,async(req:any,res:any) => {
    try{
        const {title,description,category,date,location,onlineLink} = req.body;
        const event = new Event({title,description,category,date,location,onlineLink,organizer:req.user.id});
        await event.save();
        res.status(201).json(event);

    }catch(error:any){
        res.status(500).json({ message: error.message });
    }
});
//Get All Events
router.get('/',authMiddleware,async (req:any,res:any) =>{
    try{
        const event = await Event.find().populate('organizer','name email');
        if(!event) return res.status(404).json({ message: "Event not found" });

        return res.status(200).json(event);
    }catch(error:any){
        res.status(500).json({ message: error.message });
    }
});
//Get Particular Event
router.get('/:id',authMiddleware,async (req:any,res:any) => {
    try{
        const id = req.params.id;
        const event = await Event.findById(id);
        if(!event) return res.status(404).json({message:"Event not found"});

        if(event.organizer.toString() !== req.user.id){
            return res.status(403).json({message:"Unauthorized to edit this event"})
        }
        Object.assign(event,req.body);
        await event.save();
        res.json(event);

    }catch(error:any){
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id',authMiddleware,async(req:any,res:any) => {
    try{
        const id = req.param.id;
        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.organizer.toString() !== req.user.id) {
          return res.status(403).json({ message: "Unauthorized to delete this event" });
        }

        await event.deleteOne();
        res.json({ message: "Event deleted successfully" });

        
    }catch(error:any){
        res.status(500).json({message:error.message})
    }
})
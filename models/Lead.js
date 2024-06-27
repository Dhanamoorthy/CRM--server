// models/Lead.js
import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: Number },
  designation: { type: String },
  leadStatus: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Lost', 'Cancelled','Confrimed'], default: 'New' },
  description: { type: String },

});

const LeadModel = mongoose.model('Lead',leadSchema)

export {LeadModel as Lead}

import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const logsSchema = new Schema({
  user: {
    type: ObjectId,
    ref: "userTable",
    required: false,
  },
  action: {
    type: String,
    required: true,
  },
  details: {
    type: Object,
    required: false,
  },
  ip: {
    type: String,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const logsModel = mongoose.model("logs", logsSchema);

export { logsModel };

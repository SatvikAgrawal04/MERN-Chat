const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const MessageModel = new mongoose.model("Message", MessageSchema);
module.exports = MessageModel;

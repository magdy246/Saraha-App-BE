import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        minlength: 1,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    }
}, {
    timestamps: true,
});

const MessagesModel = mongoose.models.Messages || mongoose.model("Messages", messagesSchema);

export default MessagesModel;
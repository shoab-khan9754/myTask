const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    isEmailVerified: {
        type: Boolean,
        default: false,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    profileImage: {
        type: String,
        required: false
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: Number,
        required: false
    },
    date: {
        type: Date,
        default: new Date(new Date().toUTCString())
    },
    updatedDate: {
        type: Date,
        default: new Date(new Date().toUTCString())
    },
});

UserSchema.pre('save', async function (next) {
    if (!this.isNew) {
        //  if the instance in modified and is not new then ----
        this.updatedDate = new Date(new Date().toUTCString());
    } else {
        return next();
    }
});
module.exports = User = mongoose.model("users", UserSchema);

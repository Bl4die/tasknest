const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: 'Pending' },
    // Linking the task to a user
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkspaceAccount', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
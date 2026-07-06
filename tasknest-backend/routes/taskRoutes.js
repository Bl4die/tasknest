const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth'); // Import our security guard

// 1. Get ONLY the logged-in user's tasks
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Create a task linked to the user
router.post('/', auth, async (req, res) => {
    try {
        const newTask = new Task({
            title: req.body.title,
            description: req.body.description,
            user: req.user // Attach the user ID from the middleware
        });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 3. Toggle status safely
router.put('/:id', auth, async (req, res) => {
    try {
        const currentTask = await Task.findOne({ _id: req.params.id, user: req.user });
        if (!currentTask) return res.status(404).json({ error: 'Task not found' });

        currentTask.status = currentTask.status === 'Completed' ? 'Pending' : 'Completed';
        await currentTask.save();
        res.json(currentTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 4. Delete task safely
router.delete('/:id', auth, async (req, res) => {
    try {
        const result = await Task.findOneAndDelete({ _id: req.params.id, user: req.user });
        if (!result) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
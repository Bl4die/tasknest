const express = require('express');
const router = express.Router();
const Task = require('../models/Task'); // Links to the model above

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a task
router.post('/', async (req, res) => {
    try {
        const savedTask = await Task.create(req.body);
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Toggle task status (Complete / Undo)
router.put('/:id', async (req, res) => {
    try {
        // 1. Find the current task first to see its current status
        const currentTask = await Task.findById(req.params.id);

        // 2. Determine the new target status
        const newStatus = currentTask.status === 'Completed' ? 'Pending' : 'Completed';

        // 3. Update it with the toggled status
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { status: newStatus },
            { new: true }
        );

        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
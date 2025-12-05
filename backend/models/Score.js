import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    points: {
        type: Number,
        required: true,
        min: 0
    },
    level: {
        type: Number,
        required: true,
        min: 1
    },
    lines: {
        type: Number,
        required: true,
        min: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Индексы для быстрого поиска
scoreSchema.index({
    userId: 1,
    points: -1
});
scoreSchema.index({
    points: -1
});

export default mongoose.model('Score', scoreSchema);

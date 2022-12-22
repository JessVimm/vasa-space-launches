const mongoose = require('mongoose');

const planetSchema = new mongoose.Schema({
    keplerName: {
        type: String,
        required: true,
    }
});

// Create model to connect planetSchema to 'Planets' collection
module.exports = mongoose.model('Planet', planetSchema);
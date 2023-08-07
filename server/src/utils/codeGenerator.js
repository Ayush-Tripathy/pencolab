const shortid = require("shortid");

// Function to generate a random unique ID
const generateUniqueCode = () => {
    return shortid.generate();
}

module.exports = generateUniqueCode;
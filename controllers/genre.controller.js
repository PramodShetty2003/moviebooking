//import th genre model by destructuring to reslove the circluar dependency flow issue
const { Genre } = require('../models');

const findAllGenres = async (req, res) => {
    try {
        const genres = await Genre.find();
        res.status(200).json(genres);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports ={ findAllGenres };
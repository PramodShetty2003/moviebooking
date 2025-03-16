//import th genre model by destructuring to reslove the circluar dependency flow issue
const { Genre } = require('../models');

const findAllGenres = async (req, res) => {
    try {
        console.log(req.body);
        
        const genres = await Genre.find();
        res.status(200).json({"genres":genres});
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports ={ findAllGenres };
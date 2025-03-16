const { Artist } = require('../models');

const findAllArtists = async (req, res) => {
    try {
        const Artists = await Artist.find();
        res.status(200).json(Artists);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports ={ findAllArtists };
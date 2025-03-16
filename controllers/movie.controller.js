const { Movie } = require('../models');

// Helper function to format dates to "DD-MM-YYYY"
const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

const findAllMovies = async (req,res) =>{
   const { status, title, genres, artists, start_date, end_date } = req.query;
   console.log(req.query);
   try{
    let movies = {};
    // To find all movies with published as true
    if ( status === "PUBLISHED" ) movies.published = true;
    console.log(movies);
    // To find all movies with released as true
    if ( status === "RELEASED") movies.released = true;
    console.log(movies);
    // To find all movies with title
    if (title) movies.title = { $regex: title, $options: 'i' };
    console.log(movies);
    // To find all movies with genres
    if (genres){
        const genreArray = genres.split(',');
        movies.genres = { $all: genreArray };
    }
   // To find all movies with artists
    if (artists) {

        const artistNames = artists.split(',').map(artists => artists.trim());
        console.log(artistNames);

        const SearchArtists = artistNames.map(artistName => {
            const [firstName, lastName] = artistName.split(' ');
            return {
                'artists.first_name': firstName,
                'artists.last_name': lastName
            };
        })
        movies.$or = SearchArtists;
    }

    // To filter by start_date (release_date as DD-MM-YYYY string comparison)
    if (start_date) {
        const formattedStartDate = formatDate(start_date);
        console.log("Formatted start date:", formattedStartDate);
        movies.release_date = { $gte: formattedStartDate };
      }
  
      if (end_date) {
        const formattedEndDate = formatDate(end_date);
        console.log("Formatted end date:", formattedEndDate);
        if (!movies.release_date) movies.release_date = {};
        movies.release_date.$lte = formattedEndDate;
      }
  
      console.log("Movies query:", movies);

    // To find all movies with all the above conditions
    const filtered_movies = await Movie.find(movies);
    console.log(filtered_movies); 
    if (!filtered_movies || filtered_movies.length === 0) {
        return res.status(404).json({ message: "No movies found." });
    }
    res.status(200).json({ movies: filtered_movies });
   }catch(error){
    res.status(500).json({message:"Internal server error",error:error.message});
   }
};

//findOne() - to fetch all details of a movie given its id.
const findOne = async (req,res)=>{
  const movieid = parseInt(req.params.id);
  try{
     const movie = await Movie.findOne({movieid:movieid});
     if(!movie){
        return res.status(404).json({message:"Movie not found"});
     }
     res.status(200).send(movie); 

  }catch(error){
    res.status(500).json({message:"Internal server error",error:error.message});
  }
};

//findShows() - to fetch details of shows of a specific movie given its id.
const findShows = async (req, res) => {
  const { movieid } = req.params;
  console.log(movieid);

  try {
      const movie = await Movie.findOne({ movieid: movieid });
      if (!movie) {
          return res.status(404).json({ message: "Movie not found" });
      }

      const shows = movie.shows.map(show => ({
          show_timing: show.show_timing,
          theatre: show.theatre,
          city: show.theatre.city,
          language: show.language,
          unit_price: show.unit_price,
          available_seats: show.available_seats
      }));

      res.status(200).json(shows);
  } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { findAllMovies , findOne ,findShows};
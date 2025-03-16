# Movie Booking Application Backend

## Project Overview

This project aims to develop the backend of a real-world application using Node.js, Express.js, and MongoDB. The Movie Booking application allows users to:

- **Browse Movies:** View upcoming and released movies.
- **Filter Movies:** Filter released movies based on parameters such as title, genre, artist, and date range.
- **View Details:** Check movie details including genre, artists, and trailers.
- **Book Tickets:** Book tickets for selected movies and shows.

## API Routes

### Movie Data-Related API Routes
> **Note:** Parameter values in the URL are specified within curly braces `{}`.

1. **GET /movies?status=PUBLISHED**  
   Returns all movies with the status set as “PUBLISHED”.

2. **GET /movies?status=RELEASED**  
   Returns all movies with the status set as “RELEASED”.

3. **GET /movie/{movieId}**  
   Returns details about the movie with the specified ID.

4. **GET /movies?status=RELEASED&title={title}&genres={genres}&artists={artists}&start_date={startdate}&end_date={enddate}**  
   Returns movies matching the provided filter criteria.

5. **GET /movies/{movieid}/shows**  
   Returns all available shows for a specific movie.

### Login & Booking Related API Routes

1. **POST /signup**  
   Collects new user data and adds it to the database.

2. **POST /login**  
   Authenticates user credentials and returns an access token if valid.

3. **POST /logout**  
   Logs out a user by removing their access token.

4. **GET /coupons**  
   Retrieves discount coupons based on ID.

5. **POST /bookings**  
   Adds a booking entry for a show and returns a reference number.

### Artist and Genres Related API Routes

1. **GET /artists**  
   Returns all artists from the database.

2. **GET /genres**  
   Returns all genres from the database.

## Controllers Overview

- **movieController.js**
  - `findAllMovies()`: Fetches movies based on their status.
  - `findOne()`: Retrieves detailed information for a movie by its ID.
  - `findShows()`: Retrieves available shows for a specific movie.

- **userController.js**
  - `signUp()`: Creates a new user object and saves it to the database.
  - `login()`: Authenticates a user and returns an access token.
  - `logout()`: Logs out the user by removing their access token.
  - Additional methods: `getCouponCode` and `bookShow`.

- **artistController.js**
  - `findAllArtists()`: Retrieves all artists from the database.

- **genreController.js**
  - `findAllGenres()`: Retrieves all genres from the database.

## Routes Overview

- **movieRoutes.js** (Base URL: `http://localhost:8085/api`)
  - GET `/movies`
  - GET `/movies?status=PUBLISHED`
  - GET `/movies?status=RELEASED`
  - GET `/movie/{movieId}`
  - GET `/movies?status=RELEASED&title={title}&genres={genres}&artists={artists}&start_date={startdate}&end_date={enddate}`

- **artistRoutes.js** (Base URL: `http://localhost:8085/api`)
  - GET `/artists`

- **genreRoutes.js** (Base URL: `http://localhost:8085/api`)
  - GET `/genres`

- **userRoutes.js** (Base URL: `http://localhost:8085/api`)
  - POST `/auth/signup`
  - POST `/auth/login`
  - POST `/auth/logout`
  - Additional routes for `/getCouponCode` and `/bookShow`

## Setup Instructions

1. **Install Node Modules**

   Run the following commands from the project root:
   ```bash
   npm install uuid-token-generator
   npm install uuidv4
   npm install b2a
   npm install body-parser
   npm install cors
   npm install express
   npm install mongoose
   npm install nodemon
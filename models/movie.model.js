const mongoose = require('mongoose');
const { artistSchema }= require('./artist.model');

const movieSchema =  new mongoose.Schema({
  movieid:{ type:Number, required: true, unique: true},
  title: { type:String, required: true },
  published: { type:Boolean ,required: true},
  released: { type:Boolean, required: true},
  poster_url:{ type:String, required: true},
  release_date: { type:String, required: true},
  publish_date: { type:String, required: true},
  artists: [artistSchema],
  genres:[{ type:String,required: true}],
  duration:{ type:Number , required: true},
  critic_rating: { type:Number, required: true},
  trailer_url:{ type:String, required: true},
  wiki_url:{ type:String, required: true},
  story_line:{ type:String, required: true},
  shows:[
    {
        id: { type:Number, required: true},
        theatre: {
           name:  {type:String, required: true},
           city:  {type:String, required: true}, 
        },
        language: { type:String, required: true},
        show_timing: { type:String, required: true},
        available_seats: { type:String, required: true},
        unit_price: { type:Number, required: true}
    }
  ]
});

module.exports = mongoose.model('Movie', movieSchema);
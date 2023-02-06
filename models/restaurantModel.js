/*
Course Code:    COMP3133
Lab:            3
Student Name:   Julien Widmer
Student ID:     101320111
*/
const mongoose = require("mongoose");

// Define schema
const RestaurantSchema = new mongoose.Schema({
    address: {
        building: {
            type: String
        },
        street: {
            type: String,
            required: true
        },
        zipcode: {
            type: String
        }
    },
    city: {
        type: String,
        required: true
    },
    cuisine: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    restaurant_id: String
})

/* Restaurant JSON example:
{
  "address": {
	"building": "1008",
	"street": "Morris Park Ave",
	"zipcode": "10462"
 },
 "city": "Bronx",
 "cuisine": "Bakery",
 "name": "Morris Park Bake Shop",
 "restaurant_id": "30075445"
}
*/

// Create mongodb schema
const restaurant = mongoose.model("restaurants", RestaurantSchema, "Restaurants");
module.exports = restaurant;
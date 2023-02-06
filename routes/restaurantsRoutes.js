/*
Course Code:    COMP3133
Lab:            3
Student Name:   Julien Widmer
Student ID:     101320111
*/
const express = require("express");
const routes = express.Router();
const RestaurantModel = require("../models/restaurantModel");

// http://localhost:3000/restaurants
// http://localhost:3000/restaurants?sortBy=ASC
// http://localhost:3000/restaurants?sortBy=DESC
// Return restaurants details
routes.get("/restaurants", async (req, res) => {
    try {
        let restaurants = [];

        if (req.query.sortBy == null) {
            // Retrieve all restaurants details
            restaurants = await RestaurantModel.find()
        } else {
            // Retrieve specific restaurants details and sort in ASC or DESC order
            const sortOrder = req.query.sortBy === "DESC" ? -1 : 1;
            restaurants = await RestaurantModel.find()
                .select({
                    "_id": 1,
                    "cuisine": 1,
                    "name": 1,
                    "city": 1,
                    "restaurant_id": 1
                })
                .sort({"restaurant_id": sortOrder});
        }

        if (restaurants != "") {
            // Filter restaurant details
            res.status(200).send(restaurants);
        } else {
            // Client side error
            res.status(400).send({message: "No restaurants found."});
        }
    } catch (error) {
        // Server side error
        res.status(500).send({message: `Error while retrieving restaurants: ${error}`})
    }
})

// http://localhost:3000/restaurants/cuisine/Japanese
// http://localhost:3000/restaurants/cuisine/Bakery
// http://localhost:3000/restaurants/cuisine/Italian
// Return all restaurants details from a specific cuisine type
routes.get("/restaurants/cuisine/:cuisine", async (req, res) => {
    try {
        // Retrieve all restaurants with specified cuisine
        const cuisineType = req.params.cuisine;
        const restaurants = await RestaurantModel.find({"cuisine": cuisineType});

        if (restaurants != "") {
            res.status(200).send(restaurants);
        } else {
            // Client side error
            res.status(400).send({message: "No restaurants found."});
        }
    } catch (error) {
        // Server side error
        res.status(500).send({message: `Error while retrieving restaurants: ${error}`})
    }
})

// http://localhost:3000/restaurants/Delicatessen
// Return specific Delicatessen restaurants details
routes.get("/restaurants/Delicatessen", async (req, res) => {
    try {
        const restaurants = await RestaurantModel.find({
            "cuisine": "Delicatessen",
            "city": {"$ne": "Brooklyn"}
        })
            .select({
                "cuisine": 1,
                "name": 1,
                "city": 1,
                "_id": 0
            })
            .sort({"name": 1});

        if (restaurants != "") {
            // Filter restaurant details
            res.status(200).send(restaurants);
        } else {
            // Client side error
            res.status(400).send({message: "No restaurants found."});
        }
    } catch (error) {
        // Server side error
        res.status(500).send({message: `Error while retrieving restaurants: ${error}`})
    }
})

// http://localhost:3000/restaurant
// Create restaurant
routes.post("/restaurant", async (req, res) => {
    // Validate request
    if(JSON.stringify(req.body) == "{}") {
        // Client side error
        return res.status(400).send({message: "Restaurant content can't be empty"});
    }

    // Create new Restaurant
    const newRestaurant = new RestaurantModel(req.body);
    try {
        await newRestaurant.save();
        res.status(201).send(newRestaurant);
    } catch (error) {
        // Client side error (wrong or missing restaurant detail)
        // OR
        // Server side error
        return res.status(500).send({message: `Restaurant not created: ${error}`});
    }
})

module.exports = routes;
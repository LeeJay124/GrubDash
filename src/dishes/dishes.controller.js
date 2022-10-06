const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function list(req, res){
    const {dishId} = req.params;
    res.json({data: dishes.filter(dishId ? dish => dish.id === dishId : () => true ) });
};
function dishExists(req, res, next){
    console.log("In dish Exists");
    const {dishId} = req.params;
    const foundDish = dishes.find(dish => dish.id == dishId);
    if(foundDish){
        res.locals.dish = foundDish;
        return next();
    }
    next({
        status: 404, 
        message: `Dish id not found: ${dishId}`
    });
};
function bodyHas(propertyName){
return function(req,res,next){
    const {data = {}} = req.body;
    if(data[propertyName]){
        return next();
    }
    next({
        status: 400, 
        message: `Dish must include a ${propertyName}`
    });
};
};

function nameIsValid(req, res, next) {
    const { data: { name } = {} } = req.body;
    if (name && name !== "") {
      return next();
    }
    next({
      status: 400,
      message: `Dish must include a ${name}`,
    });
  };

  function descriptionIsValid(req, res, next) {
    const { data: { description } = {} } = req.body;
    if (description && description !== "") {
      return next();
    }
    next({
      status: 400,
      message: `Dish must include a ${description}`,
    });
  };
  function imageIsValid(req, res, next) {
    const { data: { image_url } = {} } = req.body;
    if (image_url && image_url !== "") {
      return next();
    }
    next({
      status: 400,
      message: `Dish must include a ${image_url}`,
    });
  };

  function priceIsValid(req, res, next) {
    const { data: { price} = {} } = req.body;
    if (Number.isInteger(price) == true && price.length > 0) {
      return next();
    }
    next({
      status: 400,
      message: `Dish must have a price that is an integer greater than 0`,
    });
  };
  
  
  function create (req, res){
    const {data: {name, description, price, image_url} ={}} = req.body;
    const newOrder = {
        id: nextId(), 
        name, 
        description, 
        price,
        image_url
    };
    dishes.push(newDish);
    res.status(201).json({data: newDish});
  };
  
function read(req, res, next){
    res.json({data: res.locals.dish});
};

function update(req, res){
    const dish = res.locals.dish;
    const {data: {name, description, price, image_url}={}} = req.body;

   dish.name = name;
   dish.description = description;
   dish.price = price;
   dish.image_url = image_url;

    res.json({data: dish});
};



module.exports = {
    list, 
    dishExists, 
    create: [
        bodyHas("name"), 
        bodyHas("description"), 
        bodyHas("price"), 
        bodyHas("image_url"), 
        nameIsValid, 
        descriptionIsValid, 
        priceIsValid, 
        imageIsValid, 
        create
    ], 
    read: [dishExists, read],
    update: [
        bodyHas("name"), 
        bodyHas("description"), 
        bodyHas("price"), 
        bodyHas("image_url"), 
        nameIsValid, 
        descriptionIsValid, 
        priceIsValid, 
        imageIsValid, 
        update
    ]

}
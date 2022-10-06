const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
function list(req, res){
    res.json({data: orders});
};

function orderExists(req, res, next){
    const {orderId} = req.params;
    const foundOrder = orders.find(order => order.id === orderId);
    if(foundOrder){
        res.locals.order = foundOrder;
        return next();
    }
    next({
        status: 404, 
        message: `Order id not found: ${orderId}`
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
        message: `Order must include a ${propertyName}`
    });
};
};

function deliverToIsValid(req, res, next) {
    const { data: { deliverTo } = {} } = req.body;
    if (deliverTo && deliverTo !== "") {
      return next();
    }
    next({
      status: 400,
      message: `Order must include a ${deliverTo}`,
    });
  };

  function mobileNumberIsValid(req, res, next) {
    const { data: { mobileNumber } = {} } = req.body;
    if (mobileNumber && mobileNumber !== "") {
      return next();
    }
    next({
      status: 400,
      message: `Order must include a ${mobileNumber}`,
    });
  };

  function dishesIsValid(req, res, next) {
    const { data: { dishes = [] } = {} } = req.body;
    if (Array.isArray(dishes) == true && dishes.length > 0) {
      return next();
    }
    next({
      status: 400,
      message: `Order must include at least one dish`,
    });
  };
  function dishesQuantityIsValid(req, res, next) {
    const { data: { dishes = [] } = {} } = req.body;
    for (i=0; i<dishes.length; i++) {
        let currentDish = dishes[i];
        if(!currentDish.quantity || currentDish.quantity <= 0 || typeof currentDish.quantity !== 'number'){
            return next({
                status: 400,
                message: `Dish ${i} must have a quantity that is an integer greater than 0`,
              });
        }
    } 
    
         next();
    
  };
  
  function statusIsValid(req, res, next){
    const { data: { status } = {} } = req.body;
   const validStatus = ["pending", "preparing", "out-for-delivery", "delivered"];
    const method = req.method;
   //if(!validStatus.includes(status))next({status: 400, message: `Order1 must have a status of pending, preparing, out-for-delivery, delivered`});
   if(status == "delivered") next({status: 400, message: `A delivered order cannot be changed`}); 
   if(method == "DELETE" && status !== "pending") next({status: 400, message: `An order cannot be deleted unless it is pending`});
    
    if(status && status !== "" && status !== "invalid"){
        return next();
    }
    next ({
        status: 400, 
        message: `Order must have a status of pending, preparing, out-for-delivery, delivered`
    })
  };

  function idMatch(req, res, next){
    const {data: {id} = {}} = req.body;
    const orderId = req.params.orderId;
    if(id == null || id == undefined || id == ""){
       return next();
    }else if (id && id !== orderId){
        return next({
            status: 400, 
            message: `Dish id does not match route id. Dish:${id}, Route: ${orderId}`
        });
    }
    
  };


  function create (req, res){
    const {data: {deliverTo, mobileNumber, dishes = []}={}} = req.body;
    const newOrder = {
        id: nextId(), 
        deliverTo, 
        mobileNumber, 
        status: "pending", 
        dishes
    };
    orders.push(newOrder);
    res.status(201).json({data: newOrder});
  };
  
function read(req, res, next){
    res.json({data: res.locals.order});
};

function update(req, res){
    const order = res.locals.order;
    const {data: {deliverTo, mobileNumber, status, dishes}={}} = req.body;

    order.deliverTo = deliverTo;
    order.mobileNumber = mobileNumber;
    order.status = status;
    order.dishes = dishes;

    res.json({data: order});
};

function destroy(req, res){
    const {orderId} = req.params;
    const index = orders.findIndex((order)=> order.id === Number(orderId));
    const deletedOrder = orders.splice(index, 1);
    res.sendStatus(204);
}




module.exports = {
    list,
    orderExists, 
    create:[bodyHas("deliverTo"), 
    bodyHas("mobileNumber"),
    bodyHas("dishes"),
    deliverToIsValid,
    mobileNumberIsValid,
    dishesIsValid,
    dishesQuantityIsValid,
        create], 
    read: [orderExists, read],
    update:[orderExists, 
    bodyHas("deliverTo"), 
    bodyHas("mobileNumber"),
    bodyHas("dishes"),
    bodyHas("status"),
    idMatch,
    deliverToIsValid,
    mobileNumberIsValid,
    dishesIsValid,
    dishesQuantityIsValid,
    statusIsValid, update], 
    delete: [orderExists, statusIsValid, destroy]
}
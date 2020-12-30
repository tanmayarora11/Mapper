const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utilities/catchAsync');
const expresError = require('../utilities/expressError');
const {reviewSchema}  = require('../schemas');
const Review = require('../models/reviews')

const validatecg = (req,res,next) => {
    const campgroundSchema = Joi.object({
        // Campground : Joi.object({
            title : Joi.string().required(),
            price : Joi.number().required().min(0),
            image :  Joi.string().required(),
            location : Joi.string().required(),
            discription : Joi.string().required()
        // }).required()
    });

    const {error} = campgroundSchema.validate(req.body);

    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        console.log(msg);
        throw new expresError(msg,400);
    }else{
        next();
    }

}


const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        console.log(msg);
        throw new expresError(msg,400);
    }else{
        next();
    }
}




router.get('/new', catchAsync( async (req,res) => {
    res.render('cg/new');
}));

router.get('/', catchAsync( async (req,res) => {
    const all_cg = await Campground.find({});
    // res.send(all_cg);
    res.render('cg/index',{all_cg})
}));

router.post('/', validatecg ,catchAsync( async (req,res) => {
    const a = await Campground(req.body);
    await a.save();
    res.redirect('/cg');
}));

router.put('/:id', catchAsync( async(req,res,next) => {
    const {id} = req.params;
    const a = await Campground.findByIdAndUpdate(id,req.body);
    res.redirect(`/cg/${id}`);
}));


router.get('/:id/edit', catchAsync( async (req,res) => {
    const {id} = req.params;
    const a = await Campground.findById(id);
    res.render('cg/edit',{a});
}));

router.delete('/:id', catchAsync( async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/cg`);
}));

router.get('/:id', catchAsync( async (req,res) => {
    const {id}  = req.params;
    const a = await Campground.findById(id).populate('reviews');
    console.log(a);
    res.render('cg/show_detail',{a});
}));

router.get('/', catchAsync( async (req,res)=> {
    const camp = new Campground({title: "My backyard" , price : 100});
    await camp.save();
    res.send(camp);
}));

module.exports = router;
const express = require("express");
const router = express.Router();
const Poster = require("../models/poster.model");
const isLoggedIn = require("../middleware/auth");
const upload = require("../middleware/upload");

// Barcha elonlarni qidirish
router.get('/', async(req,res) => {
  const { search, category } = req.body;
  const query = {};
  if(search){
    query.title = {regex: 'search', option = 'i'};
  }
  if(category || category !== 'All') {
    query.category = category;
  }
const poster = await Poster.find(query).populate('owner');
res.render('posters/index', poster);
});

//Add POST
router.post("/", isLoggedIn, upload.single("image"), async (req, res) => {
  const { title, price, description, category } = req.body;
  const poster = new Poster({
    title,
    price,
    description,
    category,
    owner: req.session.user._id,
  });
  if (req.file) {
    poster.image = "/upload/" + req.file.filename;
  }
  await poster.save();
  res.redirect("/posters");
});


// bitta elon sahifasi
router.get('/:id', async(req,res) => {
  const poster = await Poster.findById(req.params.id).populate('owner');
  if(!poster) return res.redirect('/posters');
  res.render('/poster/show', {poster});
});

// Edite sahifasi
router.get('/:id/edite', isLoggedIn, async(req,res) => {
  const poster = await Poster.findById(req.params.id);
  if(!poster || !poster.owner.equals(req.session.user._id)){
    return res.redirect('/posters');
  }
  res.render('posters/edit', {poster});
});

//Update POST
router.put('/:id', isLoggedIn, upload.single('image'), async(req,res) => {
  const {title, price, description, category } = req.body;
  const poster = await Poster.findById(req.params.id);
  if(!poster || !poster.owner.equals(req.params._id)) {
    return res.redirect('/posters');
  }
  poster.title = title;
  poster.price = price;
  poster.description = description;
  poster.category = category;
  if(req.file) {
    poster.image = '/upload/' + req.file.filename;
  }
  await poster.save();
  res.redirect('/posters/' + req.params.id);
});


//Delete 
router.delete('/:id', isLoggedIn, async(req,res) => {
  const poster = await Poster.findById(req.params.id);
  if(poster && poster.owner.equals(req.session.user._id)) {
    res.redirect('/posters');
  }
});


module.exports = router;

const express = require('express');
const Handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const { sequelize } = require('./db');
const { Brand } = require('./models/Brand');
const { Flavor } = require('./models/Flavor');
const seed = require('./seed')

const PORT = 3000;

const initialiseDb = require('./initialiseDb');
initialiseDb();

const app = express();

app.use(express.urlencoded())

// setup our templating engine
const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})
app.engine('handlebars', handlebars);
app.set('view engine', 'handlebars');

// serve static assets from the public/ folder
app.use(express.static('public'));

app.use(express.json());

seed();

// BRAND ROUTES ------------------------------------------------------------------------------------------------------------

//View all brands
app.get('/brands', async (req, res) => {
    const brands = await Brand.findAll()
    res.render('brands', { brands }); //points to brands handlebar

})

//View one brand
app.get('/brands/:id', async (req, res) => {
    const brand = await Brand.findByPk(req.params.id, {
        include: {
            model: Flavor
        }
    })
    if (brand) {
        res.render('brand', { brand });
    } else {
        console.error('error viewing brand')
    }
})

// FLAVOR ROUTES ------------------------------------------------------------------------------------------------------------

//View form to create new flavor
app.get('/new-flavor-form', (req, res) => {
    res.render('newflavorform')
})

//Create new flavor based on user input from form
app.post('/new-flavor', async (req, res) => {
    let newFlavor = await Flavor.create(req.body)
    const foundNewFlavor = await Flavor.findByPk(newFlavor.id)
    //if new flavor was created, send 201 status
    if (foundNewFlavor) {
        res.status(201).send('New flavor success')
    } else {
        console.error('Flavor not created')
    }
})

//DELETE FLAVOR ROUTE VIA POST ----------------------------------------------------

//Delete a flavor based on delete button
app.post('/delete/:id', async (req, res) => {
    await Flavor.destroy({
        where: {
            id: req.params.id
        }
    });
    //redirect to list of brands instead of hitting backspace
    res.redirect('/brands');
});

//UPDATE FLAVOR ROUTE VIA POST -----------------------------------------------------

//View form to update a flavor
app.get('/update-flavor-form/:id', async (req, res) => {
    //find flavor based on button pressed
    const flavor = await Flavor.findByPk(req.params.id)
    res.render('updateflavorform', { flavor }); //send specific flavor id to the update form
})

//Update a flavor based on user input from form
app.post('/update/:id', async (req, res) => {
    try {
        let updated = await Flavor.update(req.body, {
            where: { id: req.params.id } // Update a flavor where the id matches, based on req.body
        })
        res.redirect('/brands/' + req.body.BrandId)
    } catch (err) {
        //sends error to console.log
        console.error("Error with updating a flavor: " + err);
        //sends error to browser
        res.send("Error with updating a flavor: " + err)
    }
});

app.listen(PORT, () => {
    sequelize.sync({ force: true });
    console.log(`Your server is running on http://localhost:${PORT}`);
})
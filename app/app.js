const express = require('express');
const app = express();

const Handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const { sequelize } = require('../db');
const { Brand, Flavor, User, Manager, Customer } = require('../models/index.js');
const seed = require('../seed')

// setup our templating engine
const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})
app.engine('handlebars', handlebars);
app.set('view engine', 'handlebars');

// serve static assets from the public/ folder
app.use(express.static('public'));
// parses incoming requests with urlencoded payloads, allows objects
app.use(express.urlencoded())
// parses incoming requests with JSON payloads, allows JSON
app.use(express.json());

const PORT = process.env.PORT || 3000;

seed();

// BRAND ROUTES ------------------------------------------------------------------------------------------------------------

//View all brands as manager
app.get('/brands', async (req, res) => {
    const brands = await Brand.findAll()
    res.render('brands', { brands }); //points to brands handlebar

});

//View one brand as manager
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
});

//View all brands as customer
app.get('/shop-brands', async (req, res) => {
    const brands = await Brand.findAll()
    res.render('shopbrands', { brands }); //points to brands handlebar

});

//View one brand as customer
app.get('/shop-brands/:id', async (req, res) => {
    const brand = await Brand.findByPk(req.params.id, {
        include: {
            model: Flavor
        }
    })
    if (brand) {
        res.render('shopbrand', { brand });
    } else {
        console.error('error viewing brand')
    }
});

// FLAVOR ROUTES ------------------------------------------------------------------------------------------------------------

//View form to create new flavor
app.get('/new-flavor-form', (req, res) => {
    res.render('newflavorform')
});

//Create new flavor based on user input from form
app.post('/new-flavor', async (req, res) => {
    let newFlavor = await Flavor.create(req.body)
    const foundNewFlavor = await Flavor.findByPk(newFlavor.id)
    //if new flavor was created, send 201 status
    if (foundNewFlavor) {
        res.redirect('/brands/' + newFlavor.BrandId);
    } else {
        console.error('Flavor not created')
    }
});

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
});

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

//LOGIN ROUTE -------------------------------------------------------------------------------------
//View form to login
app.get('/login-form', (req, res) => {
    res.render('loginform')
});

//View corresponding brands page as manager or customer after login
app.post('/login', async (req, res) => {
    //TODO: add email/password validation
    if (req.body.userType == 'manager') {
        res.redirect('./brands')
    } else if (req.body.userType == 'customer') {
        res.redirect('./shop-brands')
    } else {
        console.error('Possible invalid userType: ' + req.body.userType)
    }
});

//HOME ROUTE -------------------------------------------------------------------------------------
//View form to login
app.get('', (req, res) => {
    res.render('homeform')
});


app.listen(PORT, () => {
    sequelize.sync({ force: true });
    console.log(`Your server is running on http://localhost:${PORT}`);
})
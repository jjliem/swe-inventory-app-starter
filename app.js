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
app.get('/brands', async (req, res) => {
    const brands = await Brand.findAll()
    res.render('brands', { brands }); //points to brands handlebar

})

app.get('/brands/:id', async (req, res) => {
    const brand = await Brand.findByPk(req.params.id, {
        include: {
            model: Flavor
        }
    })
    res.render('brand', { brand });
})

// FLAVOR ROUTES ------------------------------------------------------------------------------------------------------------
// app.get('/flavors', async (req, res) => {
//     const flavors = await Flavor.findAll();
//     res.render('brands', {flavors})
// });

// app.get('/flavors/:id', async (req, res) => {
//     const flavors= await Flavor.findByPk(req.params.id);
//     res.render("brand", { flavors });
// })

app.get('/new-flavor-form', (req, res) => {
    res.render('newflavorform')
})

app.post('/new-flavor', async (req, res) => {
    let newFlavor = await Flavor.create(req.body)
    const foundNewFlavor = await Flavor.findByPk(newFlavor.id)
    //if new flavor was created, send 201 status
    if (foundNewFlavor) {
        res.status(201).send('New flavor success')
        //res.render('flavors')
    } else {
        console.error('flavor not created')
    }
})

//DELETE ROUTE VIA POST -----------------------------------------------------
app.post('/delete/:id', async (req, res) => {

    await Flavor.destroy({
        where: {
            id: req.params.id
        }
    });
    //res.sendStatus(200);
    //redirect to list of brands instead of hitting backspace
    res.redirect('/brands');
});

//UPDATE ROUTE VIA POST -----------------------------------------------------
app.get('/update-flavor-form/:id', async (req, res) => {
    //each update button is tied to a specific flavor, each flavor gets its own update form
    const flavor = await Flavor.findByPk(req.params.id)
    //send specific flavor id to the update form
    res.render('updateflavorform', { flavor });
})

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
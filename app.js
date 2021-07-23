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
    console.log(brand);
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

// DELETE FLAVOR ROUTES -------------------------
app.get('/delete-flavor-form', (req, res) => {
    res.render('deleteflavorform')
})

app.delete('/deleted-flavor', async (req, res) => {
    let deleteFlavor = await Flavor.destroy({
        where: {
            name: req.body.name
        }
    })
    // const foundDeleteFlavor = await Flavor.findByPk(deleteFlavor.id)
    // if (!foundDeleteFlavor) {
    //     res.status(200).send('Flavor deleted!')
    // } else {
    //     console.error('Flavor not deleted')
    // }
    res.sendStatus(200);
})

app.listen(PORT, () => {
    sequelize.sync({ force: true });
    console.log(`Your server is running on http://localhost:${PORT}`);
})
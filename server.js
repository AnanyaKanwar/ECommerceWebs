const express =  require('express')
const app = express()
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs')


const { initializeApp,  cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

const serviceAccount = require('./firebaseKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();



// Home  Page
app.get('/', async (req, res)=>{

    let productsRef =  db.collection('products')
    let products = []

    await productsRef.get()
    .then(snapshot => {
        snapshot.forEach(doc=>{
            products.push({id: doc.id, ...doc.data()})
        })
    })

    res.render('index', {products})
})


// Buy product page

app.get('/buy/:productId', (req, res)=>{
    const {productId} = req.params
    res.render('buy', {productId})
})


// Receive Order

app.post('/order', async (req, res) => {

    const ordersCollection = db.collection('orders');

    try {
      const orderData = {
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        postal_code: req.body.postal_code,
        phone_number: req.body.phone_number,
        delivery_method: req.body.delivery_method,
        delivery_instructions: req.body.delivery_instructions,
      };
  
      // Save the order in Firestore
      const result = await ordersCollection.add(orderData);
  
      console.log('Order saved with ID:', result.id);
  
      // You can redirect to a success page or send a response accordingly
      res.render('orderPlaced', {orderId: result.id});
    } catch (error) {
      console.error('Error saving order:', error);
      res.status(500).send('Internal Server Error');
    }
  });

app.listen(3000)
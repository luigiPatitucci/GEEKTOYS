const server = require('express').Router();
const { Product } = require('../db.js');
const {Category} = require('../db.js')

server.get('/', (req, res, next) => {
	Product.findAll()
		.then(products => {
			res.send(products);
		})
		.catch(next);
});

server.post('/category', (req, res) => {
  Category.create({
    name: req.body.name
  }).then(function() {
    res.status(201).send('Categoría creada correctamente');
  })
})

server.post('/', (req,res)=>{
  Product.create({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock
  }).then((pro) => {
    if(!pro){
      res.status(404).json({error: 'Completa los campos requeridos'})
      return;
    }
    return res.status(201).json(pro)
  })
 
})

server.post('/:idProducto/category/:idCategoria', (req, res) => {
	Product.findByPk(req.params.idProducto)
    .then((prod) => {
      if (!prod) {
        res.status(404).json({error: 'Producto no encontrado'})
        return;
      }
      return Category.findByPk(req.params.idCategoria).then((cat) => {
        if (!cat) {
			res.status(404).json({error: 'Categoria no encontrada'})
			return;
        }

        Product.addCategory(cat);
		res.send(`>> Se agrego la categoría id=${req.params.idCategoria} al Producto id=${req.params.idProducto}`);
        return ;
      });
    })
    .catch((err) => {
      res.status(404).send(err);
    });
})

server.delete('/:idProducto/category/:idCategoria', (req, res) => {
	Product.findByPk(req.params.idProducto)
    .then((prod) => {
      if (!prod) {
        res.status(404).json({error: 'Producto no encontrado'})
        return;
      }
      return Category.findByPk(req.params.idCategoria).then((cat) => {
        if (!cat) {
			res.status(404).json({error: 'Categoria no encontrada'})
			return;
        }

        Product.removeCategory(cat);
		res.send(`>> Se eliminó la categoría id=${req.params.idCategoria} del Producto id=${req.params.idProducto}`);
        return ;
      });
    })
    .catch((err) => {
      res.status(404).send(err);
    });
}) 
server.delete("/category/:id", (req,res)=>{           //Verificar Id, para que se resetee
  Category.findByPk(req.params.id).then((categoria)=>{
    categoria.destroy();
    res.status(201).send("La categoria se elimino correctamente")
    return;
  })
})

module.exports = server;

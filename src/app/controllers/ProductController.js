const yup = require('yup')
const Product = require('../models/Product')
const Category = require('../models/Category')
const User = require('../models/User')

class ProductController {
  async store (req, res) {
    try {
      const schema = yup.object().shape({
        name: yup.string().required(),
        price: yup.number().required(),
        category_id: yup.number().required(),
        offer: yup.boolean(),
        path: yup.string()
      })

      try {
        schema.validateSync(req.body, { abortEarly: false })
      } catch (err) {
        console.log(err)
        return res.status(400).json({ error: err.errors })
      }

      const { admin: isAdmin } = await User.findByPk(req.userId)

      if (!isAdmin) {
        return res.status(401).json({ error: 'User is not an admin' })
      }

      const { filename: path } = req.file
      const { name, price, category_id, offer } = req.body

      const product = await Product.create({
        name,
        price,
        category_id,
        offer,
        path
      })

      return res.json(product)
    } catch (error) {
      console.log(error)
    }
  }

  async index (req, res) {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name']
          }
        ]
      })

      return res.json(products)
    } catch (error) {
      console.log(error)
    }
  }

  async update (req, res) {
    try {
      const schema = yup.object().shape({
        name: yup.string(),
        price: yup.number(),
        category_id: yup.number(),
        offer: yup.boolean(),
        path: yup.string()
      })

      try {
        schema.validateSync(req.body, { abortEarly: false })
      } catch (err) {
        console.log(err)
        return res.status(400).json({ error: err.errors })
      }

      const { admin: isAdmin } = await User.findByPk(req.userId)

      if (!isAdmin) {
        return res.status(401).json({ error: 'User is not an admin' })
      }

      const product = await Product.findByPk(req.params.id)

      if (!product) {
        return res.status(400).json({ error: 'Product not found' })
      }

      let path

      if (req.file) {
        path = req.file.filename
      }

      const { name, price, category_id, offer } = req.body

      await product.update({
        name,
        price,
        category_id,
        offer,
        path
      },
      { where: { id: req.params.id } })

      return res.status(200).json()
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new ProductController()

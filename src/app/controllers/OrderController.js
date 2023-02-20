import * as Yup from 'yup'
import Category from '../models/Category'
import Product from '../models/Product'
import Order from '../schemas/Order'
import User from '../models/User'

class OrderController {
  async store (req, res) {
    const schema = Yup.object().shape({
      products: Yup.array().of(
        Yup.object().shape({
          id: Yup.number().required(),
          quantity: Yup.number().required()
        })
      )
    })

    try {
      schema.validateSync(req.body, { abortEarly: false })
    } catch (err) {
      console.log(err)
      return res.status(400).json({ error: err.errors })
    }

    const productsId = req.body.products.map(product => product.id)

    const updateProducts = await Product.findAll({
      where: {
        id: productsId
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name']
        }
      ]
    })

    const editedProducts = updateProducts.map(product => {
      const newProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category.name,
        url: product.url,
        quantity: req.body.products.find(
          requestProduct =>
            requestProduct.id === product.id
        ).quantity

      }
      return newProduct
    })

    const order = {
      user: {
        id: req.userId,
        name: req.userName
      },
      products: editedProducts,
      status: 'pedido realizado'
    }

    const orderResponse = await Order.create(order)

    return res.status(201).json(orderResponse)
  }

  async index (req, res) {
    const orders = await Order.find()

    return res.json(orders)
  }

  async update (req, res) {
    const schema = Yup.object().shape({
      status: Yup.string().required()
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

    const { id } = req.params
    const { status } = req.body

    try {
      await Order.updateOne({ _id: id }, { status }, { new: true })
    } catch (error) {
      return res.status(400).json({ error: 'Order not found' })
    }

    return res.json({ message: 'Status was updated' })
  }
}

export default new OrderController()

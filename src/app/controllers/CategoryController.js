import * as yup from 'yup'
import Category from '../models/Category'
import User from '../models/User'

class CategoryController {
  async store (req, res) {
    try {
      const schema = yup.object().shape({
        name: yup.string().required()
      })

      try {
        schema.validateSync(req.body, { abortEarly: false })
      } catch (err) {
        return res.status(400).json({ error: err.errors })
      }

      const { admin: isAdmin } = await User.findByPk(req.userId)

      if (!isAdmin) {
        return res.status(401).json({ error: 'User is not an admin' })
      }

      const { name } = req.body

      const { filename: path } = req.file

      const categoryExists = await Category.findOne({ where: { name } })

      if (categoryExists) {
        return res.status(400).json({ error: 'Category already exists' })
      }

      const category = await Category.create({ name, path })

      return res.json({ id: category.id, name: category.name })
    } catch (error) {
      console.log(error)
    }
  }

  async index (req, res) {
    try {
      const category = await Category.findAll()

      return res.json(category)
    } catch (error) {

    }
  }

  async update (req, res) {
    try {
      const schema = yup.object().shape({
        name: yup.string().required()
      })

      try {
        schema.validateSync(req.body, { abortEarly: false })
      } catch (err) {
        return res.status(400).json({ error: err.errors })
      }

      const { admin: isAdmin } = await User.findByPk(req.userId)

      if (!isAdmin) {
        return res.status(401).json({ error: 'User is not an admin' })
      }

      const { name } = req.body

      const { id } = req.params

      const category = await Category.findByPk(id)

      if (!category) {
        return res.status(401)
          .json({ error: 'Make sure your category id is correct' })
      }

      let path
      if (req.file) {
        path = req.file.filename
      }

      await Category.update({ name, path }, { where: { id } })

      return res.status(200).json()
    } catch (error) {

    }
  }
}

export default new CategoryController()

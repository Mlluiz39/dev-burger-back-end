import User from '../models/User'
import * as Yup from 'yup'
import jwt from 'jsonwebtoken'

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })

    const userEmailOrPasswordIncorrect = () => {
      return res
        .status(401)
        .json({ error: 'Make sure your password or email are correct' })
    }

    if (!(await schema.isValid(req.body))) return userEmailOrPasswordIncorrect()

    const { email, password } = req.body

    const user = await User.findOne({
      where: { email },
    })

    if (!user) return userEmailOrPasswordIncorrect()

    if (!(await user.checkPassword(password)))
      return userEmailOrPasswordIncorrect()

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.admin,
      token: jwt.sign({ id: user.id, name: user.name }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION,
      }),
    })
  }
}


export default new SessionController()

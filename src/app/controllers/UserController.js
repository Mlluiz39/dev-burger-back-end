const  User  = require("../models/User");
const { v4 } = require("uuid");
const Yup = require("yup");

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(8),
      admin: Yup.boolean(),
    });

    /** validação básica
     * if (!(await schema.isValid(req.body))) {
     *  return res.status(400).json({ error: 'Validation fails' })
     * }
     */

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: err.errors });
    }

    const { name, email, password, admin } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await User.create({
      id: v4(),
      name,
      email,
      password,
      admin,
    });

    return res.json({ id: user.id, name, email, admin }).status(201);
  }
}

module.exports = new UserController();

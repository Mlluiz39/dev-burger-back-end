const Jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization

  // verifica se o token foi enviado
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' })
  }
  // retira o Bearer do token
  const [, token] = authHeader.split(' ')

  try {
    // verifica se o token é o mesmo que foi gerado
    const decoded = Jwt.verify(token, process.env.TOKEN_SECRET)

    // Cria uma variável global e verifica se o id do usuário existe no banco de dados
    req.userId = decoded.id
    req.userName = decoded.name

    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' })
  }
}

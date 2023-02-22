const Sequelize = require( 'sequelize')
const { Model } = require( 'sequelize')

class Category extends Model {
  static init (sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get () {
            return `${process.env.APP_URL}/category-files/${this.path}`
          }
        }
      },
      {
        sequelize
      }
    )
    return this
  }
}

module.exports = Category

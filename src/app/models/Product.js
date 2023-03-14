const Sequelize = require( 'sequelize')
const { Model } = require( 'sequelize')

class Product extends Model {
  static init (sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.INTEGER,
        path: Sequelize.STRING,
        offer: Sequelize.BOOLEAN,
        url: {
          type: Sequelize.VIRTUAL,
          get () {
            return `https://apinodeburger.fly.dev/product-files/${this.path}`
          }
        }
      },
      {
        sequelize
      }
    )
    return this
  }

  static associate (models) {
    this.belongsTo(models.Category,
      {
        foreignKey: 'category_id', as: 'category'
      })
  }
}

module.exports = Product

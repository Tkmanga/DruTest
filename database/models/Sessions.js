const {Model, DataTypes} = require('sequelize')
const sequelize = require('../db')
class Session extends Model {

}

Session.init({
    data: DataTypes.TEXT
},{
    sequelize,
    modelName: 'Session'
})

module.exports = Session; 
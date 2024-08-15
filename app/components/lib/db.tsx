// import { Sequelize, DataTypes } from 'sequelize';

// // Initialize Sequelize with PostgreSQL connection
// const sequelize = new Sequelize("postgres://postgres:12345@localhost:5432/postgres", {
//   dialectModule: require('pg'),
//   dialect: 'postgres',
//   logging: true, // Disable logging if not needed
// });

// // Define User model
// const User = sequelize.define('User', {
//   username: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   password_hash: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
// }, {
//   timestamps: true,
//   tableName: 'users',
// });

// // Export sequelize and User model
// export { sequelize, User };




import { Sequelize, DataTypes, Model } from 'sequelize';

// Initialize Sequelize
const sequelize = new Sequelize("postgres://postgres:12345@localhost:5432/postgres", {
  dialectModule: require('pg'),
  dialect: 'postgres',
  logging: false, // Set to true if you want to see SQL queries in the console
});

// Define the User model
class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password_hash!: string;
  public created_at!: Date;

  // timestamps!
  public readonly createdAt!: Date;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false
  },
  password_hash: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: false, // Set to true if you want Sequelize to manage createdAt and updatedAt fields
  createdAt: 'created_at', // Use your custom field for createdAt
  updatedAt: false // Disable updatedAt as it's not in your schema
});

export { sequelize, User };

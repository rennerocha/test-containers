import { Sequelize, DataTypes, Dialect } from "sequelize";

type GetSequelizeArgs = {
  database: string;
  username: string;
  password: string;
  host: string;
  port: number;
  dialect: Dialect;
};

export async function getSequelize({
  database,
  username,
  password,
  host,
  port,
  dialect,
}: GetSequelizeArgs) {
  // Create the client
  const client = new Sequelize(database, username, password, {
    host,
    dialect,
    port,
    logging: false,
  });

  // Define a model
  const User = client.define("User", {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
    },
  });

  // Make sure the table exists
  await User.sync();

  // Return the client and model
  return { client, User };
}

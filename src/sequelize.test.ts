import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { getSequelize } from "./sequelize";

describe("should connect and return a query result", () => {
  it("works with postgres", async () => {
    // Create a container using testcontainers
    console.log('Start container')
    const container = await new PostgreSqlContainer().start();
    console.log('Container started')

    // Use the details from the container, create the database client
    const { client, User } = await getSequelize({
      database: container.getDatabase(),
      username: container.getUsername(),
      password: container.getPassword(),
      host: container.getHost(),
      port: container.getPort(),
      dialect: "postgres",
    });

    // Check if you have access to the database
    await client.authenticate();

    // Create a user
    await User.create({
      firstName: "John",
      lastName: "Hancock",
    });

    // Get all users
    const users = await User.findAll();

    // Check that the expected user is present
    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          firstName: "John",
          lastName: "Hancock",
          id: 1,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      ])
    );

    // Close connections
    await client.close();
    await container.stop();
  }, 25000);
});

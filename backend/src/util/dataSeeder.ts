import bcrypt from "bcrypt";
import dotenvFlow from "dotenv-flow";
import { faker } from "@faker-js/faker";

// Project import
import { bookModel } from "../models/bookModel";
import { userModel } from "../models/userModel";
import { connect, disconnect } from "../repository/database";

dotenvFlow.config();

/**
 * Seed the database with data
 */
export async function seed() {
  try {
    await connect();

    await deleteAllData();
    await seedData();
    console.log("Seeding process completed successfully...");
    process.exit();
  } catch (err) {
    console.log("Error Seeding data." + err);
  } finally {
    await disconnect();
  }
}

/**
 * Delete all data from the database
 */
export async function deleteAllData() {
  await bookModel.deleteMany();
  await userModel.deleteMany();

  console.log("Cleared data successfully...");
}

/**
 * Seed data into the database
 */
export async function seedData() {
  // hash the password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("12345678", salt);

  const user1 = new userModel();
  user1.name = faker.person.fullName();
  user1.email = faker.internet.email();
  user1.password = passwordHash;
  await user1.save();

  const user2 = new userModel();
  user2.name = faker.person.fullName();
  user2.email = faker.internet.email();
  user2.password = passwordHash;
  await user2.save();

  // Generate fake book
  for (let index = 0; index < 10; index++) {
    await new bookModel({
      title: faker.book.title(),
      description: faker.lorem.paragraph(),
      author: faker.book.author(),
      publishedDate: faker.date.past(),
      genre: faker.book.genre(),
      rating: faker.number.float({ min: 0, max: 5, multipleOf: 0.1 }),
      imageURL: "https://picsum.photos/500/500",
      _reviewedBy: Array.from({ length: 3 }, () => faker.person.fullName()),
    }).save();
  }

  console.log("Seeded data successfully...");
}

// start the actual seeding
seed();

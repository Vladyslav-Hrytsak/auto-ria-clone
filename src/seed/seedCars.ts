import mongoose from "mongoose";

import { config } from "../config/configs";
import { CarBrand } from "../models/carBrand.model";
import { CarModel } from "../models/carModel.model";

const cars = [
  {
    brand: "BMW",
    models: ["X5", "X3", "X6", "X7", "M5", "i7", "Z4"],
  },
  {
    brand: "Audi",
    models: ["A4", "A6", "Q5", "Q7", "Q8", "e-tron GT", "RS6"],
  },
  {
    brand: "Mercedes-Benz",
    models: ["C-Class", "E-Class", "S-Class", "GLE", "GLS", "EQS", "G-Wagon"],
  },
  {
    brand: "Toyota",
    models: ["Camry", "Corolla", "RAV4", "Land Cruiser 300", "Supra", "Hilux"],
  },
  {
    brand: "Volkswagen",
    models: ["Passat", "Golf", "Touareg", "Tiguan", "ID.4", "Arteon"],
  },
  {
    brand: "Daewoo",
    models: ["Lanos", "Nexia", "Matiz", "Nubira", "Gentra"],
  },
  {
    brand: "Tesla",
    models: ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck"],
  },
  {
    brand: "Hyundai",
    models: ["Elantra", "Sonata", "Tucson", "Santa Fe", "IONIQ 5", "Palisade"],
  },
  {
    brand: "Kia",
    models: ["Sportage", "Rio", "Ceid", "K5", "Sorento", "EV6", "Stinger"],
  },
  {
    brand: "Lexus",
    models: ["RX", "NX", "LX", "IS", "ES", "LS"],
  },
  {
    brand: "Porsche",
    models: ["911", "Cayenne", "Macan", "Panamera", "Taycan"],
  },
  {
    brand: "Honda",
    models: ["Civic", "Accord", "CR-V", "HR-V", "Pilot"],
  },
  {
    brand: "Ford",
    models: ["Mustang", "F-150", "Explorer", "Focus", "Kuga"],
  },
  {
    brand: "Mazda",
    models: ["CX-5", "CX-9", "Mazda 3", "Mazda 6", "MX-5 Miata"],
  },
  {
    brand: "Volvo",
    models: ["XC90", "XC60", "S90", "V60", "EX90"],
  },
];

async function seedCars() {
  await mongoose.connect(config.MONGO_URL);

  console.log("Connected to DB");

  await CarBrand.deleteMany({});
  await CarModel.deleteMany({});

  for (const car of cars) {
    const brand = await CarBrand.create({ name: car.brand });

    const models = car.models.map((model) => ({
      name: model,
      brand: brand._id,
    }));

    await CarModel.insertMany(models);
  }

  console.log("Cars seeded");

  process.exit();
}

seedCars();

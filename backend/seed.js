const mongoose = require("mongoose");
const dotenv   = require("dotenv");
const Listing  = require("./models/PG"); // adjust path if needed

dotenv.config();

const SEED_DATA = [
  {
    type: "pg",
    name: "Sri Lakshmi PG",
    area: "Thiruparankundram",
    city: "madurai",
    price: "₹4,500",
    tag: "Girls Only",
    fresh: 98,
    rating: "4.7",
    availableRooms: 5,
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80"
  },
  {
    type: "pg",
    name: "Ganesh Men's Hostel",
    area: "Kodimangalam",
    city: "madurai",
    price: "₹3,800",
    tag: "Boys Only",
    fresh: 85,
    rating: "4.4",
    availableRooms: 8,
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=80"
  },
  {
    type: "pg",
    name: "Royal Residency PG",
    area: "RS Puram",
    city: "coimbatore",
    price: "₹5,200",
    tag: "Both",
    fresh: 100,
    rating: "4.8",
    availableRooms: 3,
    img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=80"
  },
  {
    type: "mess",
    name: "Murugan Mess",
    area: "Thiruparankundram",
    city: "madurai",
    price: "₹2,200",
    tag: "✔ Qty Honest",
    fresh: 95,
    rating: "4.6",
    img: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=500&q=80"
  },
  {
    type: "mess",
    name: "Annapoorna Bhavan",
    area: "Anna Nagar",
    city: "madurai",
    price: "₹1,900",
    tag: "⚠ Qty Drops",
    fresh: 72,
    rating: "4.3",
    img: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=500&q=80"
  },
  {
    type: "mess",
    name: "Saravana Mess",
    area: "RS Puram",
    city: "coimbatore",
    price: "₹2,500",
    tag: "Non-Veg",
    fresh: 88,
    rating: "4.5",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80"
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Listing.deleteMany({});       // clears existing data
    console.log("🗑️  Old listings cleared");

    await Listing.insertMany(SEED_DATA);
    console.log("🌱 Seed data inserted successfully!");

  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  } finally {
    mongoose.disconnect();
  }
};

seed();
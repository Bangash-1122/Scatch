import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import connectDB from "./index.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { User } from "../models/user.model.js";

const initialBags = [
    {
        name: "Clinge Bag",
        price: 1200,
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1bag-FBQno98AXtDnWi56egdllGVc7VzuKu.png",
        category: "Duffel",
        description: "Classic leather duffel for daily travel",
        stock: 15,
        bgColor: "#E9D3CB",
        panelColor: "#D1B1A3",
        textColor: "#5E4032"
    },
    {
        name: "Backpack",
        price: 1100,
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2bag-4sM5bW2NZaQV9kZRIDbmY6i1nuDivM.png",
        category: "Backpack",
        description: "Navy city backpack",
        stock: 12,
        bgColor: "#E4E8EC",
        panelColor: "#BFD3E1",
        textColor: "#2F4E62"
    },
    {
        name: "Multipurpose",
        price: 100,
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3bag%201-KmZR532uMH3mKNoSf9iidz8vYwrCUn.png",
        category: "Tote",
        description: "Everyday lightweight tote",
        stock: 20,
        bgColor: "#D0C4B0",
        panelColor: "#B9A88C",
        textColor: "#4A3F2C"
    },
    {
        name: "Pink Attack",
        price: 1400,
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4bag-yIrF5Nuv08gDwAP1NFlkYLFFBvWeSs.png",
        category: "Backpack",
        description: "Bold pink fashion backpack",
        stock: 8,
        bgColor: "#EACFD5",
        panelColor: "#D2B3BD",
        textColor: "#68424C",
        discountPercent: 25
    },
    {
        name: "The Stud",
        price: 1100,
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5bag-C1s34qoIKwrXx6Y8VM0PX5qx2vNnqf.png",
        category: "Backpack",
        description: "Matte black backpack",
        stock: 10,
        bgColor: "#CFCFD1",
        panelColor: "#B5B5B7",
        textColor: "#343436"
    },
    {
        name: "Surprise",
        price: 1100,
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6bag-At2ZbbWvmYMvsg2HtjUzNmv9Jj6mBD.png",
        category: "Pouch",
        description: "Soft fabric pouch bag",
        stock: 18,
        bgColor: "#E7DECD",
        panelColor: "#D3C4A8",
        textColor: "#5A4C36"
    },
    {
        name: "Supreme",
        price: 1800,
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7bag-clXxb35jz7zrf27hE4KEEIkLyLzc1x.png",
        category: "Backpack",
        description: "Sharp edge premium backpack",
        stock: 25,
        bgColor: "#CACBCC",
        panelColor: "#A9ABAE",
        textColor: "#353A40"
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log("🌱 Cleaning existing products and categories...");
        await Product.deleteMany({});
        await Category.deleteMany({});

        console.log("🌱 Seeding categories...");
        const categories = ["Backpack", "Duffel", "Tote", "Pouch"];
        for (const cat of categories) {
            await Category.create({ name: cat, description: `${cat} bags collection` });
        }

        console.log("🌱 Seeding products...");
        await Product.insertMany(initialBags);

        console.log("🌱 Checking demo owner and user accounts...");
        const ownerExists = await User.findOne({ email: "owner@example.com" });
        if (!ownerExists) {
            await User.create({
                fullName: "Store Owner",
                email: "owner@example.com",
                username: "owner",
                password: "password123",
                role: "owner"
            });
            console.log("👤 Created demo owner: owner@example.com / password123");
        }

        const userExists = await User.findOne({ email: "user@example.com" });
        if (!userExists) {
            await User.create({
                fullName: "John Doe",
                email: "user@example.com",
                username: "johndoe",
                password: "password123",
                role: "user"
            });
            console.log("👤 Created demo user: user@example.com / password123");
        }

        console.log("✅ Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedDatabase();

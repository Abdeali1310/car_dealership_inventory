import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Clean up database
  await prisma.inventoryTransaction.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  // Hash passwords
  const adminPassword = await bcrypt.hash("admin123", 10);
  const customerPassword = await bcrypt.hash("customer123", 10);

  // Seed Admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@dealership.com",
      password: adminPassword,
      fullName: "Dealership Admin",
      role: "ADMIN",
    },
  });
  console.log(`Created admin: ${admin.email}`);

  // Seed Customer
  const customer = await prisma.user.create({
    data: {
      email: "customer@dealership.com",
      password: customerPassword,
      fullName: "John Doe",
      role: "CUSTOMER",
    },
  });
  console.log(`Created customer: ${customer.email}`);

  // Seed Vehicles — 12 vehicles matching the uploaded PNG image files.
  const vehicles = [
    // --- Hatchbacks ---
    {
      make: "Maruti Suzuki",
      model: "Swift",
      category: "HATCHBACK" as const,
      price: 650000.0,
      quantity: 12,
      description: "India's best-selling hatchback — peppy engine, low running cost.",
      imageUrl: "/uploads/swift.png",
    },
    {
      make: "Maruti Suzuki",
      model: "Baleno",
      category: "HATCHBACK" as const,
      price: 800000.0,
      quantity: 3,
      description: "Premium hatchback with a spacious cabin and strong mileage.",
      imageUrl: "/uploads/baleno.png",
    },
    {
      make: "Hyundai",
      model: "i20",
      category: "HATCHBACK" as const,
      price: 850000.0,
      quantity: 8,
      description: "Feature-rich hatchback known for its build quality and design.",
      imageUrl: "/uploads/i20.png",
    },

    // --- Sedans ---
    {
      make: "Maruti Suzuki",
      model: "Dzire",
      category: "SEDAN" as const,
      price: 750000.0,
      quantity: 9,
      description: "Compact sedan popular with families and fleet/taxi buyers alike.",
      imageUrl: "/uploads/dzire.png",
    },
    {
      make: "Honda",
      model: "City",
      category: "SEDAN" as const,
      price: 1300000.0,
      quantity: 5,
      description: "Long-running, reliable sedan known for its smooth engine.",
      imageUrl: "/uploads/city.png",
    },

    // --- SUVs ---
    {
      make: "Tata",
      model: "Nexon",
      category: "SUV" as const,
      price: 950000.0,
      quantity: 10,
      description: "5-star safety rated compact SUV, also sold as an EV.",
      imageUrl: "/uploads/nexon.png",
    },
    {
      make: "Mahindra",
      model: "XUV700",
      category: "SUV" as const,
      price: 1800000.0,
      quantity: 0,
      description: "Feature-loaded 7-seater SUV with strong performance.",
      imageUrl: "/uploads/xuv700.png",
    },
    {
      make: "Kia",
      model: "Seltos",
      category: "SUV" as const,
      price: 1200000.0,
      quantity: 3,
      description: "Sharp-looking midsize SUV with a premium cabin.",
      imageUrl: "/uploads/seltos.png",
    },

    // --- Vans / MPVs ---
    {
      make: "Toyota",
      model: "Innova Crysta",
      category: "VAN" as const,
      price: 2200000.0,
      quantity: 4,
      description: "India's go-to MPV for large families and long road trips.",
      imageUrl: "/uploads/innova.png",
    },

    // --- Trucks ---
    {
      make: "Tata",
      model: "Ace",
      category: "TRUCK" as const,
      price: 650000.0,
      quantity: 6,
      description: "India's iconic mini-truck, the backbone of last-mile delivery.",
      imageUrl: "/uploads/ace.png",
    },

    // --- Motorcycles ---
    {
      make: "Royal Enfield",
      model: "Classic 350",
      category: "MOTORCYCLE" as const,
      price: 210000.0,
      quantity: 15,
      description: "Retro-styled cruiser, one of India's most iconic motorcycles.",
      imageUrl: "/uploads/classic350.png",
    },
    {
      make: "Bajaj",
      model: "Pulsar 150",
      category: "MOTORCYCLE" as const,
      price: 115000.0,
      quantity: 1,
      description: "Long-standing favorite commuter-sport motorcycle.",
      imageUrl: "/uploads/pulsar.png",
    },
  ];

  for (const vehicleData of vehicles) {
    const vehicle = await prisma.vehicle.create({
      data: vehicleData,
    });
    console.log(`Created vehicle: ${vehicle.make} ${vehicle.model} (${vehicle.category})`);
  }

  console.log(`Database seeding completed successfully! (${vehicles.length} vehicles)`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
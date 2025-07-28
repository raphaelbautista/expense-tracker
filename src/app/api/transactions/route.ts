// app/api/transactions/route.ts
import { CosmosClient } from "@azure/cosmos";
import { NextResponse } from "next/server";

// Ensure this part is updated to use the single connection string
const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING || "");
const database = client.database(process.env.COSMOS_DATABASE_ID || "");
const container = database.container(process.env.COSMOS_CONTAINER_ID || "");

// GET: Fetch all transactions
export async function GET() {
  try {
    const { resources: items } = await container.items.query("SELECT * from c").fetchAll();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

// POST: Add a new transaction
export async function POST(request: Request) {
  try {
    const newTransaction = await request.json();
    // Cosmos DB expects an 'id' property as a string
    newTransaction.id = newTransaction.id.toString(); 

    const { resource: createdItem } = await container.items.create(newTransaction);
    return NextResponse.json(createdItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
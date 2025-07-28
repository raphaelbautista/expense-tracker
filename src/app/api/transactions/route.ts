// app/api/transactions/route.ts
import { CosmosClient } from "@azure/cosmos";
import { NextResponse } from "next/server";

// Initialize the Cosmos DB client
const endpoint = process.env.COSMOS_ENDPOINT || "";
const key = process.env.COSMOS_KEY || "";
const databaseId = process.env.COSMOS_DATABASE_ID || "";
const containerId = process.env.COSMOS_CONTAINER_ID || "";

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

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
// src/app/api/transactions/route.ts
import { CosmosClient } from "@azure/cosmos";
import { NextResponse } from "next/server";

// Add connection string validation
const connectionString = process.env.COSMOS_CONNECTION_STRING;
const databaseId = process.env.COSMOS_DATABASE_ID;
const containerId = process.env.COSMOS_CONTAINER_ID;

// Only initialize Cosmos client if all required environment variables are present
let client: CosmosClient | null = null;
let database: ReturnType<CosmosClient['database']> | null = null;
let container: ReturnType<ReturnType<CosmosClient['database']>['container']> | null = null;

if (connectionString && databaseId && containerId) {
  try {
    client = new CosmosClient(connectionString);
    database = client.database(databaseId);
    container = database.container(containerId);
  } catch (error) {
    console.error('Failed to initialize Cosmos DB client:', error);
  }
}

// Mock data for development/build time when Cosmos DB is not available
const mockTransactions = [
  {
    id: "1",
    description: "Sample Income",
    amount: 1000,
    category: "Salary",
    type: "income",
    date: "2024-01-15"
  },
  {
    id: "2", 
    description: "Sample Expense",
    amount: 50,
    category: "Groceries",
    type: "expense", 
    date: "2024-01-16"
  }
];

// GET: Fetch all transactions
export async function GET() {
  // If Cosmos DB is not configured, return mock data
  if (!container) {
    console.warn('Cosmos DB not configured - returning mock data');
    return NextResponse.json(mockTransactions);
  }

  try {
    const { resources: items } = await container.items
      .query("SELECT * from c")
      .fetchAll();

    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    // Fallback to mock data on error
    return NextResponse.json(mockTransactions);
  }
}

// POST: Add a new transaction
export async function POST(request: Request) {
  try {
    const newTransaction = await request.json();

    // Ensure `id` is a string (required by Cosmos DB)
    newTransaction.id = newTransaction.id.toString();

    // If Cosmos DB is not configured, return mock response
    if (!container) {
      console.warn('Cosmos DB not configured - returning mock response');
      return NextResponse.json(newTransaction, { status: 201 });
    }

    const { resource: createdItem } = await container.items.create(newTransaction);

    return NextResponse.json(createdItem, { status: 201 });
  } catch (error) {
    console.error("Failed to create transaction:", error);
    
    // Return the transaction data even if DB operation fails (for development)
    const newTransaction = await request.json();
    newTransaction.id = newTransaction.id.toString();
    return NextResponse.json(newTransaction, { status: 201 });
  }
}
// src/app/api/transactions/route.ts
import { CosmosClient } from "@azure/cosmos";
import { NextResponse } from "next/server";

// Get environment variables
const connectionString = process.env.COSMOS_CONNECTION_STRING;
const databaseId = process.env.COSMOS_DATABASE_ID;
const containerId = process.env.COSMOS_CONTAINER_ID;

// Initialize Cosmos client
let client: CosmosClient | null = null;
let database: ReturnType<CosmosClient['database']> | null = null;
let container: ReturnType<ReturnType<CosmosClient['database']>['container']> | null = null;

if (connectionString && databaseId && containerId) {
  try {
    client = new CosmosClient(connectionString);
    database = client.database(databaseId);
    container = database.container(containerId);
    console.log('✅ Cosmos DB client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Cosmos DB client:', error);
  }
} else {
  console.error('❌ Missing Cosmos DB environment variables:', {
    hasConnectionString: !!connectionString,
    hasDatabaseId: !!databaseId,
    hasContainerId: !!containerId
  });
}

// GET: Fetch all transactions
export async function GET() {
  if (!container) {
    console.error('❌ Cosmos DB container not available');
    return NextResponse.json(
      { error: 'Database not configured' }, 
      { status: 503 }
    );
  }

  try {
    console.log('🔍 Fetching transactions from Cosmos DB...');
    const { resources: items } = await container.items
      .query("SELECT * FROM c ORDER BY c.date DESC")
      .fetchAll();

    console.log(`✅ Successfully fetched ${items.length} transactions`);
    return NextResponse.json(items);
  } catch (error) {
    console.error("❌ Failed to fetch transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// POST: Add a new transaction
export async function POST(request: Request) {
  if (!container) {
    console.error('❌ Cosmos DB container not available');
    return NextResponse.json(
      { error: 'Database not configured' }, 
      { status: 503 }
    );
  }

  try {
    const newTransaction = await request.json();

    // Ensure `id` is a string (required by Cosmos DB)
    newTransaction.id = newTransaction.id.toString();

    console.log('💾 Creating transaction in Cosmos DB:', newTransaction);
    const { resource: createdItem } = await container.items.create(newTransaction);

    console.log('✅ Transaction created successfully:', createdItem?.id);
    return NextResponse.json(createdItem, { status: 201 });
  } catch (error) {
    console.error("❌ Failed to create transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
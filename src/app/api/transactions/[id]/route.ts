// src/app/api/transactions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';

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

// PUT: Update an existing transaction
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!container) {
    console.error('❌ Cosmos DB container not available');
    return NextResponse.json(
      { error: 'Database not configured' }, 
      { status: 503 }
    );
  }

  const params = await context.params;
  const id = params.id;
  
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  
  try {
    const updatedTransaction = await request.json();
    
    // Ensure `id` is a string and matches the URL parameter
    updatedTransaction.id = id;

    console.log('✏️ Updating transaction in Cosmos DB:', id, updatedTransaction);
    
    const { resource: updated } = await container
      .item(id, id)
      .replace(updatedTransaction);

    console.log('✅ Transaction updated successfully:', id);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('❌ Update error:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!container) {
    console.error('❌ Cosmos DB container not available');
    return NextResponse.json(
      { error: 'Database not configured' }, 
      { status: 503 }
    );
  }

  const params = await context.params;
  const id = params.id;
  
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  
  try {
    console.log('🗑️ Deleting transaction from Cosmos DB:', id);
    await container.item(id, id).delete();
    console.log('✅ Transaction deleted successfully:', id);
    return NextResponse.json({ message: 'Transaction deleted' }, { status: 200 });
  } catch (error) {
    console.error('❌ Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
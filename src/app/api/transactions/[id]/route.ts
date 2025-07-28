import { NextRequest, NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';

// Add connection string validation
const connectionString = process.env.COSMOS_CONNECTION_STRING;
const databaseId = process.env.COSMOS_DATABASE_ID;
const containerId = process.env.COSMOS_CONTAINER_ID;

// Only initialize Cosmos client if all required environment variables are present
let client: CosmosClient | null = null;
let database: any = null;
let container: any = null;

if (connectionString && databaseId && containerId) {
  try {
    client = new CosmosClient(connectionString);
    database = client.database(databaseId);
    container = database.container(containerId);
  } catch (error) {
    console.error('Failed to initialize Cosmos DB client:', error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Check if Cosmos DB is properly configured
  if (!container) {
    console.warn('Cosmos DB not configured - using mock response');
    return NextResponse.json({ message: 'Transaction deleted (mock)' }, { status: 200 });
  }

  const params = await context.params;
  const id = params.id;
  
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  
  try {
    await container.item(id, id).delete();
    return NextResponse.json({ message: 'Transaction deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING || '');
const database = client.database(process.env.COSMOS_DATABASE_ID || '');
const container = database.container(process.env.COSMOS_CONTAINER_ID || '');

export async function DELETE(
  request: NextRequest, // ✅ MUST be NextRequest
  { params }: { params: { id: string } } // ✅ Destructure context correctly
) {
  const { id } = params;

  try {
    await container.item(id, id).delete();
    return NextResponse.json({ message: 'Transaction deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}

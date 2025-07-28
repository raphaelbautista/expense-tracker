// app/api/transactions/[id]/route.ts
import { CosmosClient } from "@azure/cosmos";
import { NextResponse } from "next/server";

// Re-initialize the client here as well
const endpoint = process.env.COSMOS_ENDPOINT || "";
const key = process.env.COSMOS_KEY || "";
const databaseId = process.env.COSMOS_DATABASE_ID || "";
const containerId = process.env.COSMOS_CONTAINER_ID || "";

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

// DELETE: Delete a transaction by its ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await container.item(id, id).delete();
    return NextResponse.json({ message: "Transaction deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
}
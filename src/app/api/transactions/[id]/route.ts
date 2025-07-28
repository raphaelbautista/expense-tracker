// app/api/transactions/[id]/route.ts
import { CosmosClient } from "@azure/cosmos";
import { NextResponse } from "next/server";

// Initialize the client using the single connection string
const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING || "");
const database = client.database(process.env.COSMOS_DATABASE_ID || "");
const container = database.container(process.env.COSMOS_CONTAINER_ID || "");

export async function DELETE(
  request: Request,
  // This is the explicit, robust signature that Azure's build system expects
  context: { params: { id: string } }
) {
  const id = context.params.id;

  try {
    await container.item(id, id).delete();
    return NextResponse.json({ message: "Transaction deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
}
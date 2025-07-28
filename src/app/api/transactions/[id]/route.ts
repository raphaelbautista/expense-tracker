// app/api/transactions/[id]/route.ts
import { CosmosClient } from "@azure/cosmos";
import { NextResponse } from "next/server";

// Initialize the client
const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING || "");
const database = client.database(process.env.COSMOS_DATABASE_ID || "");
const container = database.container(process.env.COSMOS_CONTAINER_ID || "");

// DELETE: Delete a transaction by its ID
export async function DELETE(
  request: Request,
  // --- THIS IS THE ROBUST, CORRECTED SIGNATURE ---
  context: { params: { id: string } }
) {
  // Get the id from the context object
  const id = context.params.id;

  try {
    // The partition key is the second argument for the delete operation
    await container.item(id, id).delete();
    return NextResponse.json({ message: "Transaction deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
}
"use server";

import { revalidatePath } from "next/cache";
import { setPortfolioAssignment } from "@/lib/domain";
import { propertyStore } from "@/lib/property-store";

export async function updatePortfolioAssignment(input) {
  if (
    !input ||
    typeof input.firmId !== "string" ||
    typeof input.portfolioId !== "string" ||
    typeof input.propertyId !== "string" ||
    typeof input.assigned !== "boolean"
  ) {
    throw new Error("The assignment request is incomplete.");
  }

  const updatedStore = await propertyStore.update((current) =>
    setPortfolioAssignment(current, input),
  );

  revalidatePath("/");
  return updatedStore;
}

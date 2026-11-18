import { connection } from "next/server";
import PortfolioWorkspace from "@/components/portfolio-workspace";
import { propertyStore } from "@/lib/property-store";

export default async function HomePage() {
  await connection();
  const initialData = await propertyStore.read();

  return <PortfolioWorkspace initialData={initialData} />;
}

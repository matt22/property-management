"use client";

import { useRef, useState } from "react";
import { updatePortfolioAssignment } from "@/app/actions";
import { setPortfolioAssignment } from "@/lib/domain";

export function usePortfolioAssignments(initialData, selectedFirmId) {
  const [data, setData] = useState(initialData);
  const [savingKeys, setSavingKeys] = useState(() => new Set());
  const savingRef = useRef(new Set());
  const [saveMessage, setSaveMessage] = useState("");

  async function handleToggle(portfolioId, propertyId, assigned) {
    const key = `${portfolioId}:${propertyId}`;
    if (savingRef.current.has(key)) return;
    savingRef.current.add(key);
    setSavingKeys(new Set(savingRef.current));
    setSaveMessage("");
    const input = { firmId: selectedFirmId, portfolioId, propertyId, assigned };
    setData((current) => setPortfolioAssignment(current, input));

    try {
      await updatePortfolioAssignment(input);
      setSaveMessage((message) => message.startsWith("We couldn’t") ? message : "Assignment saved");
    } catch {
      setData((current) => setPortfolioAssignment(current, { ...input, assigned: !assigned }));
      setSaveMessage("We couldn’t save that assignment. Please try again.");
    } finally {
      savingRef.current.delete(key);
      setSavingKeys(new Set(savingRef.current));
    }
  }

  return { data, savingKeys, saveMessage, handleToggle };
}

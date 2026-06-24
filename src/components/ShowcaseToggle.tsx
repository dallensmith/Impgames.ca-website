"use client";

import { useState } from "react";
import { toggleShowcase } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function ShowcaseToggle({
  postId,
  currentShowcaseOrder,
}: {
  postId: string;
  currentShowcaseOrder: number | null;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const raw = e.target.value;
    const slot = raw === "" ? null : parseInt(raw, 10);

    setLoading(true);
    try {
      await toggleShowcase(postId, slot);
      router.refresh();
    } catch (error) {
      console.error("Showcase toggle failed:", error);
      // Reset the select to its previous value on error
      e.target.value = currentShowcaseOrder?.toString() ?? "";
    } finally {
      setLoading(false);
    }
  }

  const currentValue = currentShowcaseOrder?.toString() ?? "";

  return (
    <select
      className="showcase-select"
      value={currentValue}
      onChange={handleChange}
      disabled={loading}
      aria-label="Showcase slot"
    >
      <option value="">—</option>
      <option value="1">⭐ Slot 1</option>
      <option value="2">⭐ Slot 2</option>
    </select>
  );
}

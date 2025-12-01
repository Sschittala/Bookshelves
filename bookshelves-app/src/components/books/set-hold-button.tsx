"use client"

import { setHold } from "@/data/hold-data";
import { useState } from "react"
import { Button } from "@/components/ui/button";
import { Bookmark, Loader2 } from "lucide-react";

interface SetHoldButtonProps {
  book_id: number,
  member_id: number
}

export default function SetHoldButton({ book_id, member_id }: SetHoldButtonProps) {
  const [loading, setLoading] = useState(false);

  const submitSetHold = async () => {
    setLoading(true);
    try {
      const response = await setHold(member_id, book_id);
      if (response.hold_id) {
        alert(`Hold placed successfully! Reference ID: ${response.hold_id}`);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to place hold. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={submitSetHold}
      disabled={loading}
      className="bg-zinc-100 text-zinc-900 hover:bg-white font-bold"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Bookmark className="w-4 h-4 mr-2" />
      )}
      {loading ? "Processing..." : "Place Hold"}
    </Button>
  )
}

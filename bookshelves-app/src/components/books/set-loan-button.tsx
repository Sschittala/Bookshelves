"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button"; import { BookOpen, Loader2, Check } from "lucide-react";

interface SetLoanButtonProps {
  book_id: number;
  copy_id: number;
  member_id: number;
}

export default function SetLoanButton({ book_id, member_id, copy_id }: SetLoanButtonProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submitSetLoan = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call when backend is ready
      // const response = await setLoan(member_id, copy_id);

      // Mock delay for UI demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock success logic
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

    } catch (e) {
      console.error(e);
      alert("Failed to checkout book.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={submitSetLoan}
      disabled={loading || success}
      className={` font-bold transition-all duration-200 ${success ? "bg-green-600 hover:bg-green-700 text-white"
        : "bg-blue-600 hover:bg-blue-700 text-white"
        } `}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : success ? (
        <Check className="w-4 h-4 mr-2" />
      ) : (
        <BookOpen className="w-4 h-4 mr-2" />
      )}

      {loading ? "Processing..." : success ? "Checked Out" : "Checkout"}
    </Button>
  )
}

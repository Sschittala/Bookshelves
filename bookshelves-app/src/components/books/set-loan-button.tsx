"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button"; import { BookOpen, Loader2, Check } from "lucide-react";
import { addLoan } from "@/data/loan-data";

interface SetLoanButtonProps {
  copy_id: number;
  member_id: number;
}

export default function SetLoanButton({ member_id, copy_id }: SetLoanButtonProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submitSetLoan = async () => {
    setLoading(true);
    try {
      const response = await addLoan(member_id, copy_id)
      if (response.loan_id) {
        setLoading(false)
        setSuccess(true)
      }
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

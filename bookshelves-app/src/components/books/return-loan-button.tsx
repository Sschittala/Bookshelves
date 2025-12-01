"use client"

import { removeLoan } from "@/data/loan-data";
import { useState } from "react";
import { Button } from "../ui/button";
import { BookOpen, Check, Loader2 } from "lucide-react";

interface ReturnLoanButtonProps {
  loan_id: number
}

export default function ReturnLoanButton({ loan_id }: ReturnLoanButtonProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);



  const returnLoan = async () => {
    setLoading(true);
    try {
      const response = await removeLoan(loan_id)
      if (response.ok) {
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
      variant={`destructive`}
      onClick={returnLoan}
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

      {loading ? "Processing..." : success ? "Loan Returned" : "Return Loan"}
    </Button>
  )
}

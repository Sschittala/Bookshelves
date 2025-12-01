/*
 *
 *
 * UNDER CONSTRUCTION

"use client"
import { useState } from "react"


interface SetLoanButtonProps {
  book_id: number,
  copy_id: number,
  member_id: number
}

export default function SetLoanButton({ book_id, member_id, copy_id }: SetLoanButtonProps) {

  const [loading, setLoading] = useState(true);
  const submitSetHold = async () => {
    const response = await setLoan(member_id, book_id)
    if (response.hold_id) {
      setLoading(false)
    }
  }

  return (
    <div></div>

  )

}

 * */

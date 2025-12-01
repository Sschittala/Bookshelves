/*
 *
 *
 * Under construction
 *
 *
 *
"use client"
import { setHold } from "@/data/hold-data";
import { useState } from "react"


interface SetHoldButtonProps {
  book_id: number,
  member_id: number
}

export default function SetHoldButton({ book_id, member_id }: SetHoldButtonProps) {

  const [loading, setLoading] = useState(true);
  const submitSetHold = async () => {
    const response = await setHold(member_id, book_id)
    if (response.hold_id) {
      setLoading(false)
    }
  }


  return (
    <div></div>

  )

}


 * */


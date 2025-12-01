"use client";

import { useState, useEffect } from "react";
import { BookOpen, Clock, CheckCircle, XCircle } from "lucide-react";
import { useSession } from "@/contexts/SessionProvider";

export default function Page() {
  const [memberId, setMemberId] = useState("4876157");
  const [holds, setHolds] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const fetchData = async () => {
    setLoading(true);
    setError(null);

    const { session, signOut } = useSession()

    try {
      const [holdsRes] = await Promise.all([ // [holdsRes, loansRes]
        fetch("/api/holds/get_holds", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session.member_id: memberId }),
        }),
        // fetch("/api/loans/get_loans", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ member_id: memberId }),
        // }),
      ]);

    //   if (!holdsRes.ok || !loansRes.ok) {
    //     throw new Error("Failed to fetch data");
    //   }

      const holdsData = await holdsRes.json();
    //   const loansData = await loansRes.json();

      setHolds(holdsData);
    //   setLoans(loansData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (memberId) {
      fetchData();
    }
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
}
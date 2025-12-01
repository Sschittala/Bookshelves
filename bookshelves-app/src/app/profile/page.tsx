"use client"
import { useSession } from "@/contexts/SessionProvider"
import { getHolds, Hold } from "@/data/hold-data";
import { useEffect, useState } from "react"
import { User, BookMarked, Clock, CheckCircle, Bell } from "lucide-react";

export default function ProfilePage() {
  const { session } = useSession();
  const [holdData, setHoldData] = useState<Hold[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserHoldData() {
      if (!session?.member_id) return;
      setLoading(true);
      const holds = await getHolds(session.member_id);
      setHoldData(holds);
      setLoading(false);
    }
    fetchUserHoldData();
  }, [session?.member_id]);

  const activeHolds = holdData.filter(h => !h.fulfilled_at);
  const fulfilledHolds = holdData.filter(h => h.fulfilled_at);
  const notifiedHolds = holdData.filter(h => h.notified_at && !h.fulfilled_at);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{session?.username || 'Guest'}</h1>
                <p className="text-slate-200">Member ID: #{session?.member_id}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-900">{activeHolds.length}</div>
                <div className="text-sm text-blue-600 mt-1">Active Holds</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-amber-900">{notifiedHolds.length}</div>
                <div className="text-sm text-amber-600 mt-1">Ready for Pickup</div>
              </div>
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-900">{fulfilledHolds.length}</div>
                <div className="text-sm text-green-600 mt-1">Fulfilled</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-slate-200 px-8 py-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
              <BookMarked className="w-6 h-6" />
              <span>Your Holds</span>
            </h2>
          </div>

          <div className="p-8">
            {holdData.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <BookMarked className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No holds yet</p>
                <p className="text-sm mt-2">Start browsing books to place holds</p>
              </div>
            ) : (
              <div className="space-y-4">
                {holdData.map((hold) => (
                  <div
                    key={hold.hold_id}
                    className={`border rounded-lg p-6 transition-all ${hold.fulfilled_at
                      ? 'bg-slate-50 border-slate-200'
                      : hold.notified_at
                        ? 'bg-amber-50 border-amber-300 shadow-md'
                        : 'bg-white border-slate-300'
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-sm font-semibold text-slate-500">
                            Hold #{hold.hold_id}
                          </span>
                          <span className="text-sm text-slate-400">•</span>
                          <span className="text-sm text-slate-500">
                            Book ID: {hold.book_id}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">
                              Placed: {new Date(hold.placed_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>

                          {hold.notified_at && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Bell className="w-4 h-4 text-amber-500" />
                              <span className="text-amber-700 font-medium">
                                Ready: {new Date(hold.notified_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          )}

                          {hold.fulfilled_at && (
                            <div className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-green-600">
                                Fulfilled: {new Date(hold.fulfilled_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        {hold.fulfilled_at ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Fulfilled
                          </span>
                        ) : hold.notified_at ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Ready
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

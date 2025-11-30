'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSession, logout } from '@/data/auth';

type Session = {
	authenticated: boolean;
	username?: string;
	member_id?: number;
} | null;

const SessionContext = createContext<{
	session: Session;
	refreshSession: () => Promise<void>;
	signOut: () => Promise<void>;
} | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
	const [session, setSession] = useState<Session>(null);
	const [loading, setLoading] = useState(true);

	const refreshSession = async () => {
		try {
			const data = await getSession();
			setSession(data);
		} catch {
			setSession(null);
		} finally {
			setLoading(false);
		}
	};

	const signOut = async () => {
		await logout();
		setSession(null);
	};

	useEffect(() => {
		refreshSession();
	}, []);

	return (
		<SessionContext.Provider value={{ session, refreshSession, signOut }}>
			{children}
		</SessionContext.Provider>
	);
}

export const useSession = () => {
	const context = useContext(SessionContext);
	if (!context) throw new Error('useSession must be used within SessionProvider');
	return context;
};


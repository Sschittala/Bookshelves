"use client";

import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login } from "@/data/auth";
import { useRouter } from "next/navigation";
import { useSession } from "@/contexts/SessionProvider";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LoginForm() {
	const form = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const { isSubmitting, errors } = useFormState(form);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter()
	const { refreshSession } = useSession();

	async function onSubmit(data: LoginInput) {
		try {
			setError(null);
			const res = await login(data.username, data.password);

			if (res.member_id) {
				await refreshSession();
				router.replace('/');
			} else if (res.member_id === null || res.error) {
				setError(res.error || "Invalid username or password");
			}
		} catch (err: any) {
			setError(err.message || "Login failed");
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				{error && (
					<Alert variant="destructive" className="border-red-800 bg-red-950/50">
						<AlertDescription className="text-red-300">{error}</AlertDescription>
					</Alert>
				)}

				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-zinc-300">Username</FormLabel>
							<FormControl>
								<Input placeholder="Enter your username" className="bg-zinc-900 border-zinc-800" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-zinc-300">Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="••••••" className="bg-zinc-900 border-zinc-800" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full bg-zinc-100 text-zinc-950 hover:bg-zinc-200" disabled={isSubmitting}>
					{isSubmitting ? "Signing In..." : "Sign In"}
				</Button>
				<div className="text-center text-sm text-zinc-500">
					Don&apos;t have an account?{" "}
					<Link href="/register" className="text-zinc-300 hover:underline">
						Register
					</Link>
				</div>
			</form>
		</Form>
	);
}


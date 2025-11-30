"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
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
import { register } from "@/data/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function RegisterForm() {
	const form = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			username: "",
			password: "",
			confirmPassword: "",
		},
	});

	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	async function onSubmit(data: RegisterInput) {
		console.log("Register Data:", data);
		setError(null);
		setIsSubmitting(true);

		try {
			const res = await register(data.username, data.password, data.confirmPassword);

			if (res.success) {
				router.push('/login');
			} else {
				setError("Registration failed. Email may already exist or invalid data.");
			}
		} catch (error) {
			setError("Network error. Please try again.");
		} finally {
			setIsSubmitting(false);
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
								<Input
									placeholder="Choose a username"
									className="bg-zinc-900 border-zinc-800"
									{...field}
								/>
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
								<Input
									type="password"
									placeholder="••••••"
									className="bg-zinc-900 border-zinc-800"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-zinc-300">Confirm Password</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder="••••••"
									className="bg-zinc-900 border-zinc-800"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					className="w-full bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
					disabled={isSubmitting}
				>
					{isSubmitting ? "Creating..." : "Create Account"}
				</Button>
				<div className="text-center text-sm text-zinc-500">
					Already have an account?{" "}
					<Link href="/login" className="text-zinc-300 hover:underline">
						Login
					</Link>
				</div>
			</form>
		</Form>
	);
}


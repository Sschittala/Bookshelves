"use client";

import { useForm } from "react-hook-form";
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

export function LoginForm() {
	const form = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	function onSubmit(data: LoginInput) {
		// Validated data ready for backend API
		console.log("Login Data:", data);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
				<Button type="submit" className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200">
					Sign In
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

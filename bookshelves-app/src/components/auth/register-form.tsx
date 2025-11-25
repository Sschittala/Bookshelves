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

export function RegisterForm() {
	const form = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			username: "",
			password: "",
			confirmPassword: "",
		},
	});

	function onSubmit(data: RegisterInput) {
		// Validated data ready for backend API
		console.log("Register Data:", data);
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
								<Input placeholder="Choose a username" className="bg-zinc-900 border-zinc-800" {...field} />
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
				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-zinc-300">Confirm Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="••••••" className="bg-zinc-900 border-zinc-800" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200">
					Create Account
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

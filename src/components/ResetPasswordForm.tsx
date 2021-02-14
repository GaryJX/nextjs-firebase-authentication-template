import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useAuth } from "hooks/useAuth";
import SubmitButton from "./SubmitButton";
import { useState } from "react";
const ResetPasswordForm: React.FC = () => {
	const { register, errors, handleSubmit } = useForm();
	const [isLoading, setIsLoading] = useState(false);
	const auth = useAuth();
	const router = useRouter();
	const onSubmit = (data: { email: string }) => {
		setIsLoading(true);
		auth.sendPasswordResetEmail(data.email);
		setIsLoading(false);
		router.push("/login");
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="rounded-md">
				<label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">
					Email address
				</label>
				<div className="mt-1 rounded-md">
					<input
						id="email"
						className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 shadow-sm"
						type="email"
						name="email"
						ref={register({
							required: "Please enter an email",
							pattern: {
								value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
								message: "Not a valid email",
							},
						})}
					/>
					{errors.email && <div className="mt-2 text-xs text-red-600">{errors.email.message}</div>}
				</div>
			</div>
			<div className="mt-4">
				<span className="block w-full rounded-md shadow-sm">
					<SubmitButton type="submit" title="Send reset link" isLoading={isLoading} />
				</span>
			</div>
		</form>
	);
};
export default ResetPasswordForm;

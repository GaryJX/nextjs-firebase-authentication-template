import Spinner from "./spinner";

interface ButtonProps {
	title: string;
	isLoading?: boolean;
}
const SubmitButton = ({
	isLoading,
	title,
	children,
	...buttonProps
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element => {
	return (
		<button
			className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
			{...buttonProps}
		>
			{isLoading ? <Spinner width="20" fill="white" className="animate-spin" /> : title}
			{children}
		</button>
	);
};
export default SubmitButton;

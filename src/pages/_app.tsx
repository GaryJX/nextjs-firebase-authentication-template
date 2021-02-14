import { ChakraProvider } from "@chakra-ui/react";
import "tailwindcss/tailwind.css";
import theme from "../theme";
import { AppProps } from "next/app";
import { AuthProvider } from "hooks/useAuth";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider resetCSS theme={theme}>
			<AuthProvider>
				<Component {...pageProps} />
			</AuthProvider>
		</ChakraProvider>
	);
}

export default MyApp;

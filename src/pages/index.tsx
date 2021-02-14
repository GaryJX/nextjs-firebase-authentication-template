import { useAuth } from "hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";

const IndexPage = () => {
	const auth = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (auth.user) {
			router.push("/profile");
		} else {
			router.push("/login");
		}
	}, [auth, router]);
	return null;
};

export default IndexPage;

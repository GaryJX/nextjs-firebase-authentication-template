import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "hooks/useAuth";

export const useRequireAuth = () => {
	const auth = useAuth();
	const router = useRouter();
	useEffect(() => {
		if (!auth.user) {
			router.push("/login");
		}
	}, [auth, router]);

	return auth;
};

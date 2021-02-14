import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "config/firebase";
import firebase from "firebase";
// Provider hook that creates an auth object and handles it's state
type User = {
	uid: string;
	email: string;
	name: string;
};

export type LoginData = {
	email: string;
	password: string;
};

export type RegisterData = LoginData & {
	name: string;
};

const useAuthProvider = () => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(handleAuthStateChanged);
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		if (user?.uid) {
			// Subscribe to the user document on mount
			const unsubscribe = db
				.collection("users")
				.doc(user.uid)
				.onSnapshot((doc) => setUser(doc.data() as User));

			return () => unsubscribe();
		}
	});

	const handleAuthStateChanged = (user: firebase.User | null) => {
		setUser(user as User | null);
		if (user) {
			setUserAdditionalData(user.uid);
		}
	};

	const setUserAdditionalData = async (uid: string) => {
		const userData = await db.collection("users").doc(uid).get();
		if (userData.data()) {
			setUser(userData.data() as User);
		}
	};

	const createUser = async (user: User) => {
		const error = await db
			.collection("users")
			.doc(user.uid)
			.set(user)
			.catch((error) => ({ error }));

		if (error) {
			return error;
		} else {
			setUser(user);
			return user;
		}
	};

	const register = async ({ name, email, password }: RegisterData) => {
		try {
			const response = await auth.createUserWithEmailAndPassword(email, password);
			// TODO: If necessary, send Email Verification
			// auth.currentUser!.sendEmailVerification();
			auth.currentUser!.updateProfile({
				displayName: name,
			});
			return createUser({ uid: response.user!.uid, email, name });
		} catch (error) {
			return { error };
		}
	};

	const login = async ({ email, password }: LoginData) => {
		try {
			const response = await auth.signInWithEmailAndPassword(email, password);
			console.log({ response });
			const { uid, displayName } = response.user!;
			const user: User = { uid, email, name: displayName! };
			setUserAdditionalData(uid);
			return user;
		} catch (error) {
			return { error };
		}
	};

	const signOut = async () => {
		await auth.signOut();
		setUser(null);
	};

	const sendPasswordResetEmail = async (email: string) => {
		await auth.sendPasswordResetEmail(email);
	};

	return {
		user,
		register,
		login,
		signOut,
		sendPasswordResetEmail,
	};
};

const missingContextCallback = () => Promise.reject({ error: "AuthContextProvider not found " });
const AuthContext = createContext<ReturnType<typeof useAuthProvider>>({
	user: null,
	register: missingContextCallback,
	login: missingContextCallback,
	signOut: missingContextCallback,
	sendPasswordResetEmail: missingContextCallback,
});

export const AuthProvider: React.FC = ({ children }) => {
	const auth = useAuthProvider();
	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

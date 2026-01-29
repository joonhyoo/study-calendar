import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "src/contexts/AppContextProvider";
import supabase from "../utils/supabase";

export default function Profile() {
	const navigate = useNavigate();
	const { claims } = useContext(AppContext);

	const signOut = async () => {
		await supabase.auth.signOut();
		navigate("/");
	};

	return (
		<div>
			<h1>Profile</h1>
			<p>Email: {claims && claims.email}</p>
			<button onClick={() => navigate("/")}>Go back home</button>
			<button onClick={signOut}>Sign Out</button>
		</div>
	);
}

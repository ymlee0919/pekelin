import "./input.css"
import "./assets/styles.css"
import { AuthProvider } from "./hooks/useAuth";
import GlobalStore from "./main/GlobalStore"
import Main from "./main/Main";


const App = () => {
  return (
	<GlobalStore>
		<AuthProvider>
			<Main/>
		</AuthProvider>
	</GlobalStore>
  );
}

export default App

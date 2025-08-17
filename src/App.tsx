import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SignIn } from "./page/authentication/signin";
import { ForgotPassword } from "./page/authentication/forgotpassword";
import { Verification } from "./page/authentication/verification";
import { ResetPassword } from "./page/authentication/resetpassword";
import { Dashboard } from "./page/dashboard";
import { Order } from "./page/order";
import { Inventory } from "./page/inventory";
import { Transaction } from "./page/transaction";
import { Support } from "./page/support";
import { Setting } from "./page/setting";
import { RouteProtector } from "./config/routeProtector";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path={"/"} element={<SignIn />} />
				<Route path={"/forgot-password"} element={<ForgotPassword />} />
				<Route path={"/auth-verification/:id"} element={<Verification />} />
				<Route path={"/reset-password/:id"} element={<ResetPassword />} />
				<Route element={<RouteProtector />}>
					<Route path={"/dashboard"} element={<Dashboard />} />
					<Route path={"/order"} element={<Order />} />
					<Route path={"/inventory"} element={<Inventory />} />
					<Route path={"/transaction"} element={<Transaction />} />
					<Route path={"/support"} element={<Support />} />
					<Route path={"/setting"} element={<Setting />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;

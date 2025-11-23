import { BASE_ENDPOINT } from "../../endpoint";

type FilterKeys = "admin" | "distributor";

export const retrieveAllUserByTypeService = async (
	token: string,
	filters: { [key in FilterKeys]: boolean }
) => {
	const queryParams = new URLSearchParams(
		Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, String(v)]))
	).toString();
	try {
		const response = await fetch(
			`${BASE_ENDPOINT}/api/v1/admin-interface/user-management/all/user?${queryParams}`,
			{
				method: "GET",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);
		const res = await response.json();
		if (!response.ok) {
			console.error("Error:", res);
			throw new Error(res.message);
		}
		return res.data;
	} catch (error) {
		console.error("API fetch error:", error);
		throw error;
	}
};

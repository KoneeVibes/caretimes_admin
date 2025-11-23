import { BASE_ENDPOINT } from "../../endpoint";

export const activateUserService = async (token: string, userId: string) => {
	try {
		const response = await fetch(
			`${BASE_ENDPOINT}/api/v1/admin-interface/user-management/user/${userId}/activate-user`,
			{
				method: "PATCH",
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
		return res;
	} catch (error) {
		console.error("API fetch error:", error);
		throw error;
	}
};

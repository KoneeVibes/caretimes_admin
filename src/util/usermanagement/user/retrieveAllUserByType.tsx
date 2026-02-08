import { BASE_ENDPOINT } from "../../endpoint";

type FilterKeys = "admin" | "distributor";

export const retrieveAllUserByTypeService = async (
	token: string,
	filters: { [key in FilterKeys]: boolean },
	pagination?: {
		page: string;
		perPage: string;
	},
) => {
	const queryParams = new URLSearchParams();
	Object.entries(filters).forEach(([key, value]) => {
		queryParams.append(key, String(value));
	});
	if (pagination?.page) {
		queryParams.append("page", pagination.page);
	}
	if (pagination?.perPage) {
		queryParams.append("perPage", pagination.perPage);
	}
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
			},
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

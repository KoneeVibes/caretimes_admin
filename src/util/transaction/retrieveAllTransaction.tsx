import { BASE_ENDPOINT } from "../endpoint";

export const retrieveAllTransactionService = async (
	token: string,
	filter?: string,
	pagination?: {
		page: string;
		perPage: string;
	},
) => {
	const params = new URLSearchParams();
	if (filter) {
		params.append("filter", filter);
	}
	if (pagination?.page) {
		params.append("page", pagination.page);
	}
	if (pagination?.perPage) {
		params.append("perPage", pagination.perPage);
	}
	try {
		const response = await fetch(
			`${BASE_ENDPOINT}/api/v1/admin-interface/transaction/all?${params.toString()}`,
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

import { BASE_ENDPOINT } from "../endpoint";

export const retrieveSystemOverviewService = async (
	token: string,
	filter?: {
		period: string;
		value: string;
	},
) => {
	const params = new URLSearchParams();
	if (filter?.period) {
		params.append("period", filter.period);
	}
	if (filter?.value) {
		params.append("value", filter.value);
	}
	try {
		const response = await fetch(
			`${BASE_ENDPOINT}/api/v1/admin-interface/dashboard/overview?${params.toString()}`,
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
		return res.data;
	} catch (error) {
		console.error("API fetch error:", error);
		throw error;
	}
};

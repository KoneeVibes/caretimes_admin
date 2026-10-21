import { BASE_ENDPOINT } from "../endpoint";

export const updateOrderService = async (
	token: string,
	flag: string,
	orderId: string,
) => {
	try {
		const response = await fetch(
			`${BASE_ENDPOINT}/api/v1/admin-interface/order/${orderId}/${flag}-order`,
			{
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
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

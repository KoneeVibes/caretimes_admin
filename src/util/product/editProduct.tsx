import { BASE_ENDPOINT } from "../endpoint";

export const editProductService = async (
	token: string,
	productId: string,
	payload: any
) => {
	try {
		const response = await fetch(
			`${BASE_ENDPOINT}/api/v1/admin-interface/product/${productId}/update-product`,
			{
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: payload,
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

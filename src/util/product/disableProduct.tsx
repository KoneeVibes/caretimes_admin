import { BASE_ENDPOINT } from "../endpoint";

export const disableProductService = async (
	token: string,
	productId: string,
) => {
	try {
		const response = await fetch(
			`${BASE_ENDPOINT}/api/v1/admin-interface/product/${productId}/disable-product`,
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

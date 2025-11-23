import { BASE_ENDPOINT } from "../endpoint";

export const deleteProductService = async (
	token: string,
	productId: string
) => {
	try {
		const response = await fetch(
			`${BASE_ENDPOINT}/api/v1/admin-interface/product/single/${productId}`,
			{
				method: "DELETE",
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

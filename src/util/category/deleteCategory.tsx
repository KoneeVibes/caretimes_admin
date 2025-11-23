import { BASE_ENDPOINT } from "../endpoint";

export const deleteCategoryService = async (
	token: string,
	categoryId: string
) => {
	try {
		const response = await fetch(
			`${BASE_ENDPOINT}/api/v1/admin-interface/category/single/${categoryId}`,
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

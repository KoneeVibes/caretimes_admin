import { BASE_ENDPOINT } from "../endpoint";

export const editCategoryService = async (
	token: string,
	categoryId: string,
	payload: any
) => {
	try {
		const response = await fetch(
			`${BASE_ENDPOINT}/api/v1/admin-interface/category/${categoryId}/update-category`,
			{
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
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

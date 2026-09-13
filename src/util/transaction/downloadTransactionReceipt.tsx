import { BASE_ENDPOINT } from "../endpoint";

export const downloadTransactionReceiptService = async (
	token: string,
	transactionId: string,
): Promise<Blob> => {
	try {
		const response = await fetch(
			`${BASE_ENDPOINT}/api/v1/admin-interface/transaction/single/download/${transactionId}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/pdf",
				},
			},
		);
		if (!response.ok) {
			console.error("Failed to download transaction receipt");
			throw new Error("Failed to download transaction receipt");
		}
		const blob = await response.blob();
		return blob;
	} catch (error) {
		console.error("API fetch error:", error);
		throw error;
	}
};

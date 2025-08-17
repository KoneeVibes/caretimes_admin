import { BASE_ENDPOINT } from "../endpoint";

export const signOutUserService = async (TOKEN: any) => {
    try {
        const response = await fetch(`${BASE_ENDPOINT}/api/v1/auth/sign-out`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
        const res = await response.json();
        if (!response.ok) {
            console.error('Error:', res);
            throw new Error(res.message);
        }
        return res;
    } catch (error) {
        console.error('API fetch error:', error);
        throw error;
    }
};

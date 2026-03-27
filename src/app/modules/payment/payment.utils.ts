import config from "../../config";

export const getBkashHeaders = async () => {
  try {
    const response = await axios.post(
      config.bkash_grant_token_url,
      {
        app_key: config.bkash_app_key,
        app_secret: config.bkash_app_secret,
      },
      {
        headers: {
          username: config.bkash_username,
          password: config.bkash_password,
        },
      }
    );
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: response.data.id_token,
      'X-App-Key': config.bkash_app_key,
    };
  } catch (error: any) {
    // এখানে এরর মেসেজটি ভালো করে প্রিন্ট করুন
    console.error("bKash Error Body:", error.response?.data); 
    throw new Error(error.response?.data?.statusMessage || "bKash Auth Failed");
  }
};
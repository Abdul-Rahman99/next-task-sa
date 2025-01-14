import axios from "axios";

interface LoginResponse {
  access_token: any;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface LoginRequest {
  email: string;
  password: string;
}

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      "http://localhost:3000/auth/login",
      credentials
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.data.message);
  }
};

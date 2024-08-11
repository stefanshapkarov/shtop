import axios from 'axios';



// function getCookie() {
//   const cookie = document.cookie
//       .split("; ")
//       .find((item) => item.startsWith("XSRF-TOKEN="));
//
//   if (!cookie) {
//     return null;
//   }
//
//   return decodeURIComponent(cookie.split("=")[1]);
// }



const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  withXSRFToken: true,
  xsrfHeaderName: "X-XSRF-TOKEN",
  xsrfCookieName: "XSRF-TOKEN",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});


const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  console.log(parts.pop()?.split(';').shift() );
  return null;
};

const getCsrfToken = async () => {
  await api.get('/sanctum/csrf-cookie');
};

export const logout = async () => {
  await api.post('/api/logout');
};

export const loginUser = async (email: string, password: string, remember: boolean = false) => {
  try {
    await getCsrfToken();
    const response = await api.post('/api/login', {
      email,
      password,
      remember
    });
    // , {
    //   headers: {
    //     'X-XSRF-TOKEN': xsrfToken,
    //   },
    //   withCredentials: true,
    // });
    console.log(response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios error
      throw new Error(error.response?.data.message || 'An error occurred');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const registerUser = async (name: string, email: string, password: string, password_confirmation: string) => {
  try {
    await getCsrfToken(); // Ensure CSRF token is set
    const response = await api.post('/api/register', {
      name,
      email,
      password,
      password_confirmation
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios error
      throw new Error(error.response?.data.message || 'An error occurred');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};


export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/user',{
      withCredentials:true,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

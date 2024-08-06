// src/services/api.ts
import axios from 'axios';
// import Cookies from 'js-cookie';




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
  },
});

const getCsrfToken = async () => {
  await api.get('/sanctum/csrf-cookie');
};

export const logout = async () => {
  await api.post('/api/logout');
};

export const loginUser = async (email: string, password: string, remember: boolean) => {
  try {
    const xsrfToken = await getCsrfToken();
    

    // const xsrfToken = getCsrfToken();
  
    console.log(xsrfToken);
    const response = await api.post('/api/login', {
      email,
      password,
      remember
    });

      localStorage.setItem('accessToken', response.data.token);
      console.log('Stored token:', localStorage.getItem('accessToken'));

    return response.data;
    // , {
    //   headers: {
    //     'X-XSRF-TOKEN': xsrfToken,
    //   },
    //   withCredentials: true,
    // });
    // return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios error
      throw new Error(error.response?.data.message || 'An error occurred');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// export const loginUser = async (email: string, password: string, remember: boolean) => {
//   try {
//     await getCsrfToken(); // Ensure CSRF token is set

//     const response = await api.post('/api/login', {
//       email,
//       password,
//       remember
//     });

//     console.log('Login response:', response);

//     if (response.data.token) {
//       localStorage.setItem('accessToken', response.data.token);
//       console.log('Stored token:', localStorage.getItem('accessToken'));
//     } else {
//       throw new Error('Token is undefined in the response');
//     }

//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error('Axios error:', error.response?.data);
//       throw new Error(error.response?.data.message || 'An error occurred');
//     } else {
//       console.error('Unexpected error:', error);
//       throw new Error('An unexpected error occurred');
//     }
//   }
// };

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



// const getCsrfTokenLocal = () => {
//   const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
//   if (match) {
//     return match[2];
//   }
//   return null;
// };


// export const getCsrfTokenLocal = async () => {
//   const response = await api.get('/sanctum/csrf-cookie');
//   return response.config.headers['X-XSRF-TOKEN'];
// };


// export const getUserData = async () => {
//   try {
//     const token = localStorage.getItem('accessToken');
//     if (!token) {
//       throw new Error('Access token not found');
//     }

//     const xsrfToken = getCsrfTokenLocal();
//     const response = await api.get('/api/user', {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
//         'X-XSRF-TOKEN': xsrfToken,
//       },
//       withCredentials: true
//     });

//     console.log('User data response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Failed to fetch user data:', error);
//     throw error;
//   }
// };



export const getUserData = async () => {
  const xsrfToken =await getCsrfToken();
  const response = await api.get('/api/user', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      // 'X-XSRF-TOKEN': xsrfToken,
    },
    withCredentials: true
  });
  return response.data;
};

// export const updateProfile = async (profileData) => {
//   const response = await axios.put('/profile', profileData, {
//     headers: {
//       'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//     }
//   });
//   return response.data;
// };


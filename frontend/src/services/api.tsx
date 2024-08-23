import axios from 'axios';
// import Cookies from 'js-cookie';




// function getCookie() {
//   const cookie = document.cookie
//       .split("; ")
//       .find((item) => item.startsWith("XSRF-TOKEN="));

//   if (!cookie) {
//     return null;
//   }

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

      localStorage.setItem('accessToken', response.data.token);
      console.log('Stored token:', localStorage.getItem('accessToken'));

    return response.data;
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
      throw new Error(error.response?.data.message || 'An error occurred');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};


export const registerUser = async (name: string, email: string, password: string, password_confirmation: string) => {
  try {
    await getCsrfToken();
    const response = await api.post('/api/register', {
      name,
      email,
      password,
      password_confirmation
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'An error occurred');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// export const updateProfile = async (profileData) => {
//   const response = await axios.put('/profile', profileData, {
//     headers: {
//       'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//     }
//   });
//   return response.data;
// };

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/user',{
      withCredentials:true,
    });
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};


export const getUserReviews = async (userId: number) => {
  try {
    const response = await api.get(`/api/users/${userId}/reviews`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};


// export const updateUser = async (userData: any) => {
//   try {
//     const response = await api.put('/api/profile', userData);
//     console.log(response);
//     return response.data;
//   } catch (error) {
//     console.log(error);
//   }
// }

export const updateUser = async (userData: FormData) => {
  try {

    userData.append('_method', 'PUT');
    const response = await api.post('/api/profile', userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
            },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};



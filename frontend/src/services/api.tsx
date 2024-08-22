import axios from 'axios';



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

const formatDateForBackend = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export const postRide = async (rideData: {
  departure_time: Date;
  total_seats: number;
  price_per_seat: number;
  departure_city: string;
  vehicle: string;
  destination_city: string;
}) => {
  try {
    await getCsrfToken();
    
    const formattedRideData = {
      ...rideData,
      departure_time: formatDateForBackend(rideData.departure_time),
  };

  const response = await api.post('/api/ridePost', formattedRideData);
  return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error posting ride:', error.response?.data.message || 'An error occurred');
      throw new Error(error.response?.data.message || 'An error occurred');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

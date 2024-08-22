// src/services/api.ts
import axios from 'axios';
import {Ride} from "../models/ride/Ride";
import {RideRequest} from "../models/ride-request/RideRequest";



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
  baseURL: 'http://localhost:8000/',
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
    await getCsrfToken();

    // const xsrfToken = getCookie();
    //
    // console.log(xsrfToken);


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

export const fetchAllRides = async (
    departure_city: string | null,
    destination_city: string | null,
    available_seats: number | null,
    departure_date: string | null
) => {
  const params: { [key: string]: string | number } = {};

  if (departure_city) params.departure_city = departure_city;
  if (destination_city) params.destination_city = destination_city;
  if (available_seats !== null) params.available_seats = available_seats;
  if (departure_date) params.departure_date = departure_date;

  const response = await api.get('/api/ridePost', { params });

  return response.data.data;
};

export const fetchRideById = async (id: string): Promise<Ride> => {
  const response = await api.get(`/api/ridePost/${id}`);
  return response.data.data;
}

export const getRideRequests = async (rideId: string): Promise<any> => {
  const response = await api.get(`/api/ridePost/${rideId}/requests`);
  return response.data.data;
}

export const makeRideRequest = async (rideId: number) => {
  const response = await api.get(`/api/ridePost/${rideId}/requests/new`);
  return response.data;
}

export const acceptRideRequest = async (requestId: number) => {
  const response = await api.get(`api/ridePost/requests/${requestId}/accept`);
  return response.data;
}

export const rejectRideRequest = async (requestId: number) => {
  const response = await api.get(`api/ridePost/requests/${requestId}/reject`);
  return response.data;
}

export const cancelRideRequest = async (requestId: number) => {
  const response = await api.get(`api/ridePost/requests/${requestId}/cancel`);
  return response.data;
}

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/user',{
      withCredentials:true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

import axios from 'axios';
import {Ride} from "../models/ride/Ride";
import {RideRequest} from "../models/ride-request/RideRequest";

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
    await getCsrfToken();
    const response = await api.post('/api/login', {
      email,
      password,
      remember
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

export const completeRide = async (rideId: string) => {
  try {
    const response = await api.get(`/api/ridePost/${rideId}/complete`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error completing ride:', error.response?.data.message || 'An error occurred');
      throw new Error(error.response?.data.message || 'An error occurred');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

export const submitRideReview = async (
  rideId: number, 
  revieweeId: number, 
  rating: number, 
  comment: string
) => {
    try {
        const response = await api.post('/api/reviews', {
            ride_id: rideId,
            reviewee_id: revieweeId,
            rating,
            comment,
        });
        return response.data; // Return response data if necessary
    } catch (error) {
        throw error; // Let the calling function handle the error
    }
};


export const getUserById = async (id: string) => {
  try {
    const response = await api.get(`/api/user/${id}`);
    return response.data.data; // Assuming the response has a 'data' key for user info
  } catch (error: any) {
    throw error.response ? error.response.data.message : error.message;
  }
};
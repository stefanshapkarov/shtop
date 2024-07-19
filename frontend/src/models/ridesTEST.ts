import { UserType } from "./user-type/UserType";
import { Ride } from "./ride/Ride";

function getRandomDate(maxHoursLater: number): Date {
    const randomMilliseconds = Math.random() * maxHoursLater * 60 * 60 * 1000; // Random milliseconds within maxHoursLater
    return new Date(Date.now() + randomMilliseconds);
}

const driverTest: UserType = {
    id: 1,
    createdAt: new Date(Date.now()),
    name: 'Biljana',
    bio: null,
    location: null,
    profilePicture: null,
    admin: 0,
    email: 'bileto4@gmail.com',
    updatedAt: new Date(Date.now()),
    isVerified: false,
    rating: 5.0
};

const driverTest2: UserType = {
    id: 2,
    createdAt: new Date(Date.now()),
    name: 'Lile',
    bio: null,
    location: null,
    profilePicture: null,
    admin: 0,
    email: 'lile@gmail.com',
    updatedAt: new Date(Date.now()),
    isVerified: true,
    rating: 4.0
};

export const ridesTEST: Ride[] = [
    {
        availableSeats: 2,
        departureCity: 'Bitola',
        departureTime: new Date('2024-07-18T11:15:00Z'), // Static departure time
        destinationCity: 'Skopje',
        id: 1,
        totalSeats: 4,
        pricePerSeat: 500,
        createdAt: new Date(Date.now()),
        driver: driverTest2,
        estimatedTimeOfArrival: new Date('2024-07-18T12:30:00Z') // Static arrival time within 4 hours after departure
    },
    {
        availableSeats: 2,
        departureCity: 'Bitola',
        departureTime: new Date('2024-07-18T10:00:00Z'), // Static departure time
        destinationCity: 'Skopje',
        id: 2,
        totalSeats: 4,
        pricePerSeat: 500,
        createdAt: new Date(Date.now()),
        driver: driverTest,
        estimatedTimeOfArrival: new Date('2024-07-18T13:45:00Z') // Static arrival time within 4 hours after departure
    },
    {
        availableSeats: 2,
        departureCity: 'Bitola',
        departureTime: new Date('2024-07-18T12:30:00Z'), // Static departure time
        destinationCity: 'Skopje',
        id: 3,
        totalSeats: 4,
        pricePerSeat: 200,
        createdAt: new Date(Date.now()),
        driver: driverTest,
        estimatedTimeOfArrival: new Date('2024-07-18T15:00:00Z') // Static arrival time within 4 hours after departure
    },
    // Add more ride objects as needed...
];

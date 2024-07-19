import {UserType} from "../user-type/UserType";

export interface Ride {
    id: number
    driver: UserType
    departureTime: Date
    estimatedTimeOfArrival: Date
    totalSeats: number
    availableSeats: number
    pricePerSeat: number
    departureCity: string
    destinationCity: string
    createdAt: Date
}
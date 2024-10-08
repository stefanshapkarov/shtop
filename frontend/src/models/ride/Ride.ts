import {UserType} from "../user-type/UserType";

export interface Ride {
    id: number
    driver: UserType
    departure_time: Date
    total_seats: number
    available_seats: number
    price_per_seat: number
    departure_city: string
    destination_city: string
    created_at: Date
    existing_request_id: number | null
    status: 'pending' | 'completed';
}
import {UserType} from "../user-type/UserType";
import {RideStatus} from "../ride-status/RideStatus";

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
    status: RideStatus
}
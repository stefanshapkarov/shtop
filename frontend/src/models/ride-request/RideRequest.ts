import {UserType} from "../user-type/UserType";
import {Ride} from "../ride/Ride";

export interface RideRequest {
    created_at: Date,
    id: number,
    passenger: UserType,
    ridePost: Ride,
    status: string,
    updated_at: Date | null
}
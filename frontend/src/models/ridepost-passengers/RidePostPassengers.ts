import {UserType} from "../user-type/UserType";
import {Ride} from "../ride/Ride";

export interface RidePostPassengers {
        id: bigint;            
        passenger_id: bigint;  
        ride_post_id: bigint;  
        created_at: Date;      
        updated_at: Date;            
}
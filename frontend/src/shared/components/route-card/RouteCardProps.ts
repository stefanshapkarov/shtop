import {Ride} from "../../../models/ride/Ride";

export interface RouteCardProps {
    ride: Ride,
    moreStyles: boolean,
    updateRides?: (rideId: number, canRequest: boolean) => void
}
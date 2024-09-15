import {Dayjs} from "dayjs";

export interface RoutesSearchBarProps {
    locationFrom?: string | null,
    locationTo?: string | null,
    date?: Dayjs | null,
    numPassengers?: number | null,
    handleSearch: (locationFrom: string | null,
                   locationTo: string | null,
                   date: Dayjs | null,
                   numPassangers: number | null,
                   update: boolean) => void
}
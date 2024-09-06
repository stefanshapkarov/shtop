export interface RoutesSearchBarProps {
    locationFrom?: string | null,
    locationTo?: string | null,
    date?: string | null,
    numPassengers?: number | null,
    handleSearch: (locationFrom: string | null,
                   locationTo: string | null,
                   date: string | null,
                   numPassangers: number | null) => void
}
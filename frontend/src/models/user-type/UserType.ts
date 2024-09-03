export interface UserType {
    id: number
    admin: number
    name: string
    email: string
    profile_picture: string | null;
    bio: string | null;
    location: string | null;
    created_at: Date
    updated_at: Date
    is_verified: boolean
    rating: number
}
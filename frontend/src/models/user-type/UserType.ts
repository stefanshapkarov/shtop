export interface UserType {
    id: number
    admin: number
    name: string
    email: string
    profilePicture: string | null;
    bio: string | null;
    location: string | null;
    createdAt: Date
    updatedAt: Date
    isVerified: boolean
    rating: number
}
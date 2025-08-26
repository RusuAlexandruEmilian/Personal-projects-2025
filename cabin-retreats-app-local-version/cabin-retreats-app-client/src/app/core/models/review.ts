export interface Review {
    id: number,
    user_id: number,
    cabin_id: number,
    created_at: Date,
    review: string,
    rating: number
}

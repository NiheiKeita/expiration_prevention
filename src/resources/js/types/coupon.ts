export type CouponStatus = 'used' | 'unused'
export type CouponBadge = 'danger' | 'warning' | 'expired' | null

export type Coupon = {
    id: number
    title: string
    expires_at: string
    expires_human: string
    memo: string | null
    image_url: string | null
    used_at: string | null
    status: CouponStatus
    days_remaining: number
    is_expired: boolean
    badge: CouponBadge
}

export type CouponFilters = {
    search?: string | null
    status?: CouponStatus | null
    sort?: string
    page?: number
}

export type PaginatedCoupons = {
    data: Coupon[]
    meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
}

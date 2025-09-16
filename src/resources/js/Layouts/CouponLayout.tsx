import React from 'react'
import { Link, router, usePage } from '@inertiajs/react'
import Button from '@/Components/Button'
import FlashMessage from '@/Components/FlashMessage'
import type { PageProps } from '@/types'

type Props = {
    title?: string
    children: React.ReactNode
}

const CouponLayout: React.FC<Props> = ({ title, children }) => {
    const { props } = usePage<PageProps>()
    const user = props.auth?.user
    const success = props.flash?.success
    const error = props.flash?.error

    const handleLogout = () => {
        router.post(route('user.logout'))
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white shadow">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    <div>
                        <Link href={route('coupons.index')} className="text-lg font-bold text-slate-800">
                            Coupon Keeper
                        </Link>
                        {title && <p className="text-sm text-slate-500">{title}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                        {user && (
                            <Link
                                href={route('coupons.create')}
                                className="hidden rounded-md bg-theme px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 sm:block"
                            >
                                新規登録
                            </Link>
                        )}
                        {user ? (
                            <div className="flex items-center gap-2">
                                <span className="hidden text-sm font-medium text-slate-600 sm:block">{user.name}</span>
                                <Button type="button" onClick={handleLogout} variant="default" className="rounded-md border px-4 py-2 text-xs font-semibold normal-case">
                                    ログアウト
                                </Button>
                            </div>
                        ) : (
                            <Link href={route('user.login')} className="rounded-md border border-theme px-4 py-2 text-sm font-semibold text-theme transition hover:bg-theme hover:text-white">
                                ログイン
                            </Link>
                        )}
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-6xl px-4 py-8 space-y-4">
                {success && <FlashMessage>{success}</FlashMessage>}
                {error && (
                    <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-600" role="alert">
                        {error}
                    </div>
                )}
                {children}
            </main>
        </div>
    )
}

export default CouponLayout

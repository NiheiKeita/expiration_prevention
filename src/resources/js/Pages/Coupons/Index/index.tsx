import React, { useMemo, useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import CouponLayout from '@/Layouts/CouponLayout'
import { Coupon, CouponFilters, PaginatedCoupons } from '@/types/coupon'
import TextInput from '@/Components/TextInput'
import Button from '@/Components/Button'
import type { PageProps } from '@/types'

type Props = {
    coupons: PaginatedCoupons
    filters: CouponFilters
}

const badgeClassName = (badge: Coupon['badge']) => {
    switch (badge) {
        case 'danger':
            return 'bg-red-100 text-red-600'
        case 'warning':
            return 'bg-yellow-100 text-yellow-600'
        case 'expired':
            return 'bg-gray-200 text-gray-600'
        default:
            return 'hidden'
    }
}

const statusLabel = (coupon: Coupon) => (
    coupon.status === 'used' ? '使用済み' : '未使用'
)

const Index: React.FC<Props> = ({ coupons, filters }) => {
    const { props } = usePage<PageProps>()
    const isAuthenticated = Boolean(props.auth?.user)
    const [search, setSearch] = useState(filters.search ?? '')
    const [status, setStatus] = useState(filters.status ?? '')
    const [sort, setSort] = useState(filters.sort ?? 'created_at_desc')

    const handleFilter = (override?: Record<string, unknown>) => {
        router.get(route('coupons.index'), {
            search,
            status,
            sort,
            ...override,
        }, {
            preserveState: true,
            preserveScroll: true,
        })
    }

    const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault()
        handleFilter()
    }

    const toggleStatus = (coupon: Coupon) => {
        router.patch(route('coupons.toggle', coupon.id), {}, {
            preserveScroll: true,
        })
    }

    const deleteCoupon = (coupon: Coupon) => {
        if (!confirm(`${coupon.title} を削除しますか？`)) {
            return
        }
        router.delete(route('coupons.destroy', coupon.id), {
            preserveScroll: true,
            onSuccess: () => handleFilter(),
        })
    }

    const pagination = useMemo(() => {
        const pages = []
        for (let page = 1; page <= coupons.meta.last_page; page++) {
            pages.push(page)
        }
        return pages
    }, [coupons.meta.last_page])

    return (
        <CouponLayout title="クーポン一覧">
            <Head title="クーポン一覧" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-slate-800">クーポン一覧</h1>
                    {isAuthenticated && (
                        <Link href={route('coupons.create')} className="rounded-md bg-theme px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 sm:hidden">
                            新規登録
                        </Link>
                    )}
                </div>
                <form onSubmit={onSubmit} className="grid gap-4 rounded-lg bg-white p-4 shadow-sm sm:grid-cols-5">
                    <div className="sm:col-span-2">
                        <label htmlFor="search" className="block text-sm font-semibold text-slate-600">商品名で検索</label>
                        <TextInput
                            id="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="mt-1 w-full"
                            placeholder="例: コーヒー無料券"
                        />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-semibold text-slate-600">ステータス</label>
                        <select
                            id="status"
                            value={status ?? ''}
                            onChange={(event) => {
                                const value = event.target.value as Coupon['status'] | ''
                                setStatus(value)
                                handleFilter({ status: value })
                            }}
                            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-theme focus:ring-theme"
                        >
                            <option value="">すべて</option>
                            <option value="unused">未使用</option>
                            <option value="used">使用済み</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="sort" className="block text-sm font-semibold text-slate-600">並び替え</label>
                        <select
                            id="sort"
                            value={sort}
                            onChange={(event) => {
                                const value = event.target.value
                                setSort(value)
                                handleFilter({ sort: value })
                            }}
                            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-theme focus:ring-theme"
                        >
                            <option value="created_at_desc">作成日（新しい順）</option>
                            <option value="created_at_asc">作成日（古い順）</option>
                            <option value="expires_at_asc">期限（近い順）</option>
                            <option value="expires_at_desc">期限（遠い順）</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <Button type="submit" variant="blue" className="h-fit w-full rounded-md px-4 py-2 text-sm font-semibold normal-case">
                            検索
                        </Button>
                    </div>
                </form>

                {coupons.data.length === 0 ? (
                    <div className="rounded-lg bg-white p-12 text-center text-slate-500 shadow-sm">
                        条件に一致するクーポンがありません。
                        <div className="mt-4">
                            <Link href={route('coupons.create')} className="text-theme underline">
                                新しいクーポンを登録する
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {coupons.data.map((coupon) => (
                            <div key={coupon.id} className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm">
                                <div className="relative h-48 w-full bg-slate-100">
                                    {coupon.image_url ? (
                                        <img src={coupon.image_url} alt={coupon.title} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                            画像なし
                                        </div>
                                    )}
                                    {coupon.badge && (
                                        <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${badgeClassName(coupon.badge)}`}>
                                            {coupon.badge === 'expired' ? '期限切れ' : coupon.badge === 'danger' ? '期限まで残り3日' : '期限まで残り7日'}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col gap-4 p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-800">{coupon.title}</h3>
                                            <p className="text-sm text-slate-500">有効期限: {coupon.expires_human}</p>
                                        </div>
                                        <button
                                            onClick={() => toggleStatus(coupon)}
                                            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${coupon.status === 'used' ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-600'}`}
                                        >
                                            {statusLabel(coupon)}
                                        </button>
                                    </div>
                                    {coupon.memo && (
                                        <p className="max-h-24 overflow-hidden text-sm text-slate-600">{coupon.memo}</p>
                                    )}
                                    <div className="mt-auto flex items-center justify-end gap-2">
                                        <Link href={route('coupons.show', coupon.id)} className="rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">
                                            詳細
                                        </Link>
                                        <Link href={route('coupons.edit', coupon.id)} className="rounded-md border border-theme px-3 py-2 text-xs font-semibold text-theme hover:bg-theme hover:text-white">
                                            編集
                                        </Link>
                                        <button
                                            onClick={() => deleteCoupon(coupon)}
                                            className="rounded-md border border-red-400 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50"
                                        >
                                            削除
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {coupons.meta.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            type="button"
                            disabled={coupons.meta.current_page <= 1}
                            onClick={() => handleFilter({ page: coupons.meta.current_page - 1 })}
                            className="rounded-md border px-4 py-2 text-xs font-semibold normal-case"
                        >
                            前へ
                        </Button>
                        <div className="flex items-center gap-1 text-sm">
                            {pagination.map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handleFilter({ page })}
                                    className={`rounded px-2 py-1 text-xs ${page === coupons.meta.current_page ? 'bg-theme text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <Button
                            type="button"
                            disabled={coupons.meta.current_page >= coupons.meta.last_page}
                            onClick={() => handleFilter({ page: coupons.meta.current_page + 1 })}
                            className="rounded-md border px-4 py-2 text-xs font-semibold normal-case"
                        >
                            次へ
                        </Button>
                    </div>
                )}
            </div>
        </CouponLayout>
    )
}

export default Index

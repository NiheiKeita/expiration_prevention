import React from 'react'
import { Head, Link, router } from '@inertiajs/react'
import CouponLayout from '@/Layouts/CouponLayout'
import { Coupon } from '@/types/coupon'
import Button from '@/Components/Button'

type Props = {
    coupon: Coupon
}

const Show: React.FC<Props> = ({ coupon }) => {
    const toggleStatus = () => {
        router.patch(route('coupons.toggle', coupon.id), {}, { preserveScroll: true })
    }

    const deleteCoupon = () => {
        if (!confirm('このクーポンを削除しますか？')) {
            return
        }
        router.delete(route('coupons.destroy', coupon.id))
    }

    return (
        <CouponLayout title="クーポン詳細">
            <Head title={`${coupon.title} の詳細`} />
            <div className="grid gap-8 rounded-lg bg-white p-6 shadow-sm lg:grid-cols-2">
                <div className="flex flex-col gap-4">
                    <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-md bg-slate-100">
                        {coupon.image_url ? (
                            <img src={coupon.image_url} alt={coupon.title} className="h-full w-full object-contain" />
                        ) : (
                            <span className="text-sm text-slate-400">画像は登録されていません</span>
                        )}
                        {coupon.badge && (
                            <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${coupon.badge === 'expired' ? 'bg-gray-200 text-gray-600' : coupon.badge === 'danger' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                {coupon.badge === 'expired' ? '期限切れ' : coupon.badge === 'danger' ? '期限まで残り3日' : '期限まで残り7日'}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <Button type="button" variant="blue" onClick={toggleStatus} className="rounded-md px-4 py-2 text-sm font-semibold normal-case">
                            {coupon.status === 'used' ? '未使用に戻す' : '使用済みにする'}
                        </Button>
                        <Link href={route('coupons.edit', coupon.id)} className="rounded-md border border-theme px-4 py-2 text-sm font-semibold text-theme hover:bg-theme hover:text-white">
                            編集
                        </Link>
                        <Button type="button" variant="red" onClick={deleteCoupon} className="rounded-md px-4 py-2 text-sm font-semibold normal-case">
                            削除
                        </Button>
                    </div>
                </div>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">{coupon.title}</h1>
                        <p className="mt-1 text-sm text-slate-500">{coupon.is_expired ? '期限切れのクーポンです' : `期限まであと ${coupon.days_remaining} 日です`}</p>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                        <div className="grid grid-cols-3 gap-2">
                            <span className="font-semibold text-slate-700">有効期限</span>
                            <span className="col-span-2">{coupon.expires_human}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <span className="font-semibold text-slate-700">ステータス</span>
                            <span className="col-span-2">{coupon.status === 'used' ? '使用済み' : '未使用'}</span>
                        </div>
                        {coupon.used_at && (
                            <div className="grid grid-cols-3 gap-2">
                                <span className="font-semibold text-slate-700">使用日</span>
                                <span className="col-span-2">{coupon.used_at}</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">メモ</h2>
                        <div className="mt-2 rounded-md border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                            {coupon.memo ? coupon.memo : 'メモは登録されていません。'}
                        </div>
                    </div>
                    <div>
                        <Link href={route('coupons.index')} className="text-sm font-semibold text-theme">
                            &larr; 一覧に戻る
                        </Link>
                    </div>
                </div>
            </div>
        </CouponLayout>
    )
}

export default Show

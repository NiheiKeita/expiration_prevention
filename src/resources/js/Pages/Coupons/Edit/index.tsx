import React from 'react'
import { Head, useForm } from '@inertiajs/react'
import CouponLayout from '@/Layouts/CouponLayout'
import CouponForm, { CouponFormData } from '../components/CouponForm'
import { Coupon } from '@/types/coupon'

type Props = {
    coupon: Coupon
}

const Edit: React.FC<Props> = ({ coupon }) => {
    const form = useForm<CouponFormData>({
        title: coupon.title,
        expires_at: coupon.expires_at,
        memo: coupon.memo ?? '',
        image: null,
        remove_image: false,
    })

    const submit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault()
        form.transform((data) => ({
            ...data,
            _method: 'put',
        }))
        form.post(route('coupons.update', coupon.id), {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => {
                form.transform((data) => data)
                form.setData('image', null)
            },
        })
    }

    return (
        <CouponLayout title="クーポン編集">
            <Head title={`${coupon.title} を編集`} />
            <div className="rounded-lg bg-white p-6 shadow-sm">
                <h1 className="text-xl font-semibold text-slate-800">クーポン情報を編集</h1>
                <p className="mt-1 text-sm text-slate-500">内容を更新し「保存する」を押してください。</p>
                <div className="mt-6">
                    <CouponForm
                        form={form}
                        submitText="更新する"
                        onSubmit={submit}
                        mode="edit"
                        existingImageUrl={coupon.image_url}
                    />
                </div>
            </div>
        </CouponLayout>
    )
}

export default Edit

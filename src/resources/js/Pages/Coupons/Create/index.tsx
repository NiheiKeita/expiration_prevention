import React from 'react'
import { Head, useForm } from '@inertiajs/react'
import CouponLayout from '@/Layouts/CouponLayout'
import CouponForm, { CouponFormData } from '../components/CouponForm'

const Create: React.FC = () => {
    const form = useForm<CouponFormData>({
        title: '',
        expires_at: '',
        memo: '',
        image: null,
        remove_image: false,
    })

    const submit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault()
        form.post(route('coupons.store'), {
            forceFormData: true,
        })
    }

    return (
        <CouponLayout title="新規登録">
            <Head title="クーポン登録" />
            <div className="rounded-lg bg-white p-6 shadow-sm">
                <h1 className="text-xl font-semibold text-slate-800">新しいクーポンを登録</h1>
                <p className="mt-1 text-sm text-slate-500">必要な情報を入力して保存してください。</p>
                <div className="mt-6">
                    <CouponForm
                        form={form}
                        submitText="保存する"
                        onSubmit={submit}
                        mode="create"
                    />
                </div>
            </div>
        </CouponLayout>
    )
}

export default Create

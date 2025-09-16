import React, { useEffect, useMemo, useState } from 'react'
import InputLabel from '@/Components/InputLabel'
import TextInput from '@/Components/TextInput'
import TextArea from '@/Components/TextArea'
import InputError from '@/Components/InputError'
import Button from '@/Components/Button'
import { Link } from '@inertiajs/react'

export type CouponFormData = {
    title: string
    expires_at: string
    memo: string
    image: File | null
    remove_image: boolean
}

type CouponFormInstance = {
    data: CouponFormData
    setData: (...args: any[]) => void
    errors: Record<string, string | undefined>
    processing: boolean
    progress: { percentage?: number } | null
    reset: (...fields: (keyof CouponFormData)[]) => void
    clearErrors: (...fields: (keyof CouponFormData)[]) => void
    setError: (...args: any[]) => void
    post: (url: string, options?: Record<string, unknown>) => void
    transform: (callback: (data: CouponFormData) => CouponFormData) => void
}

type Props = {
    form: CouponFormInstance
    onSubmit: React.FormEventHandler<HTMLFormElement>
    submitText: string
    mode: 'create' | 'edit'
    existingImageUrl?: string | null
}

const CouponForm: React.FC<Props> = ({ form, onSubmit, submitText, mode, existingImageUrl }) => {
    const [preview, setPreview] = useState<string | null>(existingImageUrl ?? null)

    useEffect(() => {
        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview)
            }
        }
    }, [preview])

    const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const file = event.target.files?.[0] ?? null
        form.setData('image', file)

        if (file) {
            const url = URL.createObjectURL(file)
            setPreview(url)
            form.setData('remove_image', false)
        }
    }

    const removeImage = () => {
        setPreview(null)
        form.setData('image', null)
        if (mode === 'edit') {
            form.setData('remove_image', true)
        }
    }

    const progress = useMemo(() => form.progress?.percentage ?? null, [form.progress])

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <InputLabel htmlFor="title" value="商品名" />
                <TextInput
                    id="title"
                    value={form.data.title}
                    onChange={(event) => form.setData('title', event.target.value)}
                    className="mt-1 block w-full"
                    required
                />
                <InputError message={form.errors.title} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="expires_at" value="有効期限" />
                <TextInput
                    id="expires_at"
                    type="date"
                    value={form.data.expires_at}
                    onChange={(event) => form.setData('expires_at', event.target.value)}
                    className="mt-1 block w-full"
                    required
                />
                <InputError message={form.errors.expires_at} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="memo" value="メモ" />
                <TextArea
                    id="memo"
                    value={form.data.memo}
                    rows={4}
                    onChange={(event) => form.setData('memo', event.target.value)}
                    className="mt-1 block w-full"
                    placeholder="注意事項や利用条件を記載できます"
                />
                <InputError message={form.errors.memo} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="image" value="クーポン画像" />
                <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 block w-full text-sm text-slate-600"
                />
                <InputError message={form.errors.image} className="mt-2" />
                {preview ? (
                    <div className="mt-4 space-y-2">
                        <img src={preview} alt="クーポン画像" className="max-h-64 rounded-md border object-contain" />
                        <Button type="button" onClick={removeImage} variant="red" className="rounded-md px-4 py-2 text-xs font-semibold normal-case">
                            画像を削除
                        </Button>
                    </div>
                ) : (
                    <p className="mt-2 text-xs text-slate-500">スマホのカメラから撮影または画像をアップロードできます。</p>
                )}
            </div>

            {progress && (
                <div className="w-full rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-theme" style={{ width: `${progress}%` }} />
                </div>
            )}

            <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
                <Link href={route('coupons.index')} className="text-sm font-semibold text-slate-500 hover:text-theme">
                    一覧へ戻る
                </Link>
                <Button type="submit" variant="blue" disabled={form.processing} className="rounded-md px-6 py-3 text-sm font-semibold normal-case">
                    {form.processing ? '送信中…' : submitText}
                </Button>
            </div>
        </form>
    )
}

export default CouponForm

import React from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import AuthLayout from '@/Layouts/AuthLayout'
import TextInput from '@/Components/TextInput'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError'
import Button from '@/Components/Button'

type Props = {
    token: string
    email?: string | null
}

const ResetPassword: React.FC<Props> = ({ token, email }) => {
    const form = useForm({
        token,
        email: email ?? '',
        password: '',
        password_confirmation: '',
    })

    const submit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault()
        form.post(route('password.store'), {
            onFinish: () => form.reset('password', 'password_confirmation'),
        })
    }

    return (
        <AuthLayout title="新しいパスワードを設定" description="新しいパスワードを設定し直してください。">
            <Head title="パスワード再設定" />
            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="メールアドレス" />
                    <TextInput
                        id="email"
                        type="email"
                        value={form.data.email}
                        onChange={(event) => form.setData('email', event.target.value)}
                        className="mt-1 w-full"
                        required
                        autoComplete="email"
                    />
                    <InputError message={form.errors.email} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="password" value="新しいパスワード" />
                    <TextInput
                        id="password"
                        type="password"
                        value={form.data.password}
                        onChange={(event) => form.setData('password', event.target.value)}
                        className="mt-1 w-full"
                        required
                        autoComplete="new-password"
                    />
                    <InputError message={form.errors.password} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="password_confirmation" value="パスワード（確認用）" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        value={form.data.password_confirmation}
                        onChange={(event) => form.setData('password_confirmation', event.target.value)}
                        className="mt-1 w-full"
                        required
                        autoComplete="new-password"
                    />
                </div>
                <div className="space-y-4">
                    <Button type="submit" variant="blue" disabled={form.processing} className="w-full rounded-md px-4 py-3 text-sm font-semibold normal-case">
                        {form.processing ? '変更中…' : 'パスワードを変更'}
                    </Button>
                    <p className="text-center text-sm text-slate-600">
                        <Link href={route('user.login')} className="text-theme font-semibold hover:underline">
                            ログイン画面に戻る
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    )
}

export default ResetPassword

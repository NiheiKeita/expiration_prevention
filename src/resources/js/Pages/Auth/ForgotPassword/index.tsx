import React from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import AuthLayout from '@/Layouts/AuthLayout'
import TextInput from '@/Components/TextInput'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError'
import Button from '@/Components/Button'

const ForgotPassword: React.FC = () => {
    const form = useForm({
        email: '',
    })

    const submit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault()
        form.post(route('password.email'))
    }

    return (
        <AuthLayout title="パスワード再設定" description="登録済みのメールアドレス宛に再設定用のURLをお送りします。">
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
                        autoFocus
                        autoComplete="email"
                    />
                    <InputError message={form.errors.email} className="mt-2" />
                </div>
                <div className="space-y-4">
                    <Button type="submit" variant="blue" disabled={form.processing} className="w-full rounded-md px-4 py-3 text-sm font-semibold normal-case">
                        {form.processing ? '送信中…' : '再設定URLを送信'}
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

export default ForgotPassword

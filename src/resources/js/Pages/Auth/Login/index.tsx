import React from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import AuthLayout from '@/Layouts/AuthLayout'
import TextInput from '@/Components/TextInput'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError'
import Button from '@/Components/Button'

const Login: React.FC = () => {
    const form = useForm({
        email: '',
        password: '',
        remember: false,
    })

    const submit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault()
        form.post(route('user.login'), {
            onFinish: () => form.reset('password'),
        })
    }

    return (
        <AuthLayout title="ログイン" description="登録済みのメールアドレスとパスワードを入力してください。">
            <Head title="ログイン" />
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
                <div>
                    <InputLabel htmlFor="password" value="パスワード" />
                    <TextInput
                        id="password"
                        type="password"
                        value={form.data.password}
                        onChange={(event) => form.setData('password', event.target.value)}
                        className="mt-1 w-full"
                        required
                        autoComplete="current-password"
                    />
                    <InputError message={form.errors.password} className="mt-2" />
                </div>
                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-slate-600">
                        <input
                            type="checkbox"
                            checked={form.data.remember}
                            onChange={(event) => form.setData('remember', event.target.checked)}
                            className="rounded border-slate-300 text-theme focus:ring-theme"
                        />
                        次回から自動的にログイン
                    </label>
                    <Link href={route('password.request')} className="text-theme hover:underline">
                        パスワードをお忘れですか？
                    </Link>
                </div>
                <div className="space-y-4">
                    <Button type="submit" variant="blue" disabled={form.processing} className="w-full rounded-md px-4 py-3 text-sm font-semibold normal-case">
                        {form.processing ? '送信中…' : 'ログイン'}
                    </Button>
                    <p className="text-center text-sm text-slate-600">
                        アカウントをお持ちでない方は{' '}
                        <Link href={route('user.register')} className="text-theme font-semibold hover:underline">
                            会員登録
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    )
}

export default Login

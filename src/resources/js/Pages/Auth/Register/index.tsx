import React from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import AuthLayout from '@/Layouts/AuthLayout'
import TextInput from '@/Components/TextInput'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError'
import Button from '@/Components/Button'

const Register: React.FC = () => {
    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    const submit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault()
        form.post(route('user.register.store'), {
            onFinish: () => form.reset('password', 'password_confirmation'),
        })
    }

    return (
        <AuthLayout title="会員登録" description="必要事項を入力してアカウントを作成してください。">
            <Head title="会員登録" />
            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="お名前" />
                    <TextInput
                        id="name"
                        value={form.data.name}
                        onChange={(event) => form.setData('name', event.target.value)}
                        className="mt-1 w-full"
                        required
                        autoComplete="name"
                    />
                    <InputError message={form.errors.name} className="mt-2" />
                </div>
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
                    <InputLabel htmlFor="password" value="パスワード" />
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
                        {form.processing ? '登録中…' : '登録する'}
                    </Button>
                    <p className="text-center text-sm text-slate-600">
                        すでにアカウントをお持ちの方は{' '}
                        <Link href={route('user.login')} className="text-theme font-semibold hover:underline">
                            ログイン
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    )
}

export default Register

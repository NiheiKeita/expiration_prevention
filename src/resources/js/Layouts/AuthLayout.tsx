import React from 'react'
import { usePage } from '@inertiajs/react'
import type { PageProps } from '@/types'

type Props = {
    title: string
    description?: string
    children: React.ReactNode
}

const AuthLayout: React.FC<Props> = ({ title, description, children }) => {
    const { props } = usePage<PageProps>()
    const success = props.flash?.success ?? undefined
    const error = props.flash?.error ?? undefined

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
                    {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
                </div>
                {success && (
                    <div className="mb-4 rounded border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-700" role="status">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-600" role="alert">
                        {error}
                    </div>
                )}
                {children}
            </div>
        </div>
    )
}

export default AuthLayout

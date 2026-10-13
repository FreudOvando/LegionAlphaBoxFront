import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { login as loginRequest } from '@/api/Auth';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/errors';
import { loginSchema } from '@/lib/authSchema';
const inputStyles = 'w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500';
const labelStyles = 'mb-1.5 block text-sm font-medium text-zinc-300';
const errorStyles = 'mt-1 text-sm text-red-400';
export function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({ resolver: zodResolver(loginSchema) });
    async function onSubmit(values) {
        try {
            const response = await loginRequest(values);
            login(response);
            toast.success(`Hola de nuevo, ${response.user.firstName}`);
            navigate('/');
        }
        catch (error) {
            toast.error(getErrorMessage(error));
        }
    }
    return (_jsxs("section", { className: "mx-auto max-w-md", children: [_jsxs("div", { className: "mb-8", children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-widest text-orange-500", children: "WorkoutMe-C" }), _jsx("h1", { className: "mt-2 text-3xl font-black text-zinc-50", children: "Iniciar sesi\u00F3n" }), _jsx("p", { className: "mt-2 text-sm text-zinc-400", children: "Accede a tus entrenamientos y WODs." })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6", children: [_jsxs("div", { children: [_jsx("label", { className: labelStyles, htmlFor: "email", children: "Correo electr\u00F3nico" }), _jsx("input", { id: "email", type: "email", autoComplete: "email", className: inputStyles, ...register('email') }), errors.email && _jsx("p", { className: errorStyles, children: errors.email.message })] }), _jsxs("div", { children: [_jsx("label", { className: labelStyles, htmlFor: "password", children: "Contrase\u00F1a" }), _jsx("input", { id: "password", type: "password", autoComplete: "current-password", className: inputStyles, ...register('password') }), errors.password && _jsx("p", { className: errorStyles, children: errors.password.message })] }), _jsxs("button", { type: "submit", disabled: isSubmitting, className: "flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60", children: [isSubmitting ? _jsx(Loader2, { size: 16, className: "animate-spin" }) : _jsx(LogIn, { size: 16 }), "Entrar"] }), _jsxs("p", { className: "text-center text-sm text-zinc-400", children: ["\u00BFNo tienes una cuenta?", ' ', _jsx(Link, { to: "/register", className: "font-semibold text-orange-400 hover:text-orange-300", children: "Reg\u00EDstrate" })] })] })] }));
}

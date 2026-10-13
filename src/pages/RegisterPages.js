import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { register as registerRequest } from '@/api/Auth';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/errors';
import { registerSchema } from '@/lib/authSchema';
const inputStyles = 'w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500';
const labelStyles = 'mb-1.5 block text-sm font-medium text-zinc-300';
const errorStyles = 'mt-1 text-sm text-red-400';
export function RegisterPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({ resolver: zodResolver(registerSchema) });
    async function onSubmit(values) {
        try {
            const response = await registerRequest({
                ...values,
                photoUrl: values.photoUrl?.trim() ? values.photoUrl.trim() : null,
            });
            login(response);
            toast.success(`¡Bienvenido, ${response.user.firstName}!`);
            navigate('/');
        }
        catch (error) {
            toast.error(getErrorMessage(error));
        }
    }
    return (_jsxs("section", { className: "mx-auto max-w-md", children: [_jsxs("div", { className: "mb-8", children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-widest text-red-500", children: "WorkoutMe" }), _jsx("h1", { className: "mt-2 text-3xl font-black text-zinc-50", children: "Crear cuenta" }), _jsx("p", { className: "mt-2 text-sm text-zinc-400", children: "\u00DAnete a tu comunidad de entrenamiento." })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6", children: [_jsxs("div", { children: [_jsx("label", { className: labelStyles, htmlFor: "firstName", children: "Nombre" }), _jsx("input", { id: "firstName", autoComplete: "given-name", className: inputStyles, ...register('firstName') }), errors.firstName && _jsx("p", { className: errorStyles, children: errors.firstName.message })] }), _jsxs("div", { children: [_jsx("label", { className: labelStyles, htmlFor: "lastName", children: "Apellido" }), _jsx("input", { id: "lastName", autoComplete: "family-name", className: inputStyles, ...register('lastName') }), errors.lastName && _jsx("p", { className: errorStyles, children: errors.lastName.message })] }), _jsxs("div", { children: [_jsx("label", { className: labelStyles, htmlFor: "birthDate", children: "Fecha de nacimiento" }), _jsx("input", { id: "birthDate", type: "date", className: inputStyles, ...register('birthDate') }), errors.birthDate && _jsx("p", { className: errorStyles, children: errors.birthDate.message })] }), _jsxs("div", { children: [_jsx("label", { className: labelStyles, htmlFor: "email", children: "Correo electr\u00F3nico" }), _jsx("input", { id: "email", type: "email", autoComplete: "email", className: inputStyles, ...register('email') }), errors.email && _jsx("p", { className: errorStyles, children: errors.email.message })] }), _jsxs("div", { children: [_jsx("label", { className: labelStyles, htmlFor: "password", children: "Contrase\u00F1a" }), _jsx("input", { id: "password", type: "password", autoComplete: "new-password", className: inputStyles, ...register('password') }), errors.password && _jsx("p", { className: errorStyles, children: errors.password.message })] }), _jsxs("div", { children: [_jsxs("label", { className: labelStyles, htmlFor: "photoUrl", children: ["URL de foto ", _jsx("span", { className: "text-zinc-500", children: "(opcional)" })] }), _jsx("input", { id: "photoUrl", type: "url", placeholder: "https://...", className: inputStyles, ...register('photoUrl') }), errors.photoUrl && _jsx("p", { className: errorStyles, children: errors.photoUrl.message })] }), _jsxs("button", { type: "submit", disabled: isSubmitting, className: "flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60", children: [isSubmitting ? _jsx(Loader2, { size: 16, className: "animate-spin" }) : _jsx(UserPlus, { size: 16 }), "Crear cuenta"] }), _jsxs("p", { className: "text-center text-sm text-zinc-400", children: ["\u00BFYa tienes una cuenta?", ' ', _jsx(Link, { to: "/login", className: "font-semibold text-orange-400 hover:text-orange-300", children: "Inicia sesi\u00F3n" })] })] })] }));
}

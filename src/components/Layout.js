import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MembershipBadge } from '@/components/MembershipBadge';
import { branding } from '@/branding';
import { CalendarDays, CreditCard, House, LogOut, Plus, Trophy, UserRound } from 'lucide-react';
export function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    function handleLogout() {
        logout();
        navigate('/');
    }
    return (_jsxs("div", { className: "min-h-screen bg-zinc-950 text-zinc-100", children: [_jsxs("header", { className: "sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur", children: [_jsxs("div", { className: "mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3", children: [_jsxs(Link, { to: "/", "aria-label": branding.name, className: "inline-flex items-center gap-3 text-2xl font-black tracking-tight", children: [branding.logoUrl ? (_jsx("img", { src: branding.logoUrl, alt: branding.name, className: "h-8 max-w-40 object-contain" })) : (_jsx("span", { className: "text-red-500", children: branding.name })), _jsx("img", { src: "/LegionAlphaphoto.jpeg", alt: "Logo de Legion Alpha", className: "h-10 w-14 shrink-0 rounded object-contain sm:h-12 sm:w-16" })] }), _jsx("div", { className: "flex items-center gap-3", children: user ? (_jsxs(_Fragment, { children: [user.role === 'ADMIN' && (_jsxs(Link, { to: "/wods/new", className: "flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-orange-400", children: [_jsx(Plus, { size: 18, strokeWidth: 3 }), "Nuevo WOD"] })), _jsx(MembershipBadge, {}), _jsxs("span", { className: "text-sm text-zinc-400", children: ["Hola, ", _jsx("span", { className: "font-semibold text-zinc-200", children: user.firstName })] }), _jsx("button", { onClick: handleLogout, className: "flex items-center gap-1.5 rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100", "aria-label": "Cerrar sesi\u00F3n", type: "button", children: _jsx(LogOut, { size: 18 }) })] })) : (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/login", className: "text-sm text-zinc-400 hover:text-zinc-100", children: "Iniciar sesi\u00F3n" }), _jsx(Link, { to: "/register", className: "rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-red-300", children: "Crear cuenta" })] })) })] }), user && (_jsx("nav", { className: "mx-auto flex max-w-4xl gap-1 overflow-x-auto px-4 pb-2", "aria-label": "Navegaci\u00F3n principal", children: [
                            { to: '/', label: 'Principal', icon: House, end: true },
                            { to: '/history', label: 'Historial', icon: CalendarDays },
                            { to: '/competitions', label: 'Competencias', icon: Trophy },
                            { to: '/billing', label: 'Facturación', icon: CreditCard },
                            { to: '/profile', label: 'Mi perfil', icon: UserRound },
                        ].map(({ to, label, icon: Icon, end }) => (_jsxs(NavLink, { to: to, end: end, className: ({ isActive }) => `flex shrink-0 items-center gap-2 border-b-2 px-3 py-2 text-sm transition ${isActive ? 'border-red-500 text-orange-400' : 'border-transparent text-zinc-500 hover:text-zinc-200'}`, children: [_jsx(Icon, { size: 16 }), label] }, to))) }))] }), _jsx("main", { className: "mx-auto max-w-4xl px-4 py-8", children: _jsx(Outlet, {}) })] }));
}

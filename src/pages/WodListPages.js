import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { useDeleteWod, useWods } from '@/hooks/useWods';
import { useAuth } from '@/hooks/useAuth';
import { WodCard } from '@/components/WodCard';
import { Leaderboard } from '@/components/LeaderBoard';
function toDateInputValue(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}
export function WodListPage() {
    const { data: wods, isLoading, isError } = useWods();
    const deleteWod = useDeleteWod();
    const { user } = useAuth();
    const { pathname } = useLocation();
    const isHistory = pathname === '/history';
    const today = toDateInputValue(new Date());
    const [selectedDate, setSelectedDate] = useState(() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return toDateInputValue(yesterday);
    });
    function handleDelete(id) {
        if (confirm('¿Eliminar este WOD y todas las puntuaciones registradas por los atletas? Esta acción no se puede deshacer.')) {
            deleteWod.mutate(id);
        }
    }
    if (isLoading) {
        return _jsx("p", { className: "text-center text-zinc-500", children: "Cargando WODs\u2026" });
    }
    if (isError) {
        return (_jsx("p", { className: "text-center text-red-400", children: "No se pudo conectar con el servidor. \u00BFEst\u00E1 corriendo el backend en el puerto 8080?" }));
    }
    const visibleWods = (wods ?? []).filter((wod) => isHistory ? wod.publicationDate === selectedDate && wod.publicationDate < today : wod.publicationDate === today);
    if (!isHistory && visibleWods.length === 0) {
        return (_jsxs("div", { className: "flex flex-col items-center gap-3 py-20 text-center", children: [_jsx(Dumbbell, { className: "text-zinc-700", size: 48 }), _jsx("p", { className: "text-zinc-500", children: "Todav\u00EDa no hay WOD publicado para hoy." }), user?.role === 'ADMIN' && (_jsx(Link, { to: "/wods/new", className: "text-sm font-semibold text-orange-400 hover:text-orange-300", children: "Agregar WOD" }))] }));
    }
    return (_jsxs("div", { className: "flex flex-col gap-4", children: [isHistory && (_jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3 border-b border-zinc-800 pb-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-zinc-100", children: "Historial de WODs" }), _jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Consulta entrenamientos de d\u00EDas anteriores." })] }), _jsxs("label", { className: "flex flex-col gap-1 text-xs font-medium text-zinc-400", children: ["Fecha", _jsx("input", { type: "date", value: selectedDate, max: toDateInputValue(new Date(new Date().setDate(new Date().getDate() - 1))), onChange: (event) => setSelectedDate(event.target.value), className: "rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100" })] })] })), visibleWods.map((wod) => (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsx(WodCard, { wod: wod, onDelete: handleDelete }), _jsx(Leaderboard, { wodId: wod.id })] }, wod.id))), isHistory && visibleWods.length === 0 && (_jsx("p", { className: "py-10 text-center text-sm text-zinc-500", children: "No hay un WOD publicado para esa fecha." }))] }));
}

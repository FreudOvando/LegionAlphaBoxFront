import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useCreateStage, useDeleteStage, useStages } from '@/hooks/useCompetitionDetail';
const inputStyles = 'rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500';
export function StageManager({ competitionId }) {
    const { data: stages } = useStages(competitionId);
    const createStage = useCreateStage(competitionId);
    const deleteStage = useDeleteStage(competitionId);
    const [name, setName] = useState('');
    function handleAdd(e) {
        e.preventDefault();
        if (!name.trim())
            return;
        const nextOrder = (stages?.length ?? 0) + 1;
        createStage.mutate({ name: name.trim(), stageOrder: nextOrder }, { onSuccess: () => setName('') });
    }
    function handleDelete(stageId) {
        if (confirm('¿Eliminar este WOD de la competencia? Se borrarán también sus resultados.')) {
            deleteStage.mutate(stageId);
        }
    }
    return (_jsxs("div", { className: "rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5", children: [_jsx("h2", { className: "mb-3 text-sm font-bold uppercase tracking-wide text-zinc-400", children: "WODs de la competencia" }), _jsx("ul", { className: "mb-4 flex flex-wrap gap-2", children: stages?.map((stage) => (_jsxs("li", { className: "flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200", children: [stage.name, _jsx("button", { onClick: () => handleDelete(stage.id), className: "text-zinc-500 hover:text-red-400", "aria-label": `Eliminar ${stage.name}`, children: _jsx(Trash2, { size: 14 }) })] }, stage.id))) }), _jsxs("form", { onSubmit: handleAdd, className: "flex gap-2", children: [_jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "Ej. WOD 1", className: `${inputStyles} flex-1` }), _jsxs("button", { type: "submit", disabled: createStage.isPending, className: "flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-sm font-bold text-zinc-950 hover:bg-orange-400 disabled:opacity-60", children: [_jsx(Plus, { size: 16 }), "Agregar"] })] })] }));
}

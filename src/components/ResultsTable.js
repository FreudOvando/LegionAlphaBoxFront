import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import { useDeleteEnrollment, useSaveResult } from '@/hooks/useCompetitionDetail';
export function ResultsTable({ competitionId, stages, enrollments, results, isAdmin }) {
    const saveResult = useSaveResult(competitionId);
    const deleteEnrollment = useDeleteEnrollment(competitionId);
    const [editingCell, setEditingCell] = useState(null);
    const [draftValue, setDraftValue] = useState('');
    if (enrollments.length === 0) {
        return _jsx("p", { className: "text-sm text-zinc-500", children: "Todav\u00EDa no hay atletas inscritos." });
    }
    if (stages.length === 0) {
        return _jsx("p", { className: "text-sm text-zinc-500", children: "Todav\u00EDa no hay WODs agregados a esta competencia." });
    }
    const rows = enrollments
        .map((enrollment) => {
        const byStage = new Map(results.filter((r) => r.enrollmentId === enrollment.id).map((r) => [r.stageId, r.percentage]));
        const total = [...byStage.values()].reduce((sum, value) => sum + value, 0);
        return { enrollment, byStage, total };
    })
        .sort((a, b) => b.total - a.total);
    function startEdit(stageId, enrollmentId, current) {
        setEditingCell({ stageId, enrollmentId });
        setDraftValue(current?.toString() ?? '');
    }
    function cancelEdit() {
        setEditingCell(null);
        setDraftValue('');
    }
    function confirmEdit() {
        if (!editingCell)
            return;
        const percentage = Number(draftValue);
        if (Number.isNaN(percentage) || percentage < 0 || percentage > 100)
            return;
        saveResult.mutate({ stageId: editingCell.stageId, enrollmentId: editingCell.enrollmentId, percentage }, { onSuccess: cancelEdit });
    }
    function handleDeleteEnrollment(enrollmentId, name) {
        if (confirm(`¿Eliminar a ${name} de esta competencia? También se borrarán sus resultados.`)) {
            deleteEnrollment.mutate(enrollmentId);
        }
    }
    return (_jsx("div", { className: "overflow-x-auto rounded-2xl border border-zinc-800", children: _jsxs("table", { className: "w-full min-w-[600px] text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-zinc-800 bg-zinc-900/60 text-left text-zinc-400", children: [_jsx("th", { className: "px-4 py-3 font-medium", children: "#" }), _jsx("th", { className: "px-4 py-3 font-medium", children: "Atleta" }), _jsx("th", { className: "px-4 py-3 font-medium", children: "Categor\u00EDa" }), stages.map((stage) => (_jsx("th", { className: "px-4 py-3 text-center font-medium", children: stage.name }, stage.id))), _jsx("th", { className: "px-4 py-3 text-center font-medium", children: "Total" }), isAdmin && _jsx("th", { className: "px-4 py-3 text-center font-medium", children: "Acciones" })] }) }), _jsx("tbody", { children: rows.map(({ enrollment, byStage, total }, index) => (_jsxs("tr", { className: "border-b border-zinc-800 last:border-0", children: [_jsx("td", { className: "px-4 py-3 text-zinc-500", children: index + 1 }), _jsx("td", { className: "px-4 py-3 font-medium text-zinc-100", children: enrollment.userFullName }), _jsx("td", { className: "px-4 py-3 text-zinc-400", children: enrollment.category }), stages.map((stage) => {
                                const isEditing = editingCell?.stageId === stage.id && editingCell?.enrollmentId === enrollment.id;
                                const value = byStage.get(stage.id);
                                return (_jsx("td", { className: "px-4 py-3 text-center", children: isEditing ? (_jsxs("div", { className: "flex items-center justify-center gap-1", children: [_jsx("input", { autoFocus: true, type: "number", min: 0, max: 100, value: draftValue, onChange: (e) => setDraftValue(e.target.value), className: "w-16 rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 text-center text-zinc-100" }), _jsx("button", { onClick: confirmEdit, className: "text-emerald-400 hover:text-emerald-300", "aria-label": "Guardar", children: _jsx(Check, { size: 14 }) }), _jsx("button", { onClick: cancelEdit, className: "text-zinc-500 hover:text-zinc-300", "aria-label": "Cancelar", children: _jsx(X, { size: 14 }) })] })) : isAdmin ? (_jsxs("button", { onClick: () => startEdit(stage.id, enrollment.id, value), className: "group inline-flex items-center gap-1 text-zinc-300 hover:text-orange-400", children: [value ?? '—', _jsx(Pencil, { size: 12, className: "opacity-0 group-hover:opacity-100" })] })) : (_jsx("span", { className: "text-zinc-300", children: value ?? '—' })) }, stage.id));
                            }), _jsx("td", { className: "px-4 py-3 text-center font-bold text-orange-400", children: total }), isAdmin && (_jsx("td", { className: "px-4 py-3 text-center", children: _jsx("button", { onClick: () => handleDeleteEnrollment(enrollment.id, enrollment.userFullName), className: "text-zinc-500 hover:text-red-400", "aria-label": `Eliminar a ${enrollment.userFullName}`, children: _jsx(Trash2, { size: 16 }) }) }))] }, enrollment.id))) })] }) }));
}

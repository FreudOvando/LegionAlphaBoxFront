import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useState } from 'react';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import { useDeleteEnrollment, useDeletePerformance, useDeleteTeamPerformance, usePerformances, useSavePerformance, useSaveResult, useSaveTeamPerformance, useSaveTeamPercentage, useTeamResults, } from '@/hooks/useCompetitionDetail';
export function ResultsTable({ competitionId, stages, enrollments, results, isAdmin, teams, }) {
    const isTeamCompetition = teams !== undefined;
    const { data: performances, isError: performanceError } = usePerformances(competitionId, !isTeamCompetition);
    const { data: teamResults, isError: teamResultError } = useTeamResults(competitionId, isTeamCompetition);
    const saveResult = useSaveResult(competitionId);
    const savePerformance = useSavePerformance(competitionId);
    const deletePerformance = useDeletePerformance(competitionId);
    const saveTeamPercentage = useSaveTeamPercentage(competitionId);
    const saveTeamPerformance = useSaveTeamPerformance(competitionId);
    const deleteTeamPerformance = useDeleteTeamPerformance(competitionId);
    const deleteEnrollment = useDeleteEnrollment(competitionId);
    const [editingPercentage, setEditingPercentage] = useState(null);
    const [editingPerformance, setEditingPerformance] = useState(null);
    const [draftValue, setDraftValue] = useState('');
    const rows = isTeamCompetition
        ? (teams ?? []).map((team) => {
            const byStage = (teamResults ?? []).filter((result) => result.teamId === team.id);
            const percentages = new Map(byStage.flatMap((result) => result.percentage === null ? [] : [[result.stageId, result.percentage]]));
            const performanceValues = new Map(byStage.flatMap((result) => result.repsOrTime === null ? [] : [[result.stageId, result.repsOrTime]]));
            const teamResultIds = new Map(byStage.map((result) => [result.stageId, result.id]));
            return {
                id: team.id,
                label: team.name,
                category: 'Equipo',
                total: [...percentages.values()].reduce((sum, value) => sum + value, 0),
                percentages,
                performanceValues,
                performanceIds: teamResultIds,
            };
        })
        : enrollments.map((enrollment) => {
            const enrollmentResults = results.filter((result) => result.enrollmentId === enrollment.id);
            const enrollmentPerformances = (performances ?? []).filter((performance) => performance.enrollmentId === enrollment.id);
            const percentages = new Map(enrollmentResults.map((result) => [result.stageId, result.percentage]));
            return {
                id: enrollment.id,
                label: enrollment.userFullName,
                category: enrollment.category,
                total: [...percentages.values()].reduce((sum, value) => sum + value, 0),
                percentages,
                performanceValues: new Map(enrollmentPerformances.map((performance) => [performance.stageId, performance.repsOrTime])),
                performanceIds: new Map(enrollmentPerformances.map((performance) => [performance.stageId, performance.id])),
            };
        });
    rows.sort((a, b) => b.total - a.total);
    function startPercentageEdit(stageId, row) {
        setEditingPercentage({ stageId, rowId: row.id });
        setEditingPerformance(null);
        setDraftValue(row.percentages.get(stageId)?.toString() ?? '');
    }
    function startPerformanceEdit(stageId, row) {
        setEditingPerformance({ stageId, rowId: row.id });
        setEditingPercentage(null);
        setDraftValue(row.performanceValues.get(stageId) ?? '');
    }
    function cancelEdit() {
        setEditingPercentage(null);
        setEditingPerformance(null);
        setDraftValue('');
    }
    function confirmPercentageEdit(row) {
        if (!editingPercentage)
            return;
        const percentage = Number(draftValue);
        if (draftValue === '' || !Number.isInteger(percentage) || percentage < 0 || percentage > 100)
            return;
        if (isTeamCompetition) {
            saveTeamPercentage.mutate({ stageId: editingPercentage.stageId, teamId: row.id, percentage }, { onSuccess: cancelEdit });
        }
        else {
            saveResult.mutate({ stageId: editingPercentage.stageId, enrollmentId: row.id, percentage }, { onSuccess: cancelEdit });
        }
    }
    function confirmPerformanceEdit(row) {
        if (!editingPerformance || !/^[0-9]{1,20}$/.test(draftValue))
            return;
        if (isTeamCompetition) {
            saveTeamPerformance.mutate({ stageId: editingPerformance.stageId, teamId: row.id, repsOrTime: draftValue }, { onSuccess: cancelEdit });
        }
        else {
            savePerformance.mutate({ stageId: editingPerformance.stageId, enrollmentId: row.id, repsOrTime: draftValue }, { onSuccess: cancelEdit });
        }
    }
    function handleDeletePerformance(stageId, row) {
        const resultId = row.performanceIds.get(stageId);
        if (resultId === undefined || !confirm('¿Eliminar el valor de reps o tiempo?'))
            return;
        if (isTeamCompetition) {
            deleteTeamPerformance.mutate(resultId);
        }
        else {
            deletePerformance.mutate(resultId);
        }
    }
    function handleDeleteEnrollment(enrollmentId, name) {
        if (confirm(`¿Eliminar a ${name} de esta competencia? También se borrarán sus resultados.`)) {
            deleteEnrollment.mutate(enrollmentId);
        }
    }
    const isSaving = saveResult.isPending
        || savePerformance.isPending
        || saveTeamPercentage.isPending
        || saveTeamPerformance.isPending;
    if (rows.length === 0) {
        return (_jsx("p", { className: "text-sm text-zinc-500", children: isTeamCompetition ? 'Todavía no hay equipos creados.' : 'Todavía no hay atletas inscritos.' }));
    }
    if (stages.length === 0) {
        return _jsx("p", { className: "text-sm text-zinc-500", children: "Todav\u00EDa no hay WODs agregados a esta competencia." });
    }
    if (performanceError || teamResultError) {
        return _jsx("p", { role: "alert", className: "text-sm text-red-400", children: "No se pudieron cargar los puntajes y resultados." });
    }
    return (_jsx("div", { className: "overflow-x-auto rounded-2xl border border-zinc-800", children: _jsxs("table", { className: "w-full min-w-[780px] text-sm", children: [_jsxs("thead", { children: [_jsxs("tr", { className: "border-b border-zinc-800 bg-zinc-900/60 text-left text-zinc-400", children: [_jsx("th", { rowSpan: 2, className: "px-4 py-3 font-medium", children: "#" }), _jsx("th", { rowSpan: 2, className: "px-4 py-3 font-medium", children: isTeamCompetition ? 'Equipo' : 'Atleta' }), _jsx("th", { rowSpan: 2, className: "px-4 py-3 font-medium", children: "Categor\u00EDa" }), stages.map((stage) => (_jsx("th", { colSpan: 2, className: "px-4 py-3 text-center font-medium", children: stage.name }, stage.id))), _jsx("th", { rowSpan: 2, className: "px-4 py-3 text-center font-medium", children: "Total" }), isAdmin && !isTeamCompetition && (_jsx("th", { rowSpan: 2, className: "px-4 py-3 text-center font-medium", children: "Acciones" }))] }), _jsx("tr", { className: "border-b border-zinc-800 bg-zinc-900/60 text-zinc-500", children: stages.map((stage) => (_jsxs(Fragment, { children: [_jsx("th", { className: "px-3 py-2 text-center text-xs font-medium", children: "Puntaje %" }), _jsx("th", { className: "px-3 py-2 text-center text-xs font-medium", children: "Reps / tiempo" })] }, stage.id))) })] }), _jsx("tbody", { children: rows.map((row, index) => (_jsxs("tr", { className: "border-b border-zinc-800 last:border-0", children: [_jsx("td", { className: "px-4 py-3 text-zinc-500", children: index + 1 }), _jsx("td", { className: "px-4 py-3 font-medium text-zinc-100", children: row.label }), _jsx("td", { className: "px-4 py-3 text-zinc-400", children: row.category }), stages.map((stage) => {
                                const isEditingScore = editingPercentage?.stageId === stage.id && editingPercentage.rowId === row.id;
                                const isEditingPerformanceCell = editingPerformance?.stageId === stage.id && editingPerformance.rowId === row.id;
                                const percentage = row.percentages.get(stage.id);
                                const performanceValue = row.performanceValues.get(stage.id);
                                return (_jsxs(Fragment, { children: [_jsx("td", { className: "px-3 py-3 text-center", children: isEditingScore ? (_jsxs("div", { className: "flex items-center justify-center gap-1", children: [_jsx("input", { autoFocus: true, type: "number", min: 0, max: 100, step: 1, value: draftValue, onChange: (event) => setDraftValue(event.target.value), className: "w-16 rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 text-center text-zinc-100", "aria-label": `Puntaje porcentual de ${row.label}, ${stage.name}` }), _jsx("button", { type: "button", disabled: isSaving, onClick: () => confirmPercentageEdit(row), className: "text-emerald-400 hover:text-emerald-300 disabled:opacity-50", "aria-label": "Guardar puntaje porcentual", children: _jsx(Check, { size: 14 }) }), _jsx("button", { type: "button", onClick: cancelEdit, className: "text-zinc-500 hover:text-zinc-300", "aria-label": "Cancelar edici\u00F3n", children: _jsx(X, { size: 14 }) })] })) : isAdmin ? (_jsxs("button", { type: "button", onClick: () => startPercentageEdit(stage.id, row), className: "group inline-flex items-center gap-1 text-zinc-300 hover:text-orange-400", "aria-label": `Editar puntaje porcentual de ${row.label}, ${stage.name}`, children: [percentage ?? '—', _jsx(Pencil, { size: 12, className: "opacity-0 group-hover:opacity-100" })] })) : (_jsx("span", { className: "text-zinc-300", children: percentage ?? '—' })) }), _jsx("td", { className: "px-3 py-3 text-center", children: isEditingPerformanceCell ? (_jsxs("div", { className: "flex items-center justify-center gap-1", children: [_jsx("input", { autoFocus: true, type: "text", inputMode: "numeric", pattern: "[0-9]{1,20}", maxLength: 20, value: draftValue, onChange: (event) => setDraftValue(event.target.value.replace(/\D/g, '').slice(0, 20)), className: "w-24 rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 text-center text-zinc-100", "aria-label": `Reps o tiempo de ${row.label}, ${stage.name}` }), _jsx("button", { type: "button", disabled: isSaving || !/^[0-9]{1,20}$/.test(draftValue), onClick: () => confirmPerformanceEdit(row), className: "text-emerald-400 hover:text-emerald-300 disabled:opacity-50", "aria-label": "Guardar reps o tiempo", children: _jsx(Check, { size: 14 }) }), _jsx("button", { type: "button", onClick: cancelEdit, className: "text-zinc-500 hover:text-zinc-300", "aria-label": "Cancelar edici\u00F3n", children: _jsx(X, { size: 14 }) })] })) : isAdmin ? (_jsxs("div", { className: "inline-flex items-center justify-center gap-1", children: [_jsxs("button", { type: "button", onClick: () => startPerformanceEdit(stage.id, row), className: "group inline-flex items-center gap-1 text-zinc-300 hover:text-orange-400", "aria-label": `Editar reps o tiempo de ${row.label}, ${stage.name}`, children: [performanceValue ?? '—', _jsx(Pencil, { size: 12, className: "opacity-0 group-hover:opacity-100" })] }), performanceValue !== undefined && (_jsx("button", { type: "button", onClick: () => handleDeletePerformance(stage.id, row), disabled: deletePerformance.isPending || deleteTeamPerformance.isPending, className: "text-zinc-600 hover:text-red-400 disabled:opacity-50", "aria-label": `Eliminar reps o tiempo de ${row.label}, ${stage.name}`, children: _jsx(Trash2, { size: 13 }) }))] })) : (_jsx("span", { className: "text-zinc-300", children: performanceValue ?? '—' })) })] }, stage.id));
                            }), _jsx("td", { className: "px-4 py-3 text-center font-bold text-orange-400", children: row.total }), isAdmin && !isTeamCompetition && (_jsx("td", { className: "px-4 py-3 text-center", children: _jsx("button", { type: "button", onClick: () => handleDeleteEnrollment(row.id, row.label), className: "text-zinc-500 hover:text-red-400", "aria-label": `Eliminar a ${row.label}`, children: _jsx(Trash2, { size: 16 }) }) }))] }, row.id))) })] }) }));
}

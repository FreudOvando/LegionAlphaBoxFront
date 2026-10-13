import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Pencil, Plus, Save, Trash2, Users, X } from 'lucide-react';
import { useCompetitionTeams, useCreateCompetitionTeam, useDeleteCompetitionTeam, useUpdateCompetitionTeam, } from '@/hooks/useCompetitions';
import { useStages, useTeamResults } from '@/hooks/useCompetitionDetail';
import { ResultsTable } from '@/components/ResultsTable';
const inputStyles = 'w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500';
export function TeamManager({ competitionId, enrollments, isAdmin }) {
    const { data: teams, isLoading, isError } = useCompetitionTeams(competitionId);
    const { data: stages, isLoading: loadingStages } = useStages(competitionId);
    const { isLoading: loadingResults } = useTeamResults(competitionId);
    const createTeam = useCreateCompetitionTeam(competitionId);
    const updateTeam = useUpdateCompetitionTeam(competitionId);
    const deleteTeam = useDeleteCompetitionTeam(competitionId);
    const [isCreating, setIsCreating] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [name, setName] = useState('');
    const [memberEnrollmentIds, setMemberEnrollmentIds] = useState([]);
    function closeEditor() {
        setIsCreating(false);
        setEditingTeam(null);
        setName('');
        setMemberEnrollmentIds([]);
    }
    function startCreate() {
        setEditingTeam(null);
        setName('');
        setMemberEnrollmentIds([]);
        setIsCreating(true);
    }
    function startEdit(team) {
        setIsCreating(false);
        setEditingTeam(team);
        setName(team.name);
        setMemberEnrollmentIds(team.members.map((member) => member.enrollmentId));
    }
    function toggleMember(enrollmentId) {
        setMemberEnrollmentIds((current) => current.includes(enrollmentId)
            ? current.filter((id) => id !== enrollmentId)
            : [...current, enrollmentId]);
    }
    function handleSubmit(event) {
        event.preventDefault();
        const payload = { name: name.trim(), memberEnrollmentIds };
        if (!payload.name)
            return;
        if (editingTeam) {
            updateTeam.mutate({ teamId: editingTeam.id, payload }, { onSuccess: closeEditor });
        }
        else {
            createTeam.mutate(payload, { onSuccess: closeEditor });
        }
    }
    function handleDelete(team) {
        if (confirm(`¿Eliminar el equipo "${team.name}"? Sus atletas seguirán inscritos en la competencia.`)) {
            deleteTeam.mutate(team.id);
        }
    }
    const teamByEnrollmentId = new Map((teams ?? []).flatMap((team) => team.members.map((member) => [member.enrollmentId, team])));
    const isSaving = createTeam.isPending || updateTeam.isPending;
    const canManage = isAdmin && !isLoading && !isError;
    return (_jsxs("section", { className: "flex flex-col gap-4", "aria-labelledby": "teams-title", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { id: "teams-title", className: "text-lg font-bold text-zinc-100", children: "Equipos" }), _jsx("p", { className: "text-sm text-zinc-500", children: "Los atletas conservan la categor\u00EDa que eligieron al inscribirse." })] }), canManage && !isCreating && !editingTeam && (_jsxs("button", { type: "button", onClick: startCreate, className: "flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-bold text-zinc-950 hover:bg-orange-400", children: [_jsx(Plus, { size: 16 }), "Crear equipo"] }))] }), isLoading && _jsx("p", { className: "text-sm text-zinc-500", children: "Cargando equipos\u2026" }), isError && _jsx("p", { role: "alert", className: "text-sm text-red-400", children: "No se pudieron cargar los equipos." }), !isLoading && !isError && (teams?.length ?? 0) === 0 && (_jsx("p", { className: "rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-zinc-500", children: "Todav\u00EDa no hay equipos creados." })), teams?.map((team) => (_jsxs("article", { className: "rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5", children: [_jsxs("div", { className: "mb-4 flex items-start justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Users, { className: "shrink-0 text-red-500", size: 22 }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-zinc-100", children: team.name }), _jsxs("p", { className: "text-sm text-zinc-500", children: [team.members.length, " ", team.members.length === 1 ? 'atleta' : 'atletas'] })] })] }), canManage && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { type: "button", onClick: () => startEdit(team), className: "rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100", "aria-label": `Editar equipo ${team.name}`, children: _jsx(Pencil, { size: 16 }) }), _jsx("button", { type: "button", onClick: () => handleDelete(team), disabled: deleteTeam.isPending, className: "rounded-lg p-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-60", "aria-label": `Eliminar equipo ${team.name}`, children: _jsx(Trash2, { size: 16 }) })] }))] }), team.members.length > 0 ? (_jsx("ul", { className: "flex flex-wrap gap-2", children: team.members.map((member) => (_jsxs("li", { className: "rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-200", children: [_jsx("span", { className: "font-medium", children: member.userFullName }), _jsx("span", { className: "ml-2 text-xs text-zinc-400", children: member.category })] }, member.enrollmentId))) })) : (_jsx("p", { className: "text-sm text-zinc-500", children: "A\u00FAn no hay atletas asignados." }))] }, team.id))), canManage && (isCreating || editingTeam) && (_jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5", children: [_jsx("h3", { className: "font-bold text-zinc-100", children: editingTeam ? 'Editar equipo' : 'Nuevo equipo' }), _jsxs("div", { children: [_jsx("label", { htmlFor: "team-name", className: "mb-1.5 block text-sm font-medium text-zinc-300", children: "Nombre del equipo" }), _jsx("input", { id: "team-name", value: name, onChange: (event) => setName(event.target.value), maxLength: 100, required: true, className: inputStyles, placeholder: "Ej. Los atletas" })] }), _jsxs("fieldset", { className: "flex flex-col gap-2", children: [_jsx("legend", { className: "mb-1 text-sm font-medium text-zinc-300", children: "Atletas inscritos" }), enrollments.length === 0 ? (_jsx("p", { className: "text-sm text-zinc-500", children: "Todav\u00EDa no hay atletas inscritos en esta competencia." })) : (_jsx("div", { className: "max-h-64 overflow-y-auto rounded-lg border border-zinc-800", children: enrollments.map((enrollment) => {
                                    const currentTeam = teamByEnrollmentId.get(enrollment.id);
                                    const isSelected = memberEnrollmentIds.includes(enrollment.id);
                                    return (_jsxs("label", { className: "flex cursor-pointer items-center gap-3 border-b border-zinc-800 px-3 py-2.5 last:border-0 hover:bg-zinc-800/60", children: [_jsx("input", { type: "checkbox", checked: isSelected, onChange: () => toggleMember(enrollment.id), className: "accent-red-500" }), _jsx("span", { className: "min-w-0 flex-1 text-sm text-zinc-200", children: enrollment.userFullName }), _jsx("span", { className: "text-xs text-zinc-400", children: enrollment.category }), currentTeam && currentTeam.id !== editingTeam?.id && (_jsxs("span", { className: "text-xs text-orange-400", children: ["Mover desde ", currentTeam.name] }))] }, enrollment.id));
                                }) }))] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsxs("button", { type: "button", onClick: closeEditor, className: "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100", children: [_jsx(X, { size: 16 }), "Cancelar"] }), _jsxs("button", { type: "submit", disabled: isSaving || !name.trim(), className: "flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-sm font-bold text-zinc-950 hover:bg-orange-400 disabled:opacity-60", children: [_jsx(Save, { size: 16 }), isSaving ? 'Guardando…' : 'Guardar equipo'] })] })] })), loadingStages || loadingResults ? (_jsx("p", { className: "text-sm text-zinc-500", children: "Cargando puntajes\u2026" })) : (_jsx(ResultsTable, { competitionId: competitionId, stages: stages ?? [], enrollments: enrollments, results: [], isAdmin: isAdmin, teams: teams ?? [] }))] }));
}

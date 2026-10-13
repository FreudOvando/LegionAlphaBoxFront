import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ImagePlus, Save, UserRound, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
export function ProfilePage() {
    const { user, updatePhotoUrl, updateNotes } = useAuth();
    const queryClient = useQueryClient();
    const [photoUrl, setPhotoUrl] = useState(user?.photoUrl ?? '');
    const [saved, setSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [notes, setNotes] = useState(user?.notes ?? '');
    const [notesSaved, setNotesSaved] = useState(false);
    const [isSavingNotes, setIsSavingNotes] = useState(false);
    const [notesError, setNotesError] = useState('');
    useEffect(() => {
        setPhotoUrl(user?.photoUrl ?? '');
    }, [user?.photoUrl]);
    useEffect(() => {
        setNotes(user?.notes ?? '');
    }, [user?.notes]);
    if (!user)
        return null;
    async function persistPhotoUrl(value) {
        setIsSaving(true);
        setSaved(false);
        setSaveError('');
        try {
            await updatePhotoUrl(value);
            await queryClient.invalidateQueries({ queryKey: ['scores', 'wod'] });
            setPhotoUrl(value ?? '');
            setSaved(true);
        }
        catch {
            setSaveError('No se pudo guardar la foto. Intenta de nuevo.');
        }
        finally {
            setIsSaving(false);
        }
    }
    function handleSubmit(event) {
        event.preventDefault();
        void persistPhotoUrl(photoUrl.trim() || null);
    }
    function handleRemove() {
        void persistPhotoUrl(null);
    }
    async function handleSaveNotes(event) {
        event.preventDefault();
        setIsSavingNotes(true);
        setNotesSaved(false);
        setNotesError('');
        try {
            await updateNotes(notes.trim() || null);
            setNotesSaved(true);
        }
        catch {
            setNotesError('No se pudieron guardar las notas. Intenta de nuevo.');
        }
        finally {
            setIsSavingNotes(false);
        }
    }
    return (_jsxs("section", { className: "mx-auto max-w-2xl", children: [_jsxs("div", { className: "border-b border-zinc-800 pb-5", children: [_jsx("h1", { className: "text-2xl font-bold text-zinc-100", children: "Mi perfil" }), _jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Consulta tus datos y administra tu foto de atleta." })] }), _jsxs("div", { className: "grid gap-8 py-6 sm:grid-cols-[9rem_1fr]", children: [_jsx("div", { className: "flex justify-center sm:justify-start", children: _jsx("div", { className: "flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-900 text-zinc-500", children: photoUrl ? (_jsx("img", { src: photoUrl, alt: `Foto de ${user.firstName}`, className: "h-full w-full object-cover" })) : (_jsx(UserRound, { size: 42 })) }) }), _jsxs("dl", { className: "grid content-start gap-4 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("dt", { className: "text-xs font-semibold uppercase text-zinc-500", children: "Nombre" }), _jsxs("dd", { className: "mt-1 text-sm text-zinc-100", children: [user.firstName, " ", user.lastName] })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-xs font-semibold uppercase text-zinc-500", children: "Correo" }), _jsx("dd", { className: "mt-1 break-all text-sm text-zinc-100", children: user.email })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-xs font-semibold uppercase text-zinc-500", children: "Tipo de cuenta" }), _jsx("dd", { className: "mt-1 text-sm text-zinc-100", children: user.role === 'ADMIN' ? 'Administrador' : 'Atleta' })] })] })] }), _jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-4 border-t border-zinc-800 pt-5", children: [_jsx("label", { htmlFor: "photoUrl", className: "text-sm font-semibold text-zinc-200", children: "URL de imagen" }), _jsx("input", { id: "photoUrl", type: "url", value: photoUrl, onChange: (event) => {
                            setPhotoUrl(event.target.value);
                            setSaved(false);
                        }, placeholder: "https://ejemplo.com/mi-foto.jpg", className: "w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-red-500 focus:outline-none" }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsxs("button", { type: "submit", className: "flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-bold text-zinc-950 hover:bg-orange-400", children: [_jsx(Save, { size: 16 }), isSaving ? 'Guardando…' : 'Guardar foto'] }), photoUrl && (_jsxs("button", { type: "button", onClick: handleRemove, disabled: isSaving, className: "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 disabled:opacity-50", children: [_jsx(X, { size: 16 }), "Quitar foto"] })), saved && _jsxs("span", { className: "flex items-center gap-1.5 text-sm text-emerald-400", children: [_jsx(ImagePlus, { size: 15 }), " Foto actualizada"] }), saveError && _jsx("span", { role: "alert", className: "text-sm text-red-400", children: saveError })] })] }), _jsxs("form", { onSubmit: handleSaveNotes, className: "flex flex-col gap-4 border-t border-zinc-800 pt-5 mt-5", children: [_jsxs("label", { htmlFor: "notes", className: "text-sm font-semibold text-zinc-200", children: ["Mis PRs y notas ", _jsx("span", { className: "text-zinc-500", children: "(espacio libre, m\u00E1x. 1000 caracteres)" })] }), _jsx("textarea", { id: "notes", rows: 5, value: notes, onChange: (event) => {
                            setNotes(event.target.value.slice(0, 1000));
                            setNotesSaved(false);
                        }, placeholder: 'Ej. Fran: 3:45\nDeadlift PR: 140kg\nBack squat: 120kg', className: "w-full resize-y rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-red-500 focus:outline-none" }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsxs("span", { className: "text-xs text-zinc-500", children: [notes.length, "/1000"] }), _jsxs("button", { type: "submit", disabled: isSavingNotes, className: "flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-bold text-zinc-950 hover:bg-orange-400 disabled:opacity-60", children: [_jsx(Save, { size: 16 }), isSavingNotes ? 'Guardando…' : 'Guardar notas'] }), notesSaved && _jsx("span", { className: "text-sm text-emerald-400", children: "Notas actualizadas" }), notesError && _jsx("span", { role: "alert", className: "text-sm text-red-400", children: notesError })] })] })] }));
}

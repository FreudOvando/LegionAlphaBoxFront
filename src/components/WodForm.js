import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { wodSchema } from '@/lib/WodSquema';
import { WOD_TYPES } from '@/types/wods';
import { WOD_TYPE_LABELS } from '@/lib/wodType';
const inputStyles = 'w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500';
const labelStyles = 'mb-1.5 block text-sm font-medium text-zinc-300';
const errorStyles = 'mt-1 text-sm text-red-400';
function toLocalDateInputValue(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}
export function WodForm({ defaultValues, onSubmit, isSubmitting, submitLabel }) {
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(wodSchema),
        defaultValues: {
            name: '',
            publicationDate: toLocalDateInputValue(new Date()),
            coachName: '',
            type: undefined,
            description: '',
            ...defaultValues,
        },
    });
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-5", children: [_jsxs("div", { children: [_jsxs("label", { className: labelStyles, htmlFor: "name", children: ["Nombre del WOD ", _jsx("span", { className: "text-zinc-600", children: "(opcional)" })] }), _jsx("input", { id: "name", type: "text", placeholder: 'Ej. "Fran", "Helen"...', className: inputStyles, ...register('name') }), errors.name && _jsx("p", { className: errorStyles, children: errors.name.message })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: labelStyles, htmlFor: "publicationDate", children: "Fecha de publicaci\u00F3n" }), _jsx("input", { id: "publicationDate", type: "date", className: inputStyles, ...register('publicationDate') }), errors.publicationDate && (_jsx("p", { className: errorStyles, children: errors.publicationDate.message }))] }), _jsxs("div", { children: [_jsx("label", { className: labelStyles, htmlFor: "type", children: "Tipo de WOD" }), _jsxs("select", { id: "type", className: inputStyles, ...register('type'), children: [_jsx("option", { value: "", children: "Selecciona\u2026" }), WOD_TYPES.map((type) => (_jsx("option", { value: type, children: WOD_TYPE_LABELS[type] }, type)))] }), errors.type && _jsx("p", { className: errorStyles, children: errors.type.message })] })] }), _jsxs("div", { children: [_jsx("label", { className: labelStyles, htmlFor: "coachName", children: "Coach" }), _jsx("input", { id: "coachName", type: "text", placeholder: "Nombre del coach", className: inputStyles, ...register('coachName') }), errors.coachName && _jsx("p", { className: errorStyles, children: errors.coachName.message })] }), _jsxs("div", { children: [_jsx("label", { className: labelStyles, htmlFor: "description", children: "Descripci\u00F3n de los ejercicios" }), _jsx("textarea", { id: "description", rows: 6, placeholder: '21-15-9\nThrusters (43 kg)\nPull-ups', className: `${inputStyles} resize-y font-mono`, ...register('description') }), errors.description && _jsx("p", { className: errorStyles, children: errors.description.message })] }), _jsxs("button", { type: "submit", disabled: isSubmitting, className: "flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60", children: [isSubmitting && _jsx(Loader2, { size: 16, className: "animate-spin" }), submitLabel] })] }));
}

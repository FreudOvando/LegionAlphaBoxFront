import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { competitionSchema } from '@/lib/competitionSchema';
const inputStyles = 'w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500';
const labelStyles = 'mb-1.5 block text-sm font-medium text-zinc-300';
const errorStyles = 'mt-1 text-sm text-red-400';
export function CompetitionForm({ defaultValues, onSubmit, isSubmitting, submitLabel }) {
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(competitionSchema),
        defaultValues: {
            name: '',
            competitionDate: new Date().toISOString().slice(0, 10),
            ...defaultValues,
        },
    });
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-5", children: [_jsxs("div", { children: [_jsx("label", { className: labelStyles, htmlFor: "name", children: "Nombre" }), _jsx("input", { id: "name", className: inputStyles, ...register('name') }), errors.name && _jsx("p", { className: errorStyles, children: errors.name.message })] }), _jsxs("div", { children: [_jsx("label", { className: labelStyles, htmlFor: "competitionDate", children: "Fecha" }), _jsx("input", { id: "competitionDate", type: "date", className: inputStyles, ...register('competitionDate') }), errors.competitionDate && _jsx("p", { className: errorStyles, children: errors.competitionDate.message })] }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "rounded-lg bg-red-500 px-4 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-orange-400 disabled:opacity-60", children: submitLabel })] }));
}

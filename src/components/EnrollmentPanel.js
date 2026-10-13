import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEnroll, useEnrollments } from '@/hooks/useCompetitionDetail';
import { COMPETITION_CATEGORIES } from '@/types/competition';
export function EnrollmentPanel({ competitionId }) {
    const { user } = useAuth();
    const { data: enrollments } = useEnrollments(competitionId);
    const enroll = useEnroll(competitionId);
    const [category, setCategory] = useState('PRINCIPIANTE');
    const myEnrollment = enrollments?.find((e) => e.userId === user?.id);
    if (myEnrollment) {
        return (_jsxs("p", { className: "text-sm text-zinc-400", children: ["Ya est\u00E1s inscrito en esta competencia, categor\u00EDa", ' ', _jsx("span", { className: "font-semibold text-orange-400", children: myEnrollment.category }), "."] }));
    }
    function handleEnroll() {
        if (!user)
            return;
        enroll.mutate({ userId: user.id, category });
    }
    return (_jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsx("select", { value: category, onChange: (e) => setCategory(e.target.value), className: "rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-red-500 focus:outline-none", children: COMPETITION_CATEGORIES.map((cat) => (_jsx("option", { value: cat, children: cat }, cat))) }), _jsxs("button", { onClick: handleEnroll, disabled: enroll.isPending, className: "flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-orange-400 disabled:opacity-60", children: [_jsx(UserPlus, { size: 16 }), "Inscribirme"] })] }));
}

import { useState, useEffect } from "react";

interface VoteWidgetProps {
    characterAId: number;
    characterBId: number;
}

function VoteWidget({ characterAId, characterBId }: VoteWidgetProps) {
    const [votes, setVotes] = useState({ accurate: 0, inaccurate: 0 });
    const [loading, setLoading] = useState(true);
    const [selection, setSelection] = useState<boolean | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/vote/${characterAId}/${characterBId}`)
            .then((res) => res.json())
            .then((data) => {
                setVotes(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [characterAId, characterBId]);

    const selectChoice = (accurate: boolean) => {
        if (submitted) return;
        // clicking the same choice again deselects it — lets them back out entirely
        setSelection((prev) => (prev === accurate ? null : accurate));
    };

    const submitVote = async () => {
        if (selection === null || submitting) return;
        setSubmitting(true);

        await fetch(`${import.meta.env.VITE_API_URL}/vote`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                character_a_id: characterAId,
                character_b_id: characterBId,
                accurate: selection,
            }),
        });

        setVotes((v) => ({
            ...v,
            [selection ? "accurate" : "inaccurate"]: v[selection ? "accurate" : "inaccurate"] + 1,
        }));
        setSubmitting(false);
        setSubmitted(true);
    };

    if (loading) return null;

    return (
        <div className="flex flex-col items-center gap-2 mt-4">
            <p className="text-sm text-gray-400">Was this fight lore-accurate?</p>
            <div className="flex gap-4">
                <button
                    onClick={() => selectChoice(true)}
                    disabled={submitted}
                    className={`px-4 py-2 rounded text-white disabled:opacity-50 ${
                        selection === true ? "bg-green-700 ring-2 ring-green-300" : "bg-green-600"
                    }`}
                >
                    👍 Accurate ({votes.accurate})
                </button>
                <button
                    onClick={() => selectChoice(false)}
                    disabled={submitted}
                    className={`px-4 py-2 rounded text-white disabled:opacity-50 ${
                        selection === false ? "bg-red-700 ring-2 ring-red-300" : "bg-red-600"
                    }`}
                >
                    👎 Not accurate ({votes.inaccurate})
                </button>
            </div>
            {!submitted && selection !== null && (
                <button
                    onClick={submitVote}
                    disabled={submitting}
                    className="px-4 py-1 rounded bg-gray-800 text-white text-sm hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                    {submitting ? "Submitting…" : "Submit vote"}
                </button>
            )}
            {submitted && <p className="text-xs text-gray-500">Thanks for voting!</p>}
        </div>
    );
}

export default VoteWidget;
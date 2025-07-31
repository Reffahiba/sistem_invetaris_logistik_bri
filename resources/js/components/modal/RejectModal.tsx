import React, { useState } from "react";
import { X } from "lucide-react";

interface RejectReasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

const RejectReasonModal: React.FC<RejectReasonModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    const handleConfirm = () => {
        if (reason.trim() === "") {
            setError("Alasan penolakan wajib diisi.");
            return;
        }

        onConfirm(reason.trim());
        setReason("");
        setError("");
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] bg-black bg-opacity-40 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm transform transition-all scale-100"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Tolak Permintaan
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <label className="block text-sm text-gray-700 mb-2">
                    Alasan Penolakan
                </label>
                <textarea
                    value={reason}
                    onChange={(e) => {
                        setReason(e.target.value);
                        if (error) setError("");
                    }}
                    placeholder="Masukkan alasan secara singkat dan jelas..."
                    rows={4}
                    className={`w-full border ${
                        error
                            ? "border-red-500"
                            : "border-gray-300 focus:border-blue-400"
                    } rounded-sm px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300`}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                <div className="flex justify-end mt-6 gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                        Tolak Permintaan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectReasonModal;

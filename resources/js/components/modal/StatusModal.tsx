import React from "react";
import clsx from "clsx";

interface StatusStepperProps {
    currentStep: string;
}

const steps = [
    { label: "menunggu", icon: "/assets/menunggu.png", color: "bg-red-400" },
    {
        label: "sedang diproses",
        icon: "/assets/refresh-square-2.png",
        color: "bg-yellow-400",
    },
    {
        label: "sedang diantar",
        icon: "/assets/send-sqaure-2.png",
        color: "bg-blue-400",
    },
    {
        label: "telah diterima",
        icon: "/assets/tick-square.png",
        color: "bg-green-400",
    },
];

const Status: React.FC<StatusStepperProps> = ({ currentStep }) => {
    const currentIndex = steps.findIndex((step) => step.label === currentStep);

    return (
        <div className="flex items-center gap-4 justify-center text-left mt-6 mb-4">
            {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index <= currentIndex;

                return (
                    <div key={step.label}>
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col justify-center items-center">
                                <div
                                    className={clsx(
                                        "flex items-center justify-center w-12 h-12 rounded-full border-2",
                                        isActive
                                            ? `${step.color}`
                                            : "border-gray-300 text-gray-400"
                                    )}
                                >
                                    <img
                                        src={step.icon}
                                        alt={step.label}
                                        className="w-6 h-6"
                                    />
                                </div>
                                <p className="capitalize">{step.label}</p>
                            </div>
                            {index !== steps.length - 1 && (
                                <div className="w-8 h-1 bg-gray-300 mx-2 rounded-full" />
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Status;

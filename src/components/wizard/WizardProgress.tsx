'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
    number: number;
    title: string;
}

interface WizardProgressProps {
    steps: Step[];
    currentStep: number;
}

export function WizardProgress({ steps, currentStep }: WizardProgressProps) {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center">
                        {/* Step indicator */}
                        <div className="flex flex-col items-center">
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: currentStep === step.number ? 1.1 : 1,
                                }}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors duration-300",
                                    currentStep > step.number
                                        ? "bg-green-500 text-white"
                                        : currentStep === step.number
                                            ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                                            : "bg-gray-200 text-gray-500"
                                )}
                            >
                                {currentStep > step.number ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    step.number
                                )}
                            </motion.div>
                            <span
                                className={cn(
                                    "mt-2 text-sm font-medium transition-colors duration-300",
                                    currentStep >= step.number ? "text-gray-900" : "text-gray-400"
                                )}
                            >
                                {step.title}
                            </span>
                        </div>

                        {/* Connector line */}
                        {index < steps.length - 1 && (
                            <div className="flex-1 mx-4 h-1 relative">
                                <div className="absolute inset-0 bg-gray-200 rounded-full" />
                                <motion.div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                                    initial={false}
                                    animate={{
                                        width: currentStep > step.number ? "100%" : "0%",
                                    }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

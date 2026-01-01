'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useIncidentStore } from '@/stores/incidentStore';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Step1Basics } from '@/components/wizard/Step1Basics';
import { Step2Timeline } from '@/components/wizard/Step2Timeline';
import { Step3RootCause } from '@/components/wizard/Step3RootCause';
import { Step4Impact } from '@/components/wizard/Step4Impact';
import { Step5Context } from '@/components/wizard/Step5Context';
import { WizardProgress } from '@/components/wizard/WizardProgress';

const steps = [
    { number: 1, title: 'Incident Basics', component: Step1Basics },
    { number: 2, title: 'Timeline', component: Step2Timeline },
    { number: 3, title: 'Root Cause', component: Step3RootCause },
    { number: 4, title: 'Impact', component: Step4Impact },
    { number: 5, title: 'Additional Context', component: Step5Context },
];

export default function NewIncidentPage() {
    const { currentStep } = useIncidentStore();
    const CurrentStepComponent = steps[currentStep - 1]?.component;

    return (
        <div className="min-h-screen">
            <DashboardHeader title="New Incident Postmortem" />

            <div className="p-6">
                {/* Progress */}
                <WizardProgress steps={steps} currentStep={currentStep} />

                {/* Step Content */}
                <motion.div
                    className="max-w-3xl mx-auto mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {CurrentStepComponent && <CurrentStepComponent />}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}

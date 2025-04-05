"use client";

import * as React from "react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@mapform/ui/components/alert-dialog";
import { Button } from "@mapform/ui/components/button";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import type { StaticImageData } from "next/image";
export interface TourStep {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | StaticImageData;
}

interface TourGuideProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function TourGuide({ steps, isOpen, onClose }: TourGuideProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setDirection(1);
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setDirection(-1);
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  // If there are no steps, don't render anything
  if (!steps.length || !currentStep) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="overflow-hidden">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ x: 100 * direction, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100 * direction, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full"
            >
              <AlertDialogHeader>
                <div className="text-muted-foreground mb-2 text-sm">
                  Step {currentStepIndex + 1} of {steps.length}
                </div>
                {currentStep.imageUrl && (
                  <div className="relative mb-4 h-56 w-full overflow-hidden rounded-md">
                    <Image
                      src={currentStep.imageUrl}
                      alt={currentStep.title}
                      className="h-full w-full object-cover"
                      fill
                    />
                  </div>
                )}
                <AlertDialogTitle>{currentStep.title}</AlertDialogTitle>
                <AlertDialogDescription>
                  {currentStep.description}
                </AlertDialogDescription>
              </AlertDialogHeader>
            </motion.div>
          </AnimatePresence>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="mr-auto">Cancel</AlertDialogCancel>
          <div className="flex gap-2">
            <Button
              disabled={currentStepIndex === 0}
              onClick={handleBack}
              variant="outline"
            >
              Back
            </Button>
            <Button onClick={handleNext}>
              {currentStepIndex === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

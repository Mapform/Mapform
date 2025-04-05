"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@mapform/lib/classnames";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@mapform/ui/components/alert-dialog";
import { Button } from "@mapform/ui/components/button";
import Image from "next/image";

export interface TourStep {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

interface TourGuideProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function TourGuide({
  steps,
  isOpen,
  onClose,
  className,
}: TourGuideProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  // If there are no steps, don't render anything
  if (!steps.length || !currentStep) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className={cn("sm:max-w-md", className)}>
        <AlertDialogHeader>
          {currentStep.imageUrl && (
            <div className="relative mb-4 h-48 w-full overflow-hidden rounded-md">
              <Image
                src={currentStep.imageUrl}
                alt={currentStep.title}
                className="h-full w-full object-cover"
                width={100}
                height={100}
              />
            </div>
          )}
          <AlertDialogTitle>{currentStep.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {currentStep.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
          >
            Back
          </Button>
          <Button variant="outline" onClick={handleSkip}>
            Skip
          </Button>
          <Button onClick={handleNext}>
            {currentStepIndex === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

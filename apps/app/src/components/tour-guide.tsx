"use client";

import * as React from "react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@mapform/ui/components/alert-dialog";
import { Button } from "@mapform/ui/components/button";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import type { StaticImageData } from "next/image";
import Video from "next-video";
import type { Asset } from "next-video/dist/assets.js";

export interface TourStep {
  id: string;
  title: string;
  description: string | React.ReactNode;
  imageUrl?: string | StaticImageData;
  video?: Asset;
}

interface TourGuideProps {
  steps: TourStep[];
  className?: string;
}

export function TourContent({ steps }: TourGuideProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const currentStep = steps[currentStepIndex];

  const resetTour = () => {
    setDirection(1);
    setCurrentStepIndex(0);
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setDirection(1);
      setCurrentStepIndex(currentStepIndex + 1);
    }

    // Once the tour is complete, reset the tour
    if (currentStepIndex === steps.length - 1) {
      resetTour();
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

  if (currentStep.video && currentStep.imageUrl) {
    throw new Error("Cannot have both video and imageUrl");
  }

  if (!currentStep.imageUrl && !currentStep.video) {
    throw new Error("Must have either imageUrl or video");
  }

  return (
    <AlertDialogContent className="max-h-[90vh] w-full max-w-screen-sm overflow-hidden overflow-y-auto">
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
              <div className="text-muted-foreground text-sm">
                Step {currentStepIndex + 1} of {steps.length}
              </div>
              <div className="relative aspect-video overflow-hidden rounded-md">
                {currentStep.imageUrl && (
                  <Image
                    src={currentStep.imageUrl}
                    alt={currentStep.title}
                    className="h-full w-full object-cover"
                    fill
                  />
                )}
                {currentStep.video && (
                  <Video
                    className="size-full"
                    src={currentStep.video}
                    autoPlay
                    muted
                    loop
                    controls={false}
                  />
                )}
              </div>
              <AlertDialogTitle className="pt-2">
                {currentStep.title}
              </AlertDialogTitle>
              <AlertDialogDescription className="prose prose-sm whitespace-pre-wrap">
                {currentStep.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
          </motion.div>
        </AnimatePresence>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel className="mr-auto" onClick={resetTour}>
          Close
        </AlertDialogCancel>
        <div className="flex gap-2">
          <Button
            disabled={currentStepIndex === 0}
            onClick={handleBack}
            variant="outline"
          >
            Back
          </Button>
          {currentStepIndex === steps.length - 1 ? (
            <AlertDialogAction onClick={handleNext}>
              Let&apos;s go
            </AlertDialogAction>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </div>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}

export { AlertDialogTrigger as TourTrigger, AlertDialog as Tour };

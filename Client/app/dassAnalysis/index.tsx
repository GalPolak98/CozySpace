import DassAnalysisScreen from "@/components/monthlyQuestionnaire/DassAnalysisScreen";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function DassAnalysis() {
  const { patientId } = useLocalSearchParams();

  return <DassAnalysisScreen patientId={patientId as string} />;
}

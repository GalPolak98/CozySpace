import React, { useEffect, useState } from "react";
import ThemedView from "@/components/ThemedView";
import ReportsScreen from "../reports";

const PatientReports = () => {
  return (
    <ThemedView className="flex-1">
      <ReportsScreen />
    </ThemedView>
  );
};

export default PatientReports;

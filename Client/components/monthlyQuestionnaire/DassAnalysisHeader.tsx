import { useLanguage } from "@/context/LanguageContext";
import GenericHeader from "../navigation/GenericHeader";
import React from "react";

const DassAnalysisHeader = ({ toggleTheme }: { toggleTheme: () => void }) => {
  const { t } = useLanguage();

  return (
    <GenericHeader
      title={t.dassAnalysis.header}
      toggleTheme={toggleTheme}
      backPath="/(therapist)/home"
    />
  );
};

export default DassAnalysisHeader;

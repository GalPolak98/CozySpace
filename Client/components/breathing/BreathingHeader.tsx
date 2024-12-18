import { useLanguage } from "@/context/LanguageContext";
import GenericHeader from "../navigation/GenericHeader";
import React from "react";

const BreathingHeader = ({ toggleTheme }: { toggleTheme: () => void }) => {
  const { t } = useLanguage();

  return (
    <GenericHeader
      title={t.breathing.title}
      toggleTheme={toggleTheme}
      backPath="/(patient)/home"
    />
  );
};

export default BreathingHeader;

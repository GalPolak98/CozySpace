import { useLanguage } from "@/context/LanguageContext";
import GenericHeader from "../navigation/GenericHeader";
import React from "react";

const RecordingsInfoHeader = ({ toggleTheme }: { toggleTheme: () => void }) => {
  const { t } = useLanguage();

  return (
    <GenericHeader
      title={t.information.recordings}
      toggleTheme={toggleTheme}
      backPath="/(patient)/information"
    />
  );
};

export default RecordingsInfoHeader;

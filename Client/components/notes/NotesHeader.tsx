import { useLanguage } from "@/context/LanguageContext";
import GenericHeader from "../navigation/GenericHeader";
import React from "react";

const NotesHeader = ({ toggleTheme }: { toggleTheme: () => void }) => {
  const { t } = useLanguage();

  return (
    <GenericHeader
      title={t.note.documenting}
      toggleTheme={toggleTheme}
      backPath="/(patient)/home"
    />
  );
};

export default NotesHeader;

import React, { useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import { useLanguage } from "@/context/LanguageContext";
import ThemedText from "@/components/ThemedText";
import CustomButton from "@/components/CustomButton";
import { useDassQuestionnaire } from "@/hooks/useDassQuestionnaire";
import { DassResponse } from "@/types/questionnaire";
import { useUserData } from "@/hooks/useUserData";
import { useTheme } from "../ThemeContext";
import { theme } from "@/styles/Theme";
import { DASS_QUESTIONS } from "@/constants/questionnaire";

interface DassQuestionnaireProps {
  userId: string;
  onComplete: (response: DassResponse) => void;
}

export const DassQuestionnaire: React.FC<{
  userId: string;
  onComplete: () => void;
}> = ({ userId, onComplete }) => {
  const { getGenderedText, t, currentLanguage, isRTL } = useLanguage();
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const { submitResponse } = useDassQuestionnaire(userId);
  const { gender } = useUserData(userId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (Object.keys(answers).length < DASS_QUESTIONS.length) {
      Alert.alert(
        t.errors.error,
        getGenderedText(t.errors.unansweredQuestions, gender as string)
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const response: DassResponse = {
        userId,
        timestamp: new Date().toISOString(),
        answers: Object.entries(answers).map(([questionId, score]) => ({
          questionId: parseInt(questionId),
          score,
        })),
        totalScore: Object.values(answers).reduce(
          (sum, score) => sum + score,
          0
        ),
      };

      await submitResponse(response);
      onComplete();
    } catch (error) {
      Alert.alert(t.errors.error, t.errors.unexpected);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 60,
      }}
    >
      <ThemedText className="text-2xl font-psemibold text-center mb-6">
        {getGenderedText(t.questionnaire.title, gender as string)}
      </ThemedText>
      <ThemedText className="text-lg mb-6" isRTL={isRTL}>
        {currentLanguage === "he"
          ? getGenderedText(t.questionnaire.instruction, gender as string)
          : t.questionnaire.instruction}
      </ThemedText>
      <View className="flex-row justify-around mb-8">
        {[0, 1, 2, 3].map((score) => (
          <View key={score} className="items-center">
            <View
              style={{
                padding: 8,
                minWidth: 60,
                alignItems: "center",
              }}
            >
              <ThemedText className="text-lg font-bold mb-2">
                {isRTL ? 3 - score : score}
              </ThemedText>
              <ThemedText className="text-sm text-center w-20">
                {t.questionnaire.ratings[isRTL ? 3 - score : score]}
              </ThemedText>
            </View>
          </View>
        ))}
      </View>
      {DASS_QUESTIONS.map((question) => (
        <View key={question.id} className="mb-6">
          <ThemedText className="text-lg mb-4" isRTL={isRTL}>
            {currentLanguage === "he"
              ? getGenderedText(question.text.he, gender as string)
              : question.text.en}
          </ThemedText>
          <View className={`flex-row justify-around`}>
            {(isRTL ? [3, 2, 1, 0] : [0, 1, 2, 3]).map((score) => (
              <CustomButton
                key={score}
                title={score.toString()}
                variant={
                  answers[question.id] === score ? "primary" : "secondary"
                }
                handlePress={() =>
                  setAnswers((prev) => ({ ...prev, [question.id]: score }))
                }
                containerStyles={{
                  width: 60,
                  borderWidth: 1,
                  borderColor: theme[currentTheme].border,
                }}
              />
            ))}
          </View>
        </View>
      ))}
      <View>
        <CustomButton
          title={t.common.submit}
          handlePress={handleSubmit}
          variant="primary"
          isLoading={isSubmitting}
          isRTL={isRTL}
          containerStyles={{
            marginHorizontal: 20,
            paddingVertical: 12,
          }}
        />
      </View>
    </ScrollView>
  );
};

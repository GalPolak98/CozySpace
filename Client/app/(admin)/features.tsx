import React, { useState, useEffect } from "react";
import { View, Switch, Alert } from "react-native";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import { featuresService } from "@/services/featuresService";
import Loader from "@/components/Loader";
import { IFeatures } from "@/types/features";

type IFeaturesWithoutDate = Omit<IFeatures, "updatedAt">;

export default function FeaturesScreen() {
  const [features, setFeatures] = useState<IFeatures>({
    chat: true,
    guidedNote: true,
    directNote: true,
    breathingExercises: true,
    anxietyDataViewer: true,
    recordings: true,
    updatedAt: new Date(),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [updatingFeatures, setUpdatingFeatures] = useState<
    Record<keyof IFeaturesWithoutDate, boolean>
  >({
    chat: false,
    guidedNote: false,
    directNote: false,
    breathingExercises: false,
    anxietyDataViewer: false,
    recordings: false,
  });

  const featuresList: { key: keyof IFeaturesWithoutDate; label: string }[] = [
    { key: "chat", label: "Chat" },
    { key: "guidedNote", label: "Guided Note" },
    { key: "directNote", label: "Direct Note" },
    { key: "breathingExercises", label: "Breathing Exercises" },
    {
      key: "anxietyDataViewer",
      label: "Data From Sensors (Development only) ",
    },
    { key: "recordings", label: "Voice Recordings" },
  ];
  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      const data = await featuresService.getFeatures();
      if (data) {
        setFeatures(data);
      }
    } catch (error) {
      console.error("Error loading features:", error);
      Alert.alert("Error", "Failed to load features");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFeature = async (feature: keyof IFeatures) => {
    try {
      setUpdatingFeatures((prev) => ({ ...prev, [feature]: true }));
      const updatedFeatures = {
        ...features,
        [feature]: !features[feature],
      };

      await featuresService.updateFeatures(updatedFeatures);
      setFeatures(updatedFeatures);
    } catch (error) {
      setFeatures((prevFeatures) => ({
        ...prevFeatures,
        [feature]: !prevFeatures[feature],
      }));
      console.error("Error updating feature:", error);
      Alert.alert("Error", "Failed to update feature");
    } finally {
      setUpdatingFeatures((prev) => ({ ...prev, [feature]: false }));
    }
  };

  if (isLoading) {
    return <Loader isLoading={true} />;
  }

  return (
    <ThemedView className="flex-1 p-4">
      <ThemedText className="text-xl font-bold mb-6">
        Feature Management
      </ThemedText>

      {featuresList.map((feature) => (
        <View
          key={feature.key}
          className="flex-row justify-between items-center py-4 border-b border-gray-200"
        >
          <ThemedText className="text-lg">{feature.label}</ThemedText>
          <Switch
            value={Boolean(features[feature.key])}
            onValueChange={() => toggleFeature(feature.key)}
            disabled={updatingFeatures[feature.key]}
          />
        </View>
      ))}
    </ThemedView>
  );
}

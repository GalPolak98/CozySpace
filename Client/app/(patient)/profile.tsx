import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useTheme } from "@/components/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { theme } from "@/styles/Theme";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import CustomButton from "@/components/CustomButton";
import { FeatureOption } from "@/components/onboarding/FeatureOption";
import { MusicSelectionSection } from "@/components/onboarding/MusicSelectionSection";
import { TherapistSelectionSection } from "@/components/onboarding/TherapistSelectionSection";
import useAuth from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { musicData } from "@/types/musicData";
import { userService } from "@/services/userService";

interface DataShareOptions {
  anxietyTracking: boolean;
  personalDocumentation: boolean;
}

interface Profile {
  personalInfo: {
    email: string;
    gender: string;
  };
  therapistInfo: {
    selectedTherapistId: string | null;
    dataSharing: DataShareOptions;
  };
  toolsPreferences: {
    smartJewelry: {
      enabled: boolean;
      vibrationAlerts: boolean;
    };
    musicTherapy: {
      enabled: boolean;
      selectedTrackId: string | null;
    };
  };
}

const ProfileScreen = () => {
  const { theme: currentTheme } = useTheme();
  const { t, isRTL, getGenderedText } = useLanguage();
  const colors = theme[currentTheme];
  const userId = useAuth();

  const {
    gender,
    firstName,
    lastName,
    isLoading: userDataLoading,
    refresh: refreshUserData,
    error: userDataError,
  } = useUserData(userId);

  // State management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(
    null
  );
  const [dataShareOptions, setDataShareOptions] = useState<DataShareOptions>({
    anxietyTracking: false,
    personalDocumentation: false,
  });
  const [useSmartJewelry, setUseSmartJewelry] = useState(false);
  const [enableVibrations, setEnableVibrations] = useState(false);
  const [playMusic, setPlayMusic] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

  useEffect(() => {
    if (userDataError) {
      Alert.alert(t.errors.error, t.errors.unexpected);
    }
  }, [userDataError]);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      if (!userId) return;
      const profileData = await userService.getUserProfile(userId);

      if (profileData) {
        const { therapistInfo, toolsPreferences } = profileData;
        setSelectedTherapist(therapistInfo.selectedTherapistId);
        setDataShareOptions(therapistInfo.dataSharing);
        setUseSmartJewelry(toolsPreferences.smartJewelry.enabled);
        setEnableVibrations(
          toolsPreferences.smartJewelry.enabled
            ? toolsPreferences.smartJewelry.vibrationAlerts
            : false
        );
        setPlayMusic(toolsPreferences.musicTherapy.enabled);

        if (
          toolsPreferences.musicTherapy.enabled &&
          toolsPreferences.musicTherapy.selectedTrackId
        ) {
          const track = musicData.find(
            (t) => t.id === toolsPreferences.musicTherapy.selectedTrackId
          );
          if (track) {
            setSelectedMusic(track.category);
            setSelectedTrack(track.id);
          }
        }
        setProfile(profileData);
      }
    } catch (error) {
      Alert.alert(t.errors.error, t.errors.loadError);
    } finally {
      setLoading(false);
    }
  };

  // Feature toggle handlers
  const handleSmartJewelryToggle = () => {
    setUseSmartJewelry(!useSmartJewelry);
    if (useSmartJewelry) setEnableVibrations(false);
  };

  const handleMusicToggle = () => {
    setPlayMusic(!playMusic);
    if (playMusic) {
      setSelectedMusic(null);
      setSelectedTrack(null);
    }
  };

  const validateSettings = (): boolean => {
    if (playMusic && !selectedTrack) {
      Alert.alert(t.errors.error, t.registration.selectTrack);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateSettings() || !userId) return;

    try {
      setSaving(true);
      await userService.updateUserPreferences(userId, {
        therapistInfo: {
          selectedTherapistId: selectedTherapist,
          dataSharing: dataShareOptions,
        },
        toolsPreferences: {
          smartJewelry: {
            enabled: useSmartJewelry,
            vibrationAlerts: enableVibrations,
          },
          musicTherapy: {
            enabled: playMusic,
            selectedTrackId: selectedTrack,
          },
        },
      });

      await Promise.all([refreshUserData(), fetchProfile()]);
      Alert.alert(t.success.updated, t.profile.saveSuccess);
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert(t.errors.error, t.profile.saveError);
    } finally {
      setSaving(false);
    }
  };

  if (loading || userDataLoading || !profile) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  return (
    <ScrollView>
      <ThemedView className="flex-1 p-4">
        <View className="space-y-6">
          {/* Personal Information Section */}
          <ThemedView variant="surface" className="p-4 rounded-xl mb-4">
            <ThemedText
              variant="default"
              className="text-lg font-pbold mb-4"
              isRTL={isRTL}
            >
              {t.profile.personalInfo}
            </ThemedText>

            <View className="space-y-2">
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row" }}>
                <ThemedText
                  variant="secondary"
                  style={{
                    marginRight: isRTL ? 0 : 8,
                    marginLeft: isRTL ? 8 : 0,
                  }}
                  isRTL={isRTL}
                >
                  {t.profile.fullName}:
                </ThemedText>
                <ThemedText variant="default" isRTL={isRTL}>
                  {firstName} {lastName}
                </ThemedText>
              </View>

              <View style={{ flexDirection: isRTL ? "row-reverse" : "row" }}>
                <ThemedText
                  variant="secondary"
                  style={{
                    marginRight: isRTL ? 0 : 8,
                    marginLeft: isRTL ? 8 : 0,
                  }}
                  isRTL={isRTL}
                >
                  {t.auth.emailPlaceholder}:
                </ThemedText>
                <ThemedText variant="default" isRTL={isRTL}>
                  {profile.personalInfo.email}
                </ThemedText>
              </View>

              <View style={{ flexDirection: isRTL ? "row-reverse" : "row" }}>
                <ThemedText
                  variant="secondary"
                  style={{
                    marginRight: isRTL ? 0 : 8,
                    marginLeft: isRTL ? 8 : 0,
                  }}
                  isRTL={isRTL}
                >
                  {t.profile.gender}:
                </ThemedText>
                <ThemedText variant="default" isRTL={isRTL}>
                  {profile.personalInfo.gender === "male"
                    ? t.personalInfo.male
                    : t.personalInfo.female}
                </ThemedText>
              </View>
            </View>
          </ThemedView>

          {/* Therapist Selection Section */}
          <ThemedView variant="surface" className="p-4 rounded-xl mb-4">
            <ThemedText
              variant="default"
              className="text-lg font-pbold mb-4"
              isRTL={isRTL}
            >
              {t.therapistSelection.dropdownPlaceholder}
            </ThemedText>

            <TherapistSelectionSection
              selectedTherapist={selectedTherapist}
              setSelectedTherapist={setSelectedTherapist}
              dataShareOptions={dataShareOptions}
              setDataShareOptions={setDataShareOptions}
            />
          </ThemedView>

          {/* Preferences Section */}
          <ThemedView variant="surface" className="p-4 rounded-xl mb-4">
            <ThemedText
              variant="default"
              className="text-lg font-pbold mb-4"
              isRTL={isRTL}
            >
              {t.profile.preferences}
            </ThemedText>

            {/* Smart Jewelry Section */}
            <View className="mb-6">
              <ThemedText
                variant="default"
                className="text-base font-pmedium mb-3"
                isRTL={isRTL}
              >
                {t.customization.smartJewelryTitle}
              </ThemedText>

              <FeatureOption
                title={t.customization.enableJewelry}
                description={t.customization.jewelryDescription}
                isEnabled={useSmartJewelry}
                onToggle={handleSmartJewelryToggle}
                iconName={useSmartJewelry ? "bluetooth" : "bluetooth-outline"}
                isRTL={isRTL}
              />

              {useSmartJewelry && (
                <FeatureOption
                  title={t.customization.vibrationAlerts}
                  description={t.customization.vibrationDescription}
                  isEnabled={enableVibrations}
                  onToggle={() => setEnableVibrations(!enableVibrations)}
                  iconName={enableVibrations ? "pulse" : "pulse-outline"}
                  isRTL={isRTL}
                />
              )}
            </View>

            {/* Music Therapy Section */}
            <View className="mb-6">
              <ThemedText
                variant="default"
                className="text-base font-pmedium mb-3"
                isRTL={isRTL}
              >
                {t.customization.musicTherapyTitle}
              </ThemedText>

              <FeatureOption
                title={t.customization.enableMusic}
                description={t.customization.musicDescription}
                isEnabled={playMusic}
                onToggle={handleMusicToggle}
                iconName={playMusic ? "musical-notes" : "musical-notes-outline"}
                isRTL={isRTL}
              />

              {playMusic && (
                <View className="space-y-4 mt-4">
                  <MusicSelectionSection
                    selectedMusic={selectedMusic}
                    setSelectedMusic={setSelectedMusic}
                    selectedTrack={selectedTrack}
                    setSelectedTrack={setSelectedTrack}
                    isRTL={isRTL}
                  />
                </View>
              )}
            </View>
          </ThemedView>

          {/* Save Button */}
          <View className="mb-8">
            <CustomButton
              title={getGenderedText(t.profile.save, gender as string)}
              handlePress={handleSave}
              isLoading={saving}
              variant="primary"
              isRTL={isRTL}
              containerStyles=""
            />
          </View>
        </View>
      </ThemedView>
    </ScrollView>
  );
};

export default ProfileScreen;

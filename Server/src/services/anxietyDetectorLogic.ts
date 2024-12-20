// services/AnxietyDetector.ts
import { AnxietyAnalysis, SensorData, UserState } from "../models/sensorTypes";

export class AnxietyDetector {
  // HRV Constants (in milliseconds)
  private readonly HRV_MIN = 20;       // Minimum normal HRV
  private readonly HRV_MAX = 70;       // Maximum normal HRV
  private readonly HRV_BASELINE = 45;  // Average baseline HRV
  private readonly HRV_ANXIETY_THRESHOLD = 30; // Below this indicates potential anxiety

  // EDA Constants (in microSiemens, µS)
  private readonly EDA_MIN = 1.0;      // Minimum normal EDA
  private readonly EDA_MAX = 20.0;     // Maximum normal EDA
  private readonly EDA_BASELINE = 5.0; // Average baseline EDA
  private readonly EDA_ANXIETY_THRESHOLD = 12.0; // Above this indicates potential anxiety

  // Analysis settings
  private readonly CONSECUTIVE_READINGS = 3;  // Readings needed to confirm anxiety
  private readonly HRV_WEIGHT = 0.6;         // HRV has higher weight in anxiety detection
  private readonly EDA_WEIGHT = 0.4;         // EDA has lower weight

  public analyzeAnxiety(sensorData: SensorData, userState: UserState): AnxietyAnalysis {
    const currentHRV = sensorData.hrvData.value;
    const currentEDA = sensorData.edaData.value;
    
    // Normalize values to 0-1 range for easier comparison
    const hrvNormalized = this.normalizeHRV(currentHRV);
    const edaNormalized = this.normalizeEDA(currentEDA);
    
    // Calculate anxiety indicators
    const hrvAnxietyScore = this.calculateHRVAnxietyScore(currentHRV);
    const edaAnxietyScore = this.calculateEDAAnxietyScore(currentEDA);
    
    // Combined weighted anxiety score
    const anxietyScore = (hrvAnxietyScore * this.HRV_WEIGHT) + 
                        (edaAnxietyScore * this.EDA_WEIGHT);

    // Determine if currently showing anxiety signs
    const isCurrentlyAnxious = anxietyScore > 0.7; // Threshold for anxiety detection

    // Update consecutive readings
    let consecutiveReadings = isCurrentlyAnxious ? 
      userState.consecutiveAnxiousReadings + 1 : 0;

    // Only consider it confirmed anxiety after multiple readings
    const isAnxious = consecutiveReadings >= this.CONSECUTIVE_READINGS;

    // Calculate confidence based on multiple factors
    const confidence = this.calculateConfidence(
      sensorData,
      hrvAnxietyScore,
      edaAnxietyScore,
      consecutiveReadings
    );

    // Generate detailed triggers
    const triggers = this.generateTriggers(
      currentHRV,
      currentEDA,
      hrvAnxietyScore,
      edaAnxietyScore,
      consecutiveReadings
    );

    this.logAnalysis(
      sensorData.timestamp,
      currentHRV,
      currentEDA,
      hrvAnxietyScore,
      edaAnxietyScore,
      anxietyScore,
      consecutiveReadings,
      isAnxious,
      confidence
    );

    return {
      userId: sensorData.userId,
      isAnxious,
      confidence,
      timestamp: sensorData.timestamp,
      triggers: triggers.length > 0 ? triggers : undefined
    };
  }

  private normalizeHRV(value: number): number {
    return Math.max(0, Math.min(1, (value - this.HRV_MIN) / (this.HRV_MAX - this.HRV_MIN)));
  }

  private normalizeEDA(value: number): number {
    return Math.max(0, Math.min(1, (value - this.EDA_MIN) / (this.EDA_MAX - this.EDA_MIN)));
  }

  private calculateHRVAnxietyScore(hrv: number): number {
    // Lower HRV indicates higher anxiety
    if (hrv >= this.HRV_BASELINE) return 0;
    if (hrv <= this.HRV_ANXIETY_THRESHOLD) return 1;
    
    return (this.HRV_BASELINE - hrv) / (this.HRV_BASELINE - this.HRV_ANXIETY_THRESHOLD);
  }

  private calculateEDAAnxietyScore(eda: number): number {
    // Higher EDA indicates higher anxiety
    if (eda <= this.EDA_BASELINE) return 0;
    if (eda >= this.EDA_ANXIETY_THRESHOLD) return 1;
    
    return (eda - this.EDA_BASELINE) / (this.EDA_ANXIETY_THRESHOLD - this.EDA_BASELINE);
  }

  private calculateConfidence(
    sensorData: SensorData,
    hrvScore: number,
    edaScore: number,
    consecutiveReadings: number
  ): number {
    // Signal quality factor (0-1)
    const signalQuality = (sensorData.hrvData.quality + sensorData.edaData.quality) / 200;
    
    // Readings consistency factor (0-1)
    const readingsConsistency = Math.min(consecutiveReadings / this.CONSECUTIVE_READINGS, 1);
    
    // Sensor agreement factor (0-1)
    const sensorAgreement = 1 - Math.abs(hrvScore - edaScore);
    
    // Combined confidence calculation
    return (signalQuality * 0.3) + // 30% weight on signal quality
           (readingsConsistency * 0.4) + // 40% weight on consistency
           (sensorAgreement * 0.3); // 30% weight on sensor agreement
  }

  private generateTriggers(
    hrv: number,
    eda: number,
    hrvScore: number,
    edaScore: number,
    consecutiveReadings: number
  ): string[] {
    const triggers: string[] = [];
    
    if (hrvScore > 0.5) {
      const hrvDeviation = ((this.HRV_BASELINE - hrv) / this.HRV_BASELINE * 100).toFixed(1);
      triggers.push(`Low HRV detected: ${hrv.toFixed(1)}ms (${hrvDeviation}% below baseline)`);
    }
    
    if (edaScore > 0.5) {
      const edaIncrease = ((eda - this.EDA_BASELINE) / this.EDA_BASELINE * 100).toFixed(1);
      triggers.push(`Elevated EDA detected: ${eda.toFixed(2)}µS (${edaIncrease}% above baseline)`);
    }

    if (consecutiveReadings >= this.CONSECUTIVE_READINGS) {
      triggers.push(`Pattern sustained for ${consecutiveReadings} consecutive readings`);
    }

    return triggers;
  }

  private logAnalysis(
    timestamp: number,
    hrv: number,
    eda: number,
    hrvScore: number,
    edaScore: number,
    anxietyScore: number,
    consecutiveReadings: number,
    isAnxious: boolean,
    confidence: number
  ): void {
    console.log('[Anxiety Analysis]', {
      timestamp: new Date(timestamp).toISOString(),
      metrics: {
        hrv: {
          value: `${hrv.toFixed(1)}ms`,
          anxietyScore: (hrvScore * 100).toFixed(1) + '%',
          status: hrvScore > 0.5 ? 'ALERT' : 'normal'
        },
        eda: {
          value: `${eda.toFixed(2)}µS`,
          anxietyScore: (edaScore * 100).toFixed(1) + '%',
          status: edaScore > 0.5 ? 'ALERT' : 'normal'
        }
      },
      analysis: {
        overallAnxietyScore: (anxietyScore * 100).toFixed(1) + '%',
        consecutiveReadings,
        isAnxious,
        confidence: (confidence * 100).toFixed(1) + '%'
      }
    });
  }
}

export const anxietyDetector = new AnxietyDetector();
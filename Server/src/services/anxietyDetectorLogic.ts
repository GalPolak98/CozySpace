// * AnxietyDetector class implements anxiety detection logic based on physiological signals:
//  * 
//  * 1. HRV (Heart Rate Variability):
//  *    - Normal range: 20-70ms
//  *    - Baseline (typical relaxed state): 45ms
//  *    - Anxiety threshold: 30ms (below this suggests anxiety)
//  *    - Severe anxiety: 25ms or below
//  *    - Lower HRV indicates higher stress/anxiety
//  * 
//  * 2. EDA (Electrodermal Activity/Skin Conductance):
//  *    - Normal range: 1-20 microSiemens (µS)
//  *    - Baseline (typical relaxed state): 5µS
//  *    - Anxiety threshold: 12µS (above this suggests anxiety)
//  *    - Severe anxiety: 15µS or above
//  *    - Higher EDA indicates higher stress/anxiety
//  * 
//  * Anxiety Detection Process:
//  * 1. Analyze individual metrics (HRV and EDA)
//  * 2. Check rate of change (sudden changes can indicate onset of anxiety)
//  * 3. Combine metrics with weighted importance
//  * 4. Verify pattern persistence (multiple consecutive readings)
//  * 5. Calculate confidence based on signal quality and sensor agreement
//  * 
//  confidence represents how sure the system is about its anxiety detection.

import { AnxietyAnalysis, SensorData, UserState } from "../models/sensorTypes";

export class AnxietyDetector {
  // HRV Constants (in milliseconds)
  private readonly HRV_MIN = 20;
  private readonly HRV_MAX = 70;
  private readonly HRV_BASELINE = 45;
  private readonly HRV_ANXIETY_THRESHOLD = 30;
  private readonly HRV_SEVERE_ANXIETY = 25;
  
  // EDA Constants (in microSiemens, µS)
  private readonly EDA_MIN = 1.0;
  private readonly EDA_MAX = 20.0;
  private readonly EDA_BASELINE = 5.0;
  private readonly EDA_ANXIETY_THRESHOLD = 12.0;
  private readonly EDA_SEVERE_ANXIETY = 15.0;

  // Analysis settings
  private readonly CONSECUTIVE_READINGS = 3;
  private readonly HRV_WEIGHT = 0.6;
  private readonly EDA_WEIGHT = 0.4;
  
  // Rate of change thresholds
  private readonly HRV_RAPID_CHANGE = 5; // ms per reading
  private readonly EDA_RAPID_CHANGE = 1.5; // µS per reading

  public analyzeAnxiety(sensorData: SensorData, userState: UserState): AnxietyAnalysis {
    const currentHRV = sensorData.hrvData.value;
    const currentEDA = sensorData.edaData.value;
    const previousReading = userState.lastReading;
    
    const rateOfChange = previousReading ? {
      hrv: Math.abs((currentHRV - previousReading.hrvData.value) / 
           ((sensorData.timestamp - previousReading.timestamp) / 1000)),
      eda: Math.abs((currentEDA - previousReading.edaData.value) / 
           ((sensorData.timestamp - previousReading.timestamp) / 1000))
    } : null;

    const hrvAnxietyScore = this.calculateHRVAnxietyScore(currentHRV);
    const edaAnxietyScore = this.calculateEDAAnxietyScore(currentEDA);
    const rateOfChangeScore = this.calculateRateOfChangeScore(rateOfChange);
    
    const anxietyScore = (
      (hrvAnxietyScore * this.HRV_WEIGHT) +
      (edaAnxietyScore * this.EDA_WEIGHT) +
      (rateOfChangeScore * 0.2)
    ) / 1.2;

    // Determine if current reading shows anxiety
    const ANXIETY_THRESHOLD = 0.65;
    const isCurrentlyAnxious = anxietyScore > ANXIETY_THRESHOLD;

    // IMPORTANT: Get the current consecutive count from user state
    const consecutiveReadings = isCurrentlyAnxious ? 
      (userState.consecutiveAnxiousReadings + 1) : 0;

    // Update the user state with new count BEFORE checking if anxiety is confirmed
    userState.consecutiveAnxiousReadings = consecutiveReadings;

    // Check if we have enough consecutive readings to confirm anxiety
    const isAnxious = consecutiveReadings >= this.CONSECUTIVE_READINGS;

    // Log for debugging
    console.log('[Anxiety Debug]', {
      timestamp: new Date(sensorData.timestamp).toISOString(),
      currentValues: { 
        hrv: `${currentHRV.toFixed(1)}ms`,
        eda: `${currentEDA.toFixed(2)}µS` 
      },
      scores: {
        hrv: (hrvAnxietyScore * 100).toFixed(1) + '%',
        eda: (edaAnxietyScore * 100).toFixed(1) + '%',
        combined: (anxietyScore * 100).toFixed(1) + '%'
      },
      anxietyState: {
        threshold: ANXIETY_THRESHOLD,
        isCurrentlyAnxious,
        previousCount: userState.consecutiveAnxiousReadings,
        newCount: consecutiveReadings,
        isConfirmed: isAnxious,
        readingsNeeded: this.CONSECUTIVE_READINGS,
        readingsRemaining: Math.max(0, this.CONSECUTIVE_READINGS - consecutiveReadings)
      },
      confidence: (this.calculateConfidence(
        sensorData,
        hrvAnxietyScore,
        edaAnxietyScore,
        rateOfChangeScore,
        consecutiveReadings
      ) * 100).toFixed(1) + '%'
    });

    // Store this reading for next time
    userState.lastReading = sensorData;

    const confidence = this.calculateConfidence(
      sensorData,
      hrvAnxietyScore,
      edaAnxietyScore,
      rateOfChangeScore,
      consecutiveReadings
    );

    const triggers = this.generateTriggers(
      currentHRV,
      currentEDA,
      rateOfChange,
      hrvAnxietyScore,
      edaAnxietyScore,
      consecutiveReadings,
      isCurrentlyAnxious
    );

    return {
      userId: sensorData.userId,
      isAnxious,
      confidence,
      timestamp: sensorData.timestamp,
      triggers: triggers.length > 0 ? triggers : undefined,
      severity: this.calculateAnxietySeverity(anxietyScore),
      anxietyScore,
      consecutiveReadings,
      metrics: {
        hrv: {
          value: currentHRV,
          score: hrvAnxietyScore,
          status: hrvAnxietyScore > 0.5 ? 'ALERT' : 'normal'
        },
        eda: {
          value: currentEDA,
          score: edaAnxietyScore,
          status: edaAnxietyScore > 0.5 ? 'ALERT' : 'normal'
        },
        rateOfChange: rateOfChange ? {
          hrv: rateOfChange.hrv,
          eda: rateOfChange.eda
        } : undefined
      }
    };
  }

  private calculateRateOfChangeScore(rateOfChange: { hrv: number; eda: number; } | null): number {
    if (!rateOfChange) return 0;

    const hrvRateScore = Math.min(rateOfChange.hrv / this.HRV_RAPID_CHANGE, 1);
    const edaRateScore = Math.min(rateOfChange.eda / this.EDA_RAPID_CHANGE, 1);
    
    return (hrvRateScore + edaRateScore) / 2;
  }

  private calculateHRVAnxietyScore(hrv: number): number {
    if (hrv >= this.HRV_BASELINE) return 0;
    if (hrv <= this.HRV_SEVERE_ANXIETY) return 1;
    
    if (hrv <= this.HRV_ANXIETY_THRESHOLD) {
      // Enhanced scoring for severe anxiety range
      return 0.7 + (0.3 * (this.HRV_ANXIETY_THRESHOLD - hrv) / 
                    (this.HRV_ANXIETY_THRESHOLD - this.HRV_SEVERE_ANXIETY));
    }
    
    // Normal anxiety range
    return (this.HRV_BASELINE - hrv) / (this.HRV_BASELINE - this.HRV_ANXIETY_THRESHOLD) * 0.7;
  }

  private calculateEDAAnxietyScore(eda: number): number {
    if (eda <= this.EDA_BASELINE) return 0;
    if (eda >= this.EDA_SEVERE_ANXIETY) return 1;
    
    if (eda >= this.EDA_ANXIETY_THRESHOLD) {
      // Enhanced scoring for severe anxiety range
      return 0.7 + (0.3 * (eda - this.EDA_ANXIETY_THRESHOLD) / 
                    (this.EDA_SEVERE_ANXIETY - this.EDA_ANXIETY_THRESHOLD));
    }
    
    // Normal anxiety range
    return (eda - this.EDA_BASELINE) / (this.EDA_ANXIETY_THRESHOLD - this.EDA_BASELINE) * 0.7;
  }

  private calculateConfidence(
    sensorData: SensorData,
    hrvScore: number,
    edaScore: number,
    rateOfChangeScore: number,
    consecutiveReadings: number
  ): number {
    // Signal quality factor (0-1)
    const signalQuality = (sensorData.hrvData.quality + sensorData.edaData.quality) / 200;
    
    // Readings consistency factor (0-1)
    const readingsConsistency = Math.min(consecutiveReadings / this.CONSECUTIVE_READINGS, 1);
    
    // Sensor agreement factor (0-1)
    const sensorAgreement = 1 - Math.abs(hrvScore - edaScore);
    
    // Rate of change impact (0-1)
    const rateOfChangeImpact = 1 - (rateOfChangeScore * 0.3); // Lower confidence for very rapid changes
    
    // Combined confidence calculation with weighted factors
    return (
      (signalQuality * 0.3) +          // 30% weight on signal quality
      (readingsConsistency * 0.3) +    // 30% weight on consistency
      (sensorAgreement * 0.2) +        // 20% weight on sensor agreement
      (rateOfChangeImpact * 0.2)       // 20% weight on rate of change stability
    );
  }

  private calculateAnxietySeverity(anxietyScore: number): 'mild' | 'moderate' | 'severe' {
    if (anxietyScore >= 0.8) return 'severe';
    if (anxietyScore >= 0.7) return 'moderate';
    return 'mild';
  }

  private generateTriggers(
    hrv: number,
    eda: number,
    rateOfChange: { hrv: number; eda: number; } | null,
    hrvScore: number,
    edaScore: number,
    consecutiveReadings: number,
    isCurrentlyAnxious: boolean
  ): string[] {
    const triggers: string[] = [];
    
    if (hrvScore > 0.5) {
      const hrvDeviation = ((this.HRV_BASELINE - hrv) / this.HRV_BASELINE * 100).toFixed(1);
      triggers.push(`Low HRV detected: ${hrv.toFixed(1)}ms (${hrvDeviation}% below baseline)`);
      
      if (hrvScore > 0.8) {
        triggers.push('Severely reduced HRV indicating high stress');
      }
    }
    
    if (edaScore > 0.5) {
      const edaIncrease = ((eda - this.EDA_BASELINE) / this.EDA_BASELINE * 100).toFixed(1);
      triggers.push(`Elevated EDA detected: ${eda.toFixed(2)}µS (${edaIncrease}% above baseline)`);
      
      if (edaScore > 0.8) {
        triggers.push('Significantly elevated skin conductance');
      }
    }

    // Add information about consecutive readings
    if (isCurrentlyAnxious) {
      triggers.push(`Anxiety pattern detected for ${consecutiveReadings} consecutive reading${consecutiveReadings > 1 ? 's' : ''}`);
    }

    return triggers;
  }

  private logAnalysis(data: {
    timestamp: number;
    currentHRV: number;
    currentEDA: number;
    rateOfChange: { hrv: number; eda: number; } | null;
    hrvAnxietyScore: number;
    edaAnxietyScore: number;
    anxietyScore: number;
    consecutiveReadings: number;
    isAnxious: boolean;
    confidence: number;
  }): void {
    console.log('[Anxiety Analysis]', {
      timestamp: new Date(data.timestamp).toISOString(),
      metrics: {
        hrv: {
          value: `${data.currentHRV.toFixed(1)}ms`,
          anxietyScore: (data.hrvAnxietyScore * 100).toFixed(1) + '%',
          status: data.hrvAnxietyScore > 0.5 ? 'ALERT' : 'normal',
          rateOfChange: data.rateOfChange ? 
            `${data.rateOfChange.hrv.toFixed(2)}ms/s` : 'N/A'
        },
        eda: {
          value: `${data.currentEDA.toFixed(2)}µS`,
          anxietyScore: (data.edaAnxietyScore * 100).toFixed(1) + '%',
          status: data.edaAnxietyScore > 0.5 ? 'ALERT' : 'normal',
          rateOfChange: data.rateOfChange ? 
            `${data.rateOfChange.eda.toFixed(2)}µS/s` : 'N/A'
        }
      },
      analysis: {
        overallAnxietyScore: (data.anxietyScore * 100).toFixed(1) + '%',
        consecutiveReadings: data.consecutiveReadings,
        isAnxious: data.isAnxious,
        confidence: (data.confidence * 100).toFixed(1) + '%'
      }
    });
  }
}

export const anxietyDetector = new AnxietyDetector();
export interface Station {
  id: string;
  name: string;
  code: string;
  zone: string;
  type: 'industrial' | 'transit_hub' | 'power_sector' | 'agricultural_border' | 'commercial_hub' | 'residential';
  lat: number;
  lng: number;
  elevationMeters: number;
  status: 'online' | 'degraded' | 'offline';
  sensorFirmware: string;
  lastPing: string;
}

export interface TelemetryRecord {
  id: string;
  stationId: string;
  timestamp: string;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
  nh3: number;
  voc: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windDirectionCompass: string;
  pressure: number;
  pblHeight: number;
  aqi: number;
  dominantPollutant: string;
  category: string;
  emergencyLevel: string;
}

export interface SourceContribution {
  source: string;
  percentage: number;
  confidence: number;
  color: string;
  chemicalSignatures: string[];
  mitigation: string;
}

export interface MLApportionmentAnalysis {
  primaryCause: string;
  primaryPercentage: number;
  sources: SourceContribution[];
  polarOrigin: {
    direction: string;
    angleDeg: number;
    windSpeed: number;
    distanceKmEst: number;
    probableZone: string;
  };
  atmosphericStability: string;
  mlModelDiagnostics: {
    algorithm: string;
    chemicalRatios: {
      ratio: string;
      value: number;
      baseline: number;
      interpretation: string;
    }[];
    anomalyScore: number;
    sourceConfidence: number;
  };
  violations: {
    standard: string;
    limit: number;
    measured: number;
    unit: string;
    severity: 'exceeded' | 'critical';
  }[];
  aiForensicNarrative: string;
  aiEnforcementRecommendations: string[];
  station?: Station;
}

export interface TargetAuthorityConfig {
  name: string;
  acronym: string;
  department: string;
  jurisdiction: string;
  officialEmail: string;
  legalFramework: string;
  leadOfficer: string;
}

export interface FormalReport {
  reportId: string;
  generatedAt: string;
  targetAuthority: TargetAuthorityConfig;
  stationName: string;
  stationCode: string;
  zone: string;
  telemetrySnapshot: {
    aqi: number;
    category: string;
    emergencyLevel: string;
    pm25: number;
    pm10: number;
    no2: number;
    so2: number;
    co: number;
    o3: number;
    voc: number;
    wind: string;
    temperature: string;
    humidity: string;
    pblHeight: string;
  };
  mlApportionment: {
    primaryCause: string;
    primaryPercentage: number;
    originSector: string;
    atmosphericTrapping: string;
    breakdown: SourceContribution[];
    confidenceScore: number;
    algorithm: string;
  };
  forensicDiagnosis: string;
  violations: {
    standard: string;
    limit: number;
    measured: number;
    unit: string;
    severity: 'exceeded' | 'critical';
  }[];
  legalClauses: string[];
  formalDirectives: {
    directive: string;
    targetEntity: string;
    deadlineHours: number;
    penaltyClause: string;
  }[];
  digitalSignature: {
    signedBy: string;
    algorithm: string;
    hash: string;
    securityToken: string;
  };
  status: string;
}

export interface DispatchRecord {
  dispatchId: string;
  reportId: string;
  timestamp: string;
  recipientBody: string;
  recipientEmail: string;
  transmissionMethod: string;
  deliveryStatus: string;
  ackNumber: string;
  stationName: string;
  aqi: number;
  dominantCause: string;
  emergencyLevel: string;
  fullReport: FormalReport;
}

export interface LoopExecutionLog {
  id: string;
  timestamp: string;
  stationName: string;
  aqi: number;
  dominantCause: string;
  actionTaken: 'Dispatched Formal Enforcement Notice' | 'Audit Recorded (Below Threshold)' | 'Model Calibration Verified';
  status: 'success' | 'alert' | 'warning';
}

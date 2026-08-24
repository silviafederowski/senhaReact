import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

const ENVIRONMENT_LABELS: Record<ExecutionEnvironment, string> = {
  [ExecutionEnvironment.StoreClient]: 'Expo Go',
  [ExecutionEnvironment.Standalone]: 'app nativo (standalone)',
  [ExecutionEnvironment.Bare]: 'build nativo (bare)',
};

export function describeEnvironment(): string {
  const envLabel = ENVIRONMENT_LABELS[Constants.executionEnvironment] ?? 'ambiente desconhecido';
  const platformLabel = Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Web';
  const sdkVersion = Constants.expoConfig?.sdkVersion;

  const lines = [`Ambiente: ${envLabel}`, `Plataforma: ${platformLabel}`];
  if (sdkVersion) lines.push(`SDK do Expo: ${sdkVersion}`);
  return lines.join('\n');
}

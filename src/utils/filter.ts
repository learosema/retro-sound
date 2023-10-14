export function createFilter(audioContext: AudioContext, type: BiquadFilterType, frequency: number, Q?: number) {
  const filter = audioContext.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = frequency;
  if (typeof Q !== 'undefined') {
    filter.Q.value = Q;
  }
  return filter;
}

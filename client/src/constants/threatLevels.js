/**
 * SAFEAI Personal Safety Companion Constants
 * Threat Levels Configurations
 */

export const THREAT_LEVELS = {
  SAFE: {
    name: 'Safe',
    range: [0, 10],
    colorClass: 'text-emerald-500 bg-emerald-950/10 border-emerald-500/20',
    advice: 'All systems green. SAFEAI is actively monitoring your location.',
    action: 'Continue monitoring. Keep safety mode active in new areas.'
  },
  LOW: {
    name: 'Low',
    range: [11, 30],
    colorClass: 'text-blue-500 bg-blue-950/10 border-blue-500/20',
    advice: 'System monitoring. Night time or minor speed variables detected.',
    action: 'Stay alert. Check in with a trusted contact.'
  },
  MEDIUM: {
    name: 'Medium',
    range: [31, 60],
    colorClass: 'text-amber-500 bg-amber-950/10 border-amber-500/20',
    advice: 'Caution: Elevating indicators. Monitor surrounding safety.',
    action: 'Avoid poorly lit areas. Keep safety companion active.'
  },
  HIGH: {
    name: 'High',
    range: [61, 85],
    colorClass: 'text-red-500 bg-red-950/10 border-red-500/20',
    advice: 'Threat indicators verified. Moving coordinates log.',
    action: 'Move to a populated public zone. Contacts notified.'
  },
  CRITICAL: {
    name: 'Critical',
    range: [86, 100],
    colorClass: 'text-red-600 bg-red-950/20 border-red-500/30',
    advice: 'EMERGENCY PROTOCOL ACTIVE: SOS Activated.',
    action: 'Immediate action required. Audio recording. Assistance requests broadcasted.'
  }
};

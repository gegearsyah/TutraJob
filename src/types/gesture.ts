/**
 * Gesture System Types
 * Based on FEATURE_SPECIFICATION.md
 */

export type GestureType =
  | 'flick-right' // Apply
  | 'flick-left' // Dismiss/Next
  | 'double-tap' // Open full description
  | 'long-press' // Save for later
  | 'swipe-up' // View saved jobs
  | 'swipe-down'; // Refresh

export interface GestureConfig {
  minSwipeDistance: number; // pixels (default: 50)
  maxSwipeTime: number; // milliseconds (default: 300)
  directionThreshold: number; // 0-1 (default: 0.7)
  allowCurvedPaths: boolean; // For dexterity accommodation
}

export interface GestureEvent {
  type: GestureType;
  timestamp: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
  distance: number;
}

export const DEFAULT_GESTURE_CONFIG: GestureConfig = {
  minSwipeDistance: 50,
  maxSwipeTime: 300,
  directionThreshold: 0.7,
  allowCurvedPaths: true,
};

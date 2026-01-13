/**
 * Gesture Detection System
 * Based on FEATURE_SPECIFICATION.md Section 1.2
 */

import type { GestureType, GestureConfig, GestureEvent } from '@/types/gesture';
import { DEFAULT_GESTURE_CONFIG } from '@/types/gesture';

export interface GestureHandlers {
  onFlickRight?: () => void;
  onFlickLeft?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export class GestureDetector {
  private config: GestureConfig;
  private startX: number = 0;
  private startY: number = 0;
  private startTime: number = 0;
  private touchStartTime: number = 0;
  private lastTapTime: number = 0;
  private tapCount: number = 0;
  private longPressTimer: NodeJS.Timeout | null = null;
  private handlers: GestureHandlers;

  constructor(
    handlers: GestureHandlers,
    config: GestureConfig = DEFAULT_GESTURE_CONFIG
  ) {
    this.config = config;
    this.handlers = handlers;
  }

  handleTouchStart = (e: React.TouchEvent | React.MouseEvent): void => {
    const point = this.getPoint(e);
    this.startX = point.x;
    this.startY = point.y;
    this.startTime = Date.now();
    this.touchStartTime = Date.now();

    // Long press detection
    this.longPressTimer = setTimeout(() => {
      if (this.handlers.onLongPress) {
        this.handlers.onLongPress();
      }
    }, 500); // 500ms for long press
  };

  handleTouchMove = (e: React.TouchEvent | React.MouseEvent): void => {
    // Cancel long press if user moves
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  };

  handleTouchEnd = (e: React.TouchEvent | React.MouseEvent): void => {
    // Cancel long press timer
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    const point = this.getPoint(e);
    const endX = point.x;
    const endY = point.y;
    const endTime = Date.now();

    const deltaX = endX - this.startX;
    const deltaY = endY - this.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = endTime - this.startTime;

    // Check for double tap
    const currentTime = Date.now();
    const timeSinceLastTap = currentTime - this.lastTapTime;

    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      this.tapCount++;
      if (this.tapCount === 2) {
        if (this.handlers.onDoubleTap) {
          this.handlers.onDoubleTap();
        }
        this.tapCount = 0;
        return;
      }
    } else {
      this.tapCount = 1;
    }
    this.lastTapTime = currentTime;

    // Check if it's a swipe gesture
    if (distance < this.config.minSwipeDistance) {
      return; // Not a swipe
    }

    if (duration > this.config.maxSwipeTime) {
      return; // Too slow
    }

    // Determine direction
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const directionRatio = absX / (absX + absY);

    // Horizontal swipe
    if (directionRatio > this.config.directionThreshold) {
      if (deltaX > 0) {
        // Swipe right
        if (this.handlers.onFlickRight) {
          this.handlers.onFlickRight();
        }
      } else {
        // Swipe left
        if (this.handlers.onFlickLeft) {
          this.handlers.onFlickLeft();
        }
      }
    }
    // Vertical swipe
    else if (directionRatio < 1 - this.config.directionThreshold) {
      if (deltaY < 0) {
        // Swipe up
        if (this.handlers.onSwipeUp) {
          this.handlers.onSwipeUp();
        }
      } else {
        // Swipe down
        if (this.handlers.onSwipeDown) {
          this.handlers.onSwipeDown();
        }
      }
    }
  };

  private getPoint(
    e: React.TouchEvent | React.MouseEvent
  ): { x: number; y: number } {
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    } else if ('clientX' in e) {
      return {
        x: e.clientX,
        y: e.clientY,
      };
    }
    return { x: 0, y: 0 };
  }

  cleanup(): void {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
    }
  }
}

/**
 * Hook for gesture detection
 */
export function useGestureDetection(handlers: GestureHandlers) {
  const detector = new GestureDetector(handlers);

  // Return only event handlers (not cleanup function)
  return {
    onTouchStart: detector.handleTouchStart,
    onTouchMove: detector.handleTouchMove,
    onTouchEnd: detector.handleTouchEnd,
    onMouseDown: detector.handleTouchStart,
    onMouseMove: detector.handleTouchMove,
    onMouseUp: detector.handleTouchEnd,
  };
}

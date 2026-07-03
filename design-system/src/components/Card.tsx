import React from 'react';
import { colors, radius, shadows, spacing } from '../tokens';

interface CardProps {
  children: React.ReactNode;
  padding?: number;
  margin?: number;
  hoverable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = spacing.md,
  margin = spacing.md,
  hoverable = false,
  className,
  style,
}) => {
  return (
    <div
      style={{
        backgroundColor: colors.gray[0],
        borderRadius: radius.xl,
        padding,
        margin,
        boxShadow: shadows.level1,
        transition: hoverable ? 'all 150ms ease-out' : 'none',
        ...(hoverable ? { cursor: 'pointer' } : {}),
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
};
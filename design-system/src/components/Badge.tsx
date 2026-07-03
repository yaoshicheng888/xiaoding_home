import React from 'react';
import { colors, radius, font } from '../tokens';

type BadgeStatus = 'success' | 'warning' | 'error' | 'info' | 'default';

interface BadgeProps {
  text: string;
  status?: BadgeStatus;
  dot?: boolean;
  count?: number;
  maxCount?: number;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  status = 'default',
  dot = false,
  count,
  maxCount = 99,
}) => {
  const statusColors: Record<BadgeStatus, string> = {
    success: colors.success,
    warning: colors.warning,
    error: colors.danger,
    info: colors.info,
    default: colors.gray[500],
  };

  const bgColor = statusColors[status];

  if (dot) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: bgColor,
        }}
      />
    );
  }

  if (count !== undefined) {
    const displayCount = count > maxCount ? `${maxCount}+` : count;
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 20,
          height: 20,
          padding: '0 6px',
          borderRadius: radius.xs,
          backgroundColor: bgColor,
          color: colors.gray[0],
          fontSize: font.mini.size,
          fontWeight: fontWeights.medium,
        }}
      >
        {displayCount}
      </span>
    );
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2px 8px',
        borderRadius: radius.xs,
        backgroundColor: status === 'default' ? colors.gray[100] : `${bgColor}15`,
        color: status === 'default' ? colors.gray[600] : bgColor,
        fontSize: font.caption.size,
        fontWeight: fontWeights.medium,
      }}
    >
      {text}
    </span>
  );
};

const fontWeights = {
  medium: 500,
};
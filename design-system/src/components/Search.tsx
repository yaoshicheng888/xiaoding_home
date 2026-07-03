import React, { useState } from 'react';
import { Search as SearchIcon, Mic } from 'lucide-react';
import { colors, font, radius, spacing, shadows } from '../tokens';

interface SearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  aiMode?: boolean;
}

const fontWeights = {
  semibold: 600,
};

export const Search: React.FC<SearchProps> = ({
  placeholder = '搜索服务或描述问题',
  value,
  onChange,
  onSearch,
  aiMode = true,
}) => {
  const [inputValue, setInputValue] = useState(value || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  const handleSearch = () => {
    onSearch?.(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 48,
          backgroundColor: colors.gray[0],
          borderRadius: radius.xxl,
          border: `1px solid ${colors.gray[200]}`,
          padding: `0 ${spacing.md}px`,
          boxShadow: shadows.level1,
        }}
      >
        {aiMode && (
          <span
            style={{
              width: 24,
              height: 24,
              marginRight: spacing.sm,
              borderRadius: radius.sm,
              backgroundColor: colors.primary[100],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: fontWeights.semibold,
              color: colors.primary[600],
            }}
          >
            AI
          </span>
        )}
        <span style={{ marginRight: spacing.sm, color: colors.gray[400], display: 'inline-flex' }}>
          <SearchIcon size={18} />
        </span>
        <input
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontSize: font.body.size,
            color: colors.gray[900],
          }}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={handleSearch}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: spacing.sm,
            color: colors.gray[400],
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 150ms',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = colors.primary[500];
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = colors.gray[400];
          }}
        >
          <Mic size={18} />
        </button>
      </div>
    </div>
  );
};

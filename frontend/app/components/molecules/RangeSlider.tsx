'use client';
import React from 'react';
import './RangeSlider.css';

interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  minValue: number;
  maxValue: number;
  onChange: (min: number, max: number) => void;
  onFinalChange?: () => void;
  disabled?: boolean;
  step?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  label, min, max, minValue, maxValue, onChange, onFinalChange, disabled = false, step = 1,
  formatValue = (value) => value.toString(), className = ''
}) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), maxValue - step);
    onChange(newMin, maxValue);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), minValue + step);
    onChange(minValue, newMax);
  };

  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  return (
    <div className={`range-slider ${className}`}>
      <label className="range-label">{label}</label>
      <div className="range-values">
        <span className="range-value">{formatValue(minValue)}</span>
        <span className="range-separator">-</span>
        <span className="range-value">{formatValue(maxValue)}</span>
      </div>
      <div className="slider-container">
        <div className="slider-track"><div className="slider-range" style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }} /></div>
        <input type="range" min={min} max={max} step={step} value={minValue} onChange={handleMinChange} onMouseUp={onFinalChange} onTouchEnd={onFinalChange} disabled={disabled} className="slider-input slider-min" />
        <input type="range" min={min} max={max} step={step} value={maxValue} onChange={handleMaxChange} onMouseUp={onFinalChange} onTouchEnd={onFinalChange} disabled={disabled} className="slider-input slider-max" />
      </div>
    </div>
  );
};

export default RangeSlider;
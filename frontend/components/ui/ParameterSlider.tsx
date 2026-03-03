import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { SLIDER_THEMES, SliderColor } from "@/styles/themes";

interface ParameterSliderProps {
  label: string;
  icon?: ReactNode;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  color?: SliderColor;
  className?: string;
  disabled?: boolean;
}

export function ParameterSlider({
  label,
  icon,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
  color = "indigo",
  className,
  disabled = false,
}: Readonly<ParameterSliderProps>) {
  const theme = SLIDER_THEMES[color] || SLIDER_THEMES.indigo;
  const [localValue, setLocalValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);

  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    if (!isDragging) {
      setLocalValue(value);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number.parseFloat(e.target.value);
    setLocalValue(newVal);
    onChange(newVal);
  };

  return (
    <div
      className={cn(
        "space-y-3 group select-none transition-opacity duration-300",
        disabled && "opacity-40 pointer-events-none grayscale",
        className,
      )}
    >
      <div className="flex justify-between items-center text-sm">
        {/* Updated icon text container for light mode */}
        <div className="flex flex-1 items-center gap-2 text-slate-600 dark:text-slate-400 overflow-hidden mr-4">
          {icon && <span className={theme.text}>{icon}</span>}
          <span className="font-medium tracking-wide truncate" title={label}>
            {label}
          </span>
        </div>
        <span
          className={cn(
            "font-mono text-xs px-2 py-0.5 rounded border min-w-12 text-center transition-colors",
            theme.badge,
          )}
        >
          {localValue}
          {unit}
        </span>
      </div>

      <div className="relative h-6 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleInputChange}
          disabled={disabled}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchEnd={() => setIsDragging(false)}
          className={cn(
            "w-full h-1.5 rounded-lg appearance-none bg-slate-200 dark:bg-slate-800 focus:outline-none focus:ring-2 transition-all",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
            theme.accent,
          )}
        />
      </div>
    </div>
  );
}

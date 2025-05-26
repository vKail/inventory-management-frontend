// src/shared/components/Select.tsx

import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        {label && <label className="mb-2 text-sm font-medium">{label}</label>}
        <select
          ref={ref}
          {...props}
          className="px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
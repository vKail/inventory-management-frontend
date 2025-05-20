import React from 'react';

export interface SelectOption {
	value: string;
	label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	options: SelectOption[];
	icon?: React.ReactNode;
	className?: string;
}

export const Select: React.FC<SelectProps> = ({ options, icon, className, ...props }) => {
	return (
		<div className={`relative flex items-center ${className ?? ''}`}>
			{icon && (
				<span className="absolute left-3 pointer-events-none text-gray-400">
					{icon}
				</span>
			)}
			<select
				className={`w-full appearance-none border rounded px-3 py-2 ${icon ? 'pl-10' : ''} focus:outline-none focus:ring-2 focus:ring-blue-500`}
				{...props}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>{option.label}</option>
				))}
			</select>
			<span className="absolute right-3 pointer-events-none text-gray-400">
				▼
			</span>
		</div>
	);
};
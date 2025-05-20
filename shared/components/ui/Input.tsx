import React, { InputHTMLAttributes, ReactNode, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ icon, className = '', ...props }, ref) => (
		<div className={`relative flex items-center ${className}`}>
			{icon && (
				<span className="absolute left-3 text-gray-400 pointer-events-none">
					{icon}
				</span>
			)}
			<input
				ref={ref}
				className={`w-full py-2 px-3 ${icon ? 'pl-10' : ''} border rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
				{...props}
			/>
		</div>
	)
);

Input.displayName = 'Input';
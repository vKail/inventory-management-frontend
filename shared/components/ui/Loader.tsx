import React from "react"
import ContentLoader from "react-content-loader"
import { Loader2 } from "lucide-react"

interface LoaderProps {
  rows?: number;
  columns?: number;
}

const LoaderComponent = ({ rows = 5, columns = 7 }: LoaderProps) => {
  const rowHeight = 50;
  const height = rows * rowHeight;
  const columnWidth = 100 / columns;

  return (
    <div className="w-full min-h-[400px] flex items-center justify-center">
      <ContentLoader
        speed={2}
        width="100%"
        height={height}
        backgroundColor="#f3f3f3"
        foregroundColor="#e0e0e0"
        style={{ width: '100%' }}
      >
        {/* Header row */}
        {Array.from({ length: columns }).map((_, colIndex) => (
          <rect
            key={`header-${colIndex}`}
            x={`${colIndex * columnWidth}%`}
            y="0"
            rx="4"
            ry="4"
            width={`${columnWidth - 2}%`}
            height="30"
          />
        ))}

        {/* Data rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          Array.from({ length: columns }).map((_, colIndex) => (
            <rect
              key={`row-${rowIndex}-col-${colIndex}`}
              x={`${colIndex * columnWidth}%`}
              y={rowIndex * rowHeight + 40}
              rx="4"
              ry="4"
              width={`${columnWidth - 2}%`}
              height="30"
            />
          ))
        ))}
      </ContentLoader>
    </div>
  );
};

export const Loader = () => {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default LoaderComponent;

interface CardSkeletonProps {
  cards?: number;
  columns?: 1 | 2 | 3 | 4;
}

export function CardSkeleton({ cards = 6, columns = 3 }: CardSkeletonProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {Array.from({ length: cards }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow p-6 animate-pulse"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
          </div>

          {/* Content */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

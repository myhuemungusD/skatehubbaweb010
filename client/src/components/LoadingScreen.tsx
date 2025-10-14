import { Skeleton } from "./ui/skeleton";

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#181818] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-in fade-in duration-300">
        {/* Logo skeleton */}
        <div className="flex items-center justify-center mb-8">
          <Skeleton className="h-12 w-12 rounded-lg bg-gray-800" />
          <Skeleton className="h-8 w-40 ml-3 rounded bg-gray-800" />
        </div>
        
        {/* Card skeleton */}
        <div className="bg-[#232323] rounded-lg p-6 space-y-4 border border-gray-700">
          <Skeleton className="h-6 w-32 bg-gray-800" />
          <Skeleton className="h-4 w-48 bg-gray-800" />
          
          <div className="space-y-3 pt-2">
            <Skeleton className="h-10 w-full bg-gray-800" />
            <Skeleton className="h-10 w-full bg-gray-800" />
            <Skeleton className="h-12 w-full bg-gray-800 mt-4" />
          </div>
        </div>
        
        {/* Loading indicator */}
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <div className="relative">
            <div className="h-2 w-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          </div>
          <div className="relative">
            <div className="h-2 w-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          </div>
          <div className="relative">
            <div className="h-2 w-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#181818] p-4">
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
        {/* Header skeleton */}
        <div className="flex items-center justify-between p-4">
          <Skeleton className="h-8 w-32 bg-gray-800" />
          <Skeleton className="h-10 w-24 bg-gray-800 rounded-full" />
        </div>
        
        {/* Content skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#232323] rounded-lg p-6 space-y-4 border border-gray-700">
              <Skeleton className="h-40 w-full bg-gray-800 rounded" />
              <Skeleton className="h-6 w-3/4 bg-gray-800" />
              <Skeleton className="h-4 w-full bg-gray-800" />
              <Skeleton className="h-4 w-5/6 bg-gray-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

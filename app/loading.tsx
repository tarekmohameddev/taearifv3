export default function Loading() {
  return (
    <div className="animate-gentle-fade p-6 bg-gray-50 min-h-[200px] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-ultra"></div>
      <div className="space-y-4 relative z-10 max-w-md mx-auto">
        <div className="h-6 bg-gray-200 rounded animate-breathing w-3/4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer-slow"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded animate-gentle-fade w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer-ultra" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <div className="h-4 bg-gray-100 rounded animate-gentle-fade w-5/6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer-slow" style={{ animationDelay: '1s' }}></div>
          </div>
          <div className="h-4 bg-gray-100 rounded animate-gentle-fade w-4/6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer-ultra" style={{ animationDelay: '1.5s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

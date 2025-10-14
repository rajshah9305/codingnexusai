import React from 'react';
import { Loader2, Sparkles, Users } from 'lucide-react';

/**
 * Professional Loading State Component
 * Enterprise-ready loading indicators with multiple variants
 */
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <Loader2 className={`${sizes[size]} animate-spin text-orange-500 ${className}`} />
  );
};

export const LoadingDots = ({ className = '' }) => {
  return (
    <div className={`loading-dots ${className}`}>
      <span className="bg-orange-500"></span>
      <span className="bg-orange-500"></span>
      <span className="bg-orange-500"></span>
    </div>
  );
};

export const LoadingScreen = ({ message = 'Loading...', multiAgent = false }) => {
  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-orange-lg mb-6 animate-scale-in">
          {multiAgent ? (
            <Users className="w-10 h-10 text-white animate-pulse" />
          ) : (
            <Sparkles className="w-10 h-10 text-white animate-pulse" />
          )}
        </div>
        <h2 className="heading-3 mb-2 text-gradient-orange">{message}</h2>
        <LoadingDots className="justify-center" />
      </div>
    </div>
  );
};

export const InlineLoader = ({ text = 'Loading', multiAgent = false }) => {
  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner size="sm" />
      <span className="body-sm text-gray-700 font-semibold">
        {multiAgent ? 'Agents collaborating...' : text}
      </span>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="card animate-pulse">
      <div className="card-body">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );
};

export const SkeletonText = ({ lines = 3 }) => {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, idx) => (
        <div
          key={idx}
          className="h-3 bg-gray-200 rounded"
          style={{ width: `${Math.random() * 30 + 70}%` }}
        ></div>
      ))}
    </div>
  );
};

export const ProgressBar = ({ progress = 0, label = '', variant = 'orange' }) => {
  const variants = {
    orange: 'bg-orange-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500'
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="body-sm font-semibold">{label}</span>
          <span className="caption font-bold">{progress}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${variants[variant]} transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        ></div>
      </div>
    </div>
  );
};

export default {
  LoadingSpinner,
  LoadingDots,
  LoadingScreen,
  InlineLoader,
  SkeletonCard,
  SkeletonText,
  ProgressBar
};


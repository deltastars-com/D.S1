import { useState, useEffect } from 'react';

export function useOnboarding() {
  const [hasCompletedTour, setHasCompletedTour] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Check if user has completed tour on mount
  useEffect(() => {
    const completed = localStorage.getItem('onboarding_tour_completed');
    setHasCompletedTour(!!completed);

    // Show tour for new users
    if (!completed) {
      // Delay showing tour to let page load
      const timer = setTimeout(() => {
        setIsTourOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const completeTour = () => {
    localStorage.setItem('onboarding_tour_completed', 'true');
    setHasCompletedTour(true);
    setIsTourOpen(false);
  };

  const resetTour = () => {
    localStorage.removeItem('onboarding_tour_completed');
    setHasCompletedTour(false);
    setIsTourOpen(true);
  };

  const openTour = () => {
    setIsTourOpen(true);
  };

  const closeTour = () => {
    setIsTourOpen(false);
  };

  return {
    hasCompletedTour,
    isTourOpen,
    completeTour,
    resetTour,
    openTour,
    closeTour,
  };
}

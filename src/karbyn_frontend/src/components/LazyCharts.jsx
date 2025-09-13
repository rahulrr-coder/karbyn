import { lazy, Suspense } from 'react';

// Lazy load chart components to reduce initial bundle size
const ChartContainer = lazy(() => import('../pages/impact-dashboard/components/ChartContainer'));
const ProjectImpactData = lazy(() => import('../pages/project-details/components/ProjectImpactData'));

// Loading fallback component
const ChartLoader = () => (
  <div className="flex items-center justify-center h-64 bg-card rounded-lg border border-border">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground">Loading chart...</p>
    </div>
  </div>
);

// Wrapped components with Suspense
export const LazyChartContainer = (props) => (
  <Suspense fallback={<ChartLoader />}>
    <ChartContainer {...props} />
  </Suspense>
);

export const LazyProjectImpactData = (props) => (
  <Suspense fallback={<ChartLoader />}>
    <ProjectImpactData {...props} />
  </Suspense>
);

export default {
  ChartContainer: LazyChartContainer,
  ProjectImpactData: LazyProjectImpactData
};

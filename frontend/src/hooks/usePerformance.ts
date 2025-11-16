import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderCount: number;
  renderTime: number;
  mountTime: number;
}

/**
 * Hook para medir el rendimiento de componentes
 * Solo activo en modo desarrollo
 */
export function usePerformance(componentName: string) {
  const renderCount = useRef(0);
  const mountTime = useRef(0);
  const renderStartTime = useRef(0);

  // Iniciar medición de render
  renderStartTime.current = performance.now();
  renderCount.current += 1;

  useEffect(() => {
    // Calcular tiempo de mount en el primer render
    if (renderCount.current === 1) {
      mountTime.current = performance.now() - renderStartTime.current;

      if (import.meta.env.DEV) {
        console.log(
          `%c[Performance] ${componentName} mounted in ${mountTime.current.toFixed(2)}ms`,
          'color: #10b981; font-weight: bold'
        );
      }
    }

    // Calcular tiempo de render
    const renderTime = performance.now() - renderStartTime.current;

    if (import.meta.env.DEV && renderTime > 16.67) {
      // Warn si el render toma más de 16.67ms (60fps)
      console.warn(
        `%c[Performance] ${componentName} render #${renderCount.current} took ${renderTime.toFixed(2)}ms (slow)`,
        'color: #f59e0b; font-weight: bold'
      );
    }

    return () => {
      // Cleanup
      if (import.meta.env.DEV) {
        const metrics: PerformanceMetrics = {
          componentName,
          renderCount: renderCount.current,
          renderTime: performance.now() - renderStartTime.current,
          mountTime: mountTime.current,
        };

        // Guardar métricas para análisis
        if (typeof window !== 'undefined') {
          (window as any).__PERFORMANCE_METRICS__ = {
            ...(window as any).__PERFORMANCE_METRICS__,
            [componentName]: metrics,
          };
        }
      }
    };
  });

  return {
    renderCount: renderCount.current,
  };
}

/**
 * Hook para detectar re-renders innecesarios
 */
export function useWhyDidYouUpdate(name: string, props: Record<string, any>) {
  const previousProps = useRef<Record<string, any>>();

  useEffect(() => {
    if (previousProps.current && import.meta.env.DEV) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, { from: any; to: any }> = {};

      allKeys.forEach((key) => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.log(`%c[Why-Did-Update] ${name}`, 'color: #3b82f6; font-weight: bold');
        console.table(changedProps);
      }
    }

    previousProps.current = props;
  });
}

/**
 * Hook para medir tiempo de carga de datos
 */
export function useLoadingTime(name: string, isLoading: boolean) {
  const startTime = useRef<number>(0);

  useEffect(() => {
    if (isLoading && startTime.current === 0) {
      startTime.current = performance.now();
    } else if (!isLoading && startTime.current > 0) {
      const loadTime = performance.now() - startTime.current;

      if (import.meta.env.DEV) {
        console.log(
          `%c[Loading] ${name} loaded in ${loadTime.toFixed(2)}ms`,
          'color: #8b5cf6; font-weight: bold'
        );
      }

      startTime.current = 0;
    }
  }, [isLoading, name]);
}

/**
 * Hook para debounce de valores
 * Útil para optimizar búsquedas y filtros
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Exportar función para obtener métricas globales
export function getPerformanceMetrics(): Record<string, PerformanceMetrics> | null {
  if (typeof window === 'undefined' || !import.meta.env.DEV) {
    return null;
  }

  return (window as any).__PERFORMANCE_METRICS__ || null;
}

// Exportar función para limpiar métricas
export function clearPerformanceMetrics() {
  if (typeof window !== 'undefined') {
    (window as any).__PERFORMANCE_METRICS__ = {};
  }
}

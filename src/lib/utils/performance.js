// Performance Utilities - Functions for optimizing app performance

/**
 * Lazy load component with loading fallback
 */
export const lazyLoad = (importFunc, fallback = null) => {
  const LazyComponent = React.lazy(importFunc)
  
  return (props) => (
    <React.Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </React.Suspense>
  )
}

/**
 * Memoize expensive calculations
 */
export const memoize = (fn) => {
  const cache = new Map()
  
  return (...args) => {
    const key = JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

/**
 * Preload route/component
 */
export const preloadRoute = (routeImport) => {
  if (typeof window !== 'undefined') {
    // Preload on idle or after a delay
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => routeImport())
    } else {
      setTimeout(() => routeImport(), 100)
    }
  }
}

/**
 * Intersection Observer for lazy loading
 */
export const useIntersectionObserver = (callback, options = {}) => {
  const [ref, setRef] = useState(null)
  
  useEffect(() => {
    if (!ref) return
    
    const observer = new IntersectionObserver(callback, {
      threshold: 0.1,
      ...options,
    })
    
    observer.observe(ref)
    
    return () => observer.disconnect()
  }, [ref, callback, options])
  
  return setRef
}

/**
 * Virtual scrolling for large lists
 */
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0)
  
  const visibleStart = Math.floor(scrollTop / itemHeight)
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  )
  
  const visibleItems = items.slice(visibleStart, visibleEnd)
  const totalHeight = items.length * itemHeight
  const offsetY = visibleStart * itemHeight
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: (e) => setScrollTop(e.target.scrollTop),
  }
}

/**
 * Image lazy loading with placeholder
 */
export const LazyImage = ({ src, alt, placeholder, className, ...props }) => {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const imgRef = useRef()
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    
    if (imgRef.current) {
      observer.observe(imgRef.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <div ref={imgRef} className={className}>
      {inView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
          {...props}
        />
      )}
      {!loaded && placeholder && (
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700">
          {placeholder}
        </div>
      )}
    </div>
  )
}

/**
 * Bundle size analyzer
 */
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    import('webpack-bundle-analyzer').then(({ BundleAnalyzerPlugin }) => {
      console.log('Bundle analyzer available')
    })
  }
}

/**
 * Performance monitoring
 */
export const performanceMonitor = {
  // Mark performance timing
  mark: (name) => {
    if ('performance' in window) {
      performance.mark(name)
    }
  },
  
  // Measure performance between marks
  measure: (name, startMark, endMark) => {
    if ('performance' in window) {
      performance.measure(name, startMark, endMark)
      const measure = performance.getEntriesByName(name)[0]
      console.log(`${name}: ${measure.duration}ms`)
      return measure.duration
    }
  },
  
  // Get navigation timing
  getNavigationTiming: () => {
    if ('performance' in window && 'navigation' in performance) {
      const timing = performance.getEntriesByType('navigation')[0]
      return {
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        request: timing.responseStart - timing.requestStart,
        response: timing.responseEnd - timing.responseStart,
        dom: timing.domContentLoadedEventEnd - timing.navigationStart,
        load: timing.loadEventEnd - timing.navigationStart,
      }
    }
  },
  
  // Monitor Core Web Vitals
  getCoreWebVitals: () => {
    return new Promise((resolve) => {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        const vitals = {}
        
        getCLS((metric) => vitals.cls = metric.value)
        getFID((metric) => vitals.fid = metric.value)
        getFCP((metric) => vitals.fcp = metric.value)
        getLCP((metric) => vitals.lcp = metric.value)
        getTTFB((metric) => vitals.ttfb = metric.value)
        
        setTimeout(() => resolve(vitals), 1000)
      })
    })
  },
}
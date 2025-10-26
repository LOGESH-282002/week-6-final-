'use client'

export default function FeatureCard({ icon: Icon, title, description, highlight = false }) {
  return (
    <div className={`
      relative p-4 sm:p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg h-full
      ${highlight 
        ? 'bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-2 border-primary-200 dark:border-primary-700' 
        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-600'
      }
    `}>
      {highlight && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Popular
          </span>
        </div>
      )}
      
      <div className={`
        w-12 h-12 rounded-lg flex items-center justify-center mb-4
        ${highlight ? 'bg-primary-600' : 'bg-primary-100'}
      `}>
        <Icon className={`h-6 w-6 ${highlight ? 'text-white' : 'text-primary-600'}`} />
      </div>
      
      <h3 className="heading-responsive-sm text-gray-900 dark:text-gray-100 mb-2 text-break-words">
        {title}
      </h3>
      
      <p className="text-responsive-sm text-gray-600 dark:text-gray-300 leading-relaxed text-break-words">
        {description}
      </p>
    </div>
  )
}
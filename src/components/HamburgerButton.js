'use client'

export default function HamburgerButton({ isOpen, onClick, className = '' }) {
  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onClick(e)
  }

  return (
    <button
      onClick={handleClick}
      className={`relative w-10 h-10 flex flex-col justify-center items-center border border-gray-300 dark:border-gray-600 rounded-md ${className}`}
      aria-label={isOpen ? "Close mobile menu" : "Open mobile menu"}
      style={{ minWidth: '40px', minHeight: '40px' }}
    >
      <div className="w-6 h-6 relative flex flex-col justify-center items-center">
        <span
          className={`absolute block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 transition-all duration-300 ease-in-out ${
            isOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
          }`}
        />
        <span
          className={`absolute block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <span
          className={`absolute block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 transition-all duration-300 ease-in-out ${
            isOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
          }`}
        />
      </div>
    </button>
  )
}
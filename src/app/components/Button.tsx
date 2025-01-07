import Link from 'next/link'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string
  variant?: 'primary' | 'secondary'
  icon?: ReactNode
}

export default function Button({ href, children, variant = 'primary', icon, ...props }: ButtonProps) {
  const baseClasses = "px-4 py-2 rounded font-semibold transition-colors flex items-center justify-center"
  const variantClasses = {
    primary: "bg-orange-600 text-white hover:bg-orange-700",
    secondary: "bg-orange-100 text-white-800 hover:bg-orange-200"
  }
  
  const className = `${baseClasses} ${variantClasses[variant]} ${props.className || ''}`
  
  const content = (
    <>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <button className={className} {...props}>
      {content}
    </button>
  )
}


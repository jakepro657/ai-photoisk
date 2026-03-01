import React from 'react'
import "./button.css"

type Props = {
  label?: string
  size: "sm" | "md" | "lg"
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  className?: string
}

const buttonStyle = {
  'sm': "button-sm",
  'md': "button-md",
  'lg': "button-lg",
}

function Button({ label, size, onClick, disabled, className }: Props) {
  
  return (
    <button disabled={disabled} className={`${className} ${buttonStyle[size]}`} onClick={onClick}>
      {label}
    </button>
  )
}

export default Button
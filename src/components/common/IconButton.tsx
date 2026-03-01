import React from 'react'
import "./button.css"

type Props = {
  label?: string
  size: "sm" | "md" | "lg"
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  direction: "row" | "column"
  icon: React.ReactNode
  className?: string
}

const buttonStyle = {
  'sm': "button_icon-sm",
  'md': "button_icon-md",
  'lg': "button_icon-lg",
}

const iconStyle = {
  'row': "button_icon-row",
  'column': "button_icon-col",
}

function IconButton({ label, size, onClick, disabled, direction, icon, className }: Props) {

  return (
    <button disabled={disabled} className={`${buttonStyle[size]} ${iconStyle[direction]} ${className}`} onClick={onClick}>
      <>{icon}</>
      <div>{label}</div>
    </button>
  )
}

export default IconButton
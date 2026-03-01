import React from 'react'
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
  'sm': "py-2 px-4 text-sm",
  'md': "py-3 px-6 text-base",
  'lg': "py-4 px-8 text-xl",
}

const iconStyle = {
  'row': "flex items-center justify-center",
  'column': "flex flex-col items-center justify-center gap-1",
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
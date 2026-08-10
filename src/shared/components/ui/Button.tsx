import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'vivid' | 'outline' | 'ghost' | 'whatsapp'
export type ButtonSize = 'md' | 'sm'

interface BaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  children: ReactNode
  className?: string
}

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    as?: 'button'
  }

type ButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    as: 'a'
    href: string
  }

type ButtonAsRoute = BaseProps & {
  as: 'route'
  to: string
}

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsRoute

function classesFor(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  extra?: string,
): string {
  return [
    styles.button,
    styles[variant],
    size === 'sm' ? styles.small : null,
    fullWidth ? styles.block : null,
    extra,
  ]
    .filter(Boolean)
    .join(' ')
}

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className,
    children,
  } = props
  const classes = classesFor(variant, size, fullWidth, className)

  if (props.as === 'route') {
    const { to } = props
    return (
      <Link className={classes} to={to}>
        {children}
      </Link>
    )
  }

  if (props.as === 'a') {
    const {
      as: _as,
      variant: _v,
      size: _s,
      fullWidth: _f,
      className: _c,
      ...rest
    } = props
    return (
      <a className={classes} {...rest}>
        {children}
      </a>
    )
  }

  const { as: _as, variant: _v, size: _s, fullWidth: _f, className: _c, ...rest } = props
  return (
    <button className={classes} type={rest.type ?? 'button'} {...rest}>
      {children}
    </button>
  )
}

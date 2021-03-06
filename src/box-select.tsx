import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import cn from 'classnames'
import styles from './box-select.scss'

export interface BoxSelectOption<T> extends Record<string, any> {
  /** 选项展示信息 */
  label: React.ReactNode
  /** 选项值 */
  value: T
  /** 禁用项 */
  disabled?: boolean
}

export type BoxSelectOnChange<T> = (
  value: T, 
  option: BoxSelectOption<T>
) => void

export type BoxSelectOnClick<T> = (
  event: React.MouseEvent<HTMLDivElement, MouseEvent>, 
  value: T, 
  option: BoxSelectOption<T>
) => void

export type BoxSelectOnClear = (
  event: React.MouseEvent<HTMLDivElement, MouseEvent>
) => void

export interface BoxSelectProps<T> {
  /** 类名 */
  className?: string
  /** 样式 */
  style?: React.CSSProperties
  /** 已选值 */
  value?: T
  /** 选项 */
  options?: BoxSelectOption<T>[]
  /** 禁止修改 */
  disabled?: boolean
  /** 竖着放置 */
  vertical?: boolean
  /** 改变已选值 */
  onChange?: BoxSelectOnChange<T>
  /** 点击项 */
  onClick?: BoxSelectOnClick<T>
  /** 清除 */
  onClear?: BoxSelectOnClear
}

export interface BoxSelectRef {
  rootNode: HTMLDivElement | null
}

export const BoxSelect = forwardRef<BoxSelectRef, BoxSelectProps<any>>(({
  className,
  style,
  value,
  options,
  vertical,
  onChange,
  onClick,
  onClear,
  ...props
}, ref) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const _options = options || []
  const _disabled = props.disabled || !_options.find(i => !i.disabled)

  useImperativeHandle(ref, () => ({
    rootNode: rootRef.current
  }), [rootRef.current])

  return (
    <div 
      ref={rootRef} 
      style={style}
      className={cn(
        className, 
        styles.xrboxselect, 
        vertical ? styles.vertical : styles.horizontal,
        _disabled ? styles.disabled : undefined
      )}
    >
      {_options.map((item, index) => {
        const active = item.value === value
        const disabled = _disabled || item.disabled
        return (
          <div 
            key={index} 
            className={cn(styles.item, {
              [styles.active]: active,
              [styles.disabled]: disabled
            })}
            onClick={event => {
              if (onClick) {
                onClick(event, item.value, item)
              }
              if (!disabled && active && onClear) {
                onClear(event)
              } else if (!disabled && onChange) {
                onChange(item.value, item)
              }
            }}
          >{item.label}</div>
        )
      })}
    </div>
  )
})

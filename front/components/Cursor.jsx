import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const mx = useMotionValue(-100)
  const my = useMotionValue(-100)
  const sx = useSpring(mx, { stiffness: 500, damping: 35 })
  const sy = useSpring(my, { stiffness: 500, damping: 35 })

  useEffect(() => {
    const move = (e) => { mx.set(e.clientX); my.set(e.clientY); setVisible(true) }
    const enter = () => setVisible(true)
    const leave = () => setVisible(false)
    window.addEventListener('mousemove', move)
    document.addEventListener('mouseenter', enter)
    document.addEventListener('mouseleave', leave)

    const onEnterLink = () => setHovered(true)
    const onLeaveLink = () => setHovered(false)
    const links = document.querySelectorAll('a, button, [data-cursor]')
    links.forEach(el => { el.addEventListener('mouseenter', onEnterLink); el.addEventListener('mouseleave', onLeaveLink) })

    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseenter', enter)
      document.removeEventListener('mouseleave', leave)
    }
  }, [mx, my])

  return (
    <>
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 9999,
          pointerEvents: 'none',
          x: sx, y: sy,
          translateX: '-50%', translateY: '-50%',
          width: hovered ? 40 : 10, height: hovered ? 40 : 10,
          borderRadius: '50%',
          background: hovered ? 'transparent' : '#7c6bff',
          border: hovered ? '1.5px solid #7c6bff' : 'none',
          opacity: visible ? 1 : 0,
          transition: 'width 0.2s, height 0.2s, background 0.2s, border 0.2s, opacity 0.3s',
        }}
      />
    </>
  )
}

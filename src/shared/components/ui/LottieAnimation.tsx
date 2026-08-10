import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'

interface LottieAnimationProps {
  src: string
  className?: string
}

export default function LottieAnimation({ src, className }: LottieAnimationProps) {
  const [animationData, setAnimationData] = useState<object | null>(null)

  useEffect(() => {
    let active = true

    fetch(src)
      .then((res) => res.json())
      .then((data) => {
        if (active) setAnimationData(data)
      })
      // Se a animação não carregar, o spinner do Suspense continua valendo.
      .catch(() => {})

    return () => {
      active = false
    }
  }, [src])

  if (!animationData) return null

  return <Lottie animationData={animationData} loop className={className} />
}

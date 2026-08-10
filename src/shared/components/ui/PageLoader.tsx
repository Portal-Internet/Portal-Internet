import { lazy, Suspense, useEffect, useState } from 'react'
import { asset } from '@/shared/lib/assets'
import styles from './PageLoader.module.css'

const LottieAnimation = lazy(() => import('./LottieAnimation'))

/** Só vale baixar a animação (bem mais pesada) se a espera passar disso. */
const LOTTIE_DELAY_MS = 600

export function PageLoader() {
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(true), LOTTIE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={styles.loader} role="status" aria-label="Carregando">
      {showAnimation ? (
        <Suspense fallback={<span className={styles.spinner} />}>
          <LottieAnimation src={asset('loader.json')} className={styles.animation} />
        </Suspense>
      ) : (
        <span className={styles.spinner} />
      )}
    </div>
  )
}

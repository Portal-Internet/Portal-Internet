import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa6'
import { EXTERNAL_LINKS } from '@/shared/lib/contacts'

const NETWORKS = [
  { label: 'Instagram', href: EXTERNAL_LINKS.instagram, Icon: FaInstagram },
  { label: 'Facebook', href: EXTERNAL_LINKS.facebook, Icon: FaFacebook },
  { label: 'YouTube', href: EXTERNAL_LINKS.youtube, Icon: FaYoutube },
] as const

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={className}>
      {NETWORKS.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
        >
          <Icon aria-hidden="true" size={22} />
        </a>
      ))}
    </div>
  )
}

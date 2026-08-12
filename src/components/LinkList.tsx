import { links } from '../data/content'
import { IconArrow } from './Icons'
import { Picture } from './Picture'
import './LinkList.css'

export function LinkList() {
  return (
    <ul className="link-list">
      {links.map((link) => (
        <li key={link.title}>
          <a
            className="link-row"
            href={link.href}
            target="_blank"
            rel="noreferrer"
          >
            <div
              className="link-row__media"
              style={{ backgroundColor: link.imageBg }}
            >
              <Picture
                src={link.image}
                alt=""
                width={640}
                height={640}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="link-row__body">
              <span className="link-row__wipe" aria-hidden />
              <div className="link-row__copy">
                <p className="eyebrow">Highlight:</p>
                <h2 className="link-row__title">{link.title}</h2>
                <p className="link-row__desc">{link.description}</p>
              </div>
              <span className="link-row__arrow" aria-hidden>
                <IconArrow />
              </span>
            </div>
          </a>
        </li>
      ))}
    </ul>
  )
}

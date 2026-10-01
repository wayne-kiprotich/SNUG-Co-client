import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { EVENTS, track } from '../../lib/analytics'
import { AVAILABILITY_LABEL, formatPrice } from '../../lib/format'
import { absoluteUrl } from '../../lib/seo'
import { orderMessage, restockMessage, whatsappLink } from '../../lib/whatsapp'
import { WhatsAppIcon } from '../Icons'
import { ChoiceGroup, QuantitySelector, TextOption } from './VariantSelector'

const OUT_OF_REACH = new Set(['sold-out', 'coming-soon'])

export function OrderPanel({ product }) {
  const [color, setColor] = useState(product.colors?.length === 1 ? product.colors[0].name : null)
  const [size, setSize] = useState(product.sizes?.length === 1 ? product.sizes[0] : null)
  const [options, setOptions] = useState({})
  const [quantity, setQuantity] = useState(1)
  const [errors, setErrors] = useState({})
  const [ctaVisible, setCtaVisible] = useState(true)

  const refs = { color: useRef(null), size: useRef(null) }
  const optionRefs = useRef({})
  const ctaRef = useRef(null)

  const unavailable = OUT_OF_REACH.has(product.availability)
  const productUrl = absoluteUrl(`/product/${product.slug}`)
  const selection = { color, size, options, quantity }

  const href = unavailable
    ? whatsappLink(restockMessage({ product, productUrl }))
    : whatsappLink(orderMessage({ product, selection, productUrl }))

  useEffect(() => {
    const el = ctaRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setCtaVisible(entry.isIntersecting), { rootMargin: '0px 0px -40px 0px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  function validate() {
    const next = {}
    if (product.colors?.length && !color) next.color = 'Choose a colour to continue.'
    if (product.sizes?.length && !size) next.size = 'Choose a size to continue.'
    for (const option of product.options ?? []) {
      if (option.required && !options[option.name]?.trim()) {
        next[`option:${option.name}`] = option.type === 'text' ? `Tell us the ${option.name.toLowerCase()}.` : `Choose a ${option.name.toLowerCase()}.`
      }
    }
    setErrors(next)
    const first = Object.keys(next)[0]
    if (first) {
      const target = first.startsWith('option:') ? optionRefs.current[first.slice(7)] : refs[first].current
      target?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      target?.focus({ preventScroll: true })
    }
    return !first
  }

  function handleOrder(event, placement) {
    if (unavailable) {
      track(EVENTS.whatsappClicked, { placement: 'restock', product: product.slug })
      return
    }
    if (!validate()) {
      event.preventDefault()
      return
    }
    track(EVENTS.whatsappOrderClicked, {
      product: product.slug,
      price: product.priceKES,
      color,
      size,
      quantity,
      placement,
    })
  }

  const setOption = (name, value) => {
    setOptions((o) => ({ ...o, [name]: value }))
    setErrors((e) => ({ ...e, [`option:${name}`]: undefined }))
  }

  const ctaLabel = unavailable ? 'Ask about restock' : 'Order on WhatsApp'
  const availabilityText = product.madeToOrder && !unavailable ? 'Made on order' : AVAILABILITY_LABEL[product.availability]

  return (
    <div>
      <p className={`text-[1.25rem] ${product.priceKES == null ? 'text-stone' : ''}`} style={{ fontStretch: '104%' }}>
        {formatPrice(product.priceKES)}
        {product.compareAtPriceKES && product.priceKES != null && (
          <s className="ml-3 text-base text-stone">{formatPrice(product.compareAtPriceKES)}</s>
        )}
      </p>
      <p className={`mt-1 text-sm ${unavailable ? 'font-medium text-alert' : 'text-stone'}`}>{availabilityText}</p>

      <div className="mt-8 space-y-7">
        {product.colors?.length > 0 && (
          <ChoiceGroup
            label="Colour"
            name={`${product.slug}-colour`}
            values={product.colors.map((c) => c.name)}
            swatches={Object.fromEntries(product.colors.map((c) => [c.name, c.swatch]))}
            value={color}
            onChange={(v) => {
              setColor(v)
              setErrors((e) => ({ ...e, color: undefined }))
            }}
            error={errors.color}
            groupRef={refs.color}
          />
        )}

        {product.sizes?.length > 0 ? (
          <ChoiceGroup
            label="Size"
            name={`${product.slug}-size`}
            values={product.sizes}
            value={size}
            onChange={(v) => {
              setSize(v)
              setErrors((e) => ({ ...e, size: undefined }))
            }}
            error={errors.size}
            groupRef={refs.size}
          />
        ) : (
          <div className="border-l-2 border-taupe pl-4 text-[0.9375rem]">
            <p>Size</p>
            <p className="mt-1 text-stone">{product.sizesNote || 'Tell us your size on WhatsApp and we’ll confirm the fit.'}</p>
          </div>
        )}

        {(product.options ?? []).map((option) =>
          option.type === 'text' ? (
            <TextOption
              key={option.name}
              label={option.name}
              placeholder={option.placeholder}
              value={options[option.name] ?? ''}
              onChange={(v) => setOption(option.name, v)}
              error={errors[`option:${option.name}`]}
              inputRef={(el) => (optionRefs.current[option.name] = el)}
            />
          ) : (
            <ChoiceGroup
              key={option.name}
              label={option.name}
              name={`${product.slug}-${option.name}`}
              values={option.values}
              value={options[option.name] ?? null}
              onChange={(v) => setOption(option.name, v)}
              error={errors[`option:${option.name}`]}
              groupRef={(el) => (optionRefs.current[option.name] = el)}
            />
          ),
        )}

        {!unavailable && <QuantitySelector value={quantity} onChange={setQuantity} />}
      </div>

      <p className="mt-8 max-w-md text-[1.0625rem] leading-relaxed">{product.description}</p>

      <div ref={ctaRef} className="mt-8">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => handleOrder(e, 'panel')}
          className="btn btn-primary min-h-14 w-full text-base"
        >
          <WhatsAppIcon />
          {ctaLabel}
        </a>
        <p className="mt-3 text-sm text-stone">
          {unavailable
            ? 'We’ll let you know on WhatsApp when it’s back.'
            : 'You’ll confirm availability, payment and delivery with us on WhatsApp.'}{' '}
          <Link to="/shipping-and-orders" className="link">
            How ordering works
          </Link>
        </p>
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-4 py-3 transition-transform duration-300 lg:hidden ${
          ctaVisible ? 'translate-y-full' : 'translate-y-0'
        }`}
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        aria-hidden={ctaVisible}
        inert={ctaVisible ? true : undefined}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">{product.name}</p>
            <p className={`text-sm ${product.priceKES == null ? 'text-stone' : ''}`}>{formatPrice(product.priceKES)}</p>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleOrder(e, 'sticky')}
            className="btn btn-primary shrink-0 px-5"
          >
            <WhatsAppIcon width={18} height={18} />
            {unavailable ? 'Ask about restock' : 'Order'}
          </a>
        </div>
      </div>
    </div>
  )
}

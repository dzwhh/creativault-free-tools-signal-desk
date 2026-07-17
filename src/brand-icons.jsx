// Official brand logos (react-icons / Simple Icons) and SVG country flags
// (country-flag-icons) shared by the free-tool selects and the homepage marquee.
import React from 'react'
import {
  SiAppstore, SiFacebook, SiGoogleads, SiGoogleplay, SiInstagram, SiMeta,
  SiShopify, SiSnapchat, SiTiktok, SiYoutube,
} from 'react-icons/si'
import { DE, FR, GB, JP, US } from 'country-flag-icons/react/3x2'

// Keyed by lowercase option label. Colors follow each platform's brand
// guidelines, adjusted where the official color is illegible on white.
const brands = {
  tiktok: { Icon: SiTiktok, color: '#000000' },
  instagram: { Icon: SiInstagram, color: '#E4405F' },
  'instagram reels': { Icon: SiInstagram, color: '#E4405F' },
  youtube: { Icon: SiYoutube, color: '#FF0000' },
  'youtube shorts': { Icon: SiYoutube, color: '#FF0000' },
  meta: { Icon: SiMeta, color: '#0866FF' },
  facebook: { Icon: SiFacebook, color: '#0866FF' },
  snapchat: { Icon: SiSnapchat, color: '#E5B800' },
  shopify: { Icon: SiShopify, color: '#95BF47' },
  'google ads': { Icon: SiGoogleads, color: '#4285F4' },
  'google play': { Icon: SiGoogleplay, color: '#01875F' },
  'app store': { Icon: SiAppstore, color: '#0D96F6' },
}

const flags = {
  'united states': US,
  'united kingdom': GB,
  germany: DE,
  france: FR,
  japan: JP,
}

export function BrandIcon({ name, size = 15 }) {
  const brand = brands[String(name).toLowerCase()]
  if (!brand) return null
  const { Icon, color } = brand
  return <Icon size={size} color={color} aria-hidden="true" />
}

export function CountryFlag({ name, width = 17 }) {
  const Flag = flags[String(name).toLowerCase()]
  if (!Flag) return null
  return <Flag className="option-flag" style={{ width }} aria-hidden="true" />
}

export const hasBrandIcon = (name) => Boolean(brands[String(name).toLowerCase()])
export const hasCountryFlag = (name) => Boolean(flags[String(name).toLowerCase()])

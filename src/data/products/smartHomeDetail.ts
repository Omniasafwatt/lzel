import type { LucideIcon } from 'lucide-react'
import {
  Video, Moon, ScanFace, HardDrive, Cloud, Wifi, Smartphone, ShieldCheck, Move3d, Crosshair,
  Sun, BatteryFull, Mic, Bell, Eye, Wind, Hand, Sparkles, Sofa, BedDouble, Monitor, BookOpen,
  UtensilsCrossed, Baby, Droplets, SlidersHorizontal, Lamp, Palette, Package, CircleDot, Power,
  Car, Clock, Flame, Magnet, MapPin, RotateCw, Navigation, Phone, Music, Map, Zap, Fan,
} from 'lucide-react'
import type { Product } from '@/types'
import { modelOf } from './smartHomeLayout'

// Lifestyle images made by scripts/generate-smart-home-scenes.mjs
const FILES = import.meta.glob('/src/assets/smart home/scenes/*/*.webp', { eager: true, import: 'default' }) as Record<string, string>

export interface Scenes { hero?: string; uses: string[]; places: string[]; stats: string[] }

export function scenesOf(p: Product): Scenes {
  const dir = `/src/assets/smart home/scenes/${modelOf(p)}/`
  const f = (name: string) => FILES[dir + name + '.webp']
  return {
    hero: f('hero-wide'),
    uses: ['use-1', 'use-2', 'use-3'].map(f).filter(Boolean),
    places: ['place-1', 'place-2'].map(f).filter(Boolean),
    stats: ['stat-1', 'stat-2'].map(f).filter(Boolean),
  }
}

type Item = { icon: LucideIcon; label: string }
type Stat = { value: string; label: string; title: string; text: string }

export interface DetailContent {
  introTitle: string
  features: Item[]
  ringTitle: string
  ringText: string
  ring: Item[]
  usesTitle: string
  usesText: string
  uses: string[]
  stats: Stat[]
  placeTitle: string
  placeText: string
  places: string[]
}

const spec = (p: Product, label: string) => p.specifications.find((s) => s.label === label)?.value

// ── Shared blocks ────────────────────────────────────────────────────────────
const CAMERA_CORE: Item[] = [
  { icon: Video, label: '2K QHD video' },
  { icon: Moon, label: 'Colour night vision up to 10m' },
  { icon: ScanFace, label: 'AI human & motion detection' },
  { icon: HardDrive, label: 'MicroSD up to 256GB' },
  { icon: Cloud, label: 'Cloud storage' },
  { icon: Wifi, label: 'Dual-band 2.4 / 5GHz Wi-Fi' },
  { icon: Smartphone, label: 'aslitec Eva App' },
  { icon: ShieldCheck, label: 'IP66 weatherproof' },
]

const ROOMS: Item[] = [
  { icon: Sofa, label: 'Living room' },
  { icon: BedDouble, label: 'Bedroom' },
  { icon: Monitor, label: 'Home office' },
  { icon: BookOpen, label: 'Study' },
  { icon: UtensilsCrossed, label: 'Dining room' },
  { icon: Baby, label: "Kids' room" },
]

const camera = (p: Product, extra: Item[], stat2: Stat, places: string[], uses?: string[]): DetailContent => ({
  introTitle: 'Peace of mind, in every corner',
  features: [...extra, ...CAMERA_CORE].slice(0, 8),
  ringTitle: 'Everything in the aslitec Eva App',
  ringText: `Pair the ${modelOf(p)} with the aslitec Eva App on iOS or Android to watch live, get alerts the moment something moves and keep recordings on a MicroSD card or in the cloud.`,
  ring: [
    { icon: Eye, label: 'Live view' },
    { icon: Bell, label: 'Motion alerts' },
    { icon: Moon, label: 'Night vision' },
    { icon: HardDrive, label: 'MicroSD' },
    { icon: Cloud, label: 'Cloud' },
    { icon: Wifi, label: 'Dual-band Wi-Fi' },
  ],
  usesTitle: 'Always watching, so you don’t have to',
  usesText: 'Clear 2K video by day and colour night vision after dark, with AI that tells people apart from other movement.',
  uses: uses ?? ['See clearly at night', 'Watch live from anywhere', 'Know when someone’s there'],
  stats: [
    { value: '2K', label: 'QHD resolution', title: 'Sharper than Full HD', text: '2304 × 1296 video makes faces, plates and parcels easier to make out.' },
    stat2,
  ],
  placeTitle: 'Easy setup, great convenience',
  placeText: 'Connect it to your Wi-Fi with the aslitec Eva App, then put it where you need it.',
  places,
})

const mount = (p: Product, uses: string[], places: string[]): DetailContent => ({
  introTitle: 'Snap on. Drive off.',
  features: [
    { icon: Magnet, label: spec(p, 'Holding') ?? 'Magnetic ring' },
    { icon: MapPin, label: spec(p, 'Mounting') ?? '' },
    { icon: RotateCw, label: spec(p, 'Adjustment') ?? spec(p, 'Arm') ?? '' },
    { icon: Palette, label: spec(p, 'Finish') ?? spec(p, 'Color') ?? '' },
    { icon: Navigation, label: 'Maps at eye level' },
    { icon: Zap, label: 'One-hand snap on & off' },
  ].filter((f) => f.label),
  ringTitle: 'Made for every drive',
  ringText: 'Keep your phone where you can see it, from the daily commute to the longest road trip.',
  ring: [
    { icon: Navigation, label: 'Navigation' },
    { icon: Phone, label: 'Calls' },
    { icon: Music, label: 'Music' },
    { icon: Car, label: 'Ride-hailing' },
    { icon: Map, label: 'Road trips' },
    { icon: Clock, label: 'Commute' },
  ],
  usesTitle: 'Your phone, right where you need it',
  usesText: p.description,
  uses,
  stats: [
    { value: '1', label: 'Hand to mount', title: 'Snap it on', text: 'The magnetic ring catches your phone, so mounting and removing it takes one hand.' },
    { value: '0', label: 'Clamp arms', title: 'Nothing to squeeze', text: 'No spring grips to open and close: the magnet does the holding.' },
  ],
  placeTitle: 'Easy setup, great convenience',
  placeText: `${spec(p, 'Mounting') ?? 'The base'} keeps setup quick, with nothing to wire.`,
  places,
})

// ── Per-product content ─────────────────────────────────────────────────────
export function detailOf(p: Product): DetailContent {
  const t = p.tags
  if (t.includes('indoor')) return {
    introTitle: 'Keep an eye on home',
    features: [
      { icon: Move3d, label: 'Pan & tilt head' },
      { icon: Sparkles, label: spec(p, 'Design') ?? '' },
      { icon: HardDrive, label: spec(p, 'Storage') ?? '' },
      { icon: Palette, label: spec(p, 'Color') ?? '' },
    ].filter((f) => f.label),
    ringTitle: 'Made for every room',
    ringText: `Put the ${modelOf(p)} on a shelf, desk or sideboard and turn its head toward whatever you want to watch.`,
    ring: ROOMS,
    usesTitle: 'Look in on what matters',
    usesText: p.description,
    uses: ['The living room', 'The home office', 'The bedroom'],
    stats: [],
    placeTitle: 'Fits in anywhere',
    placeText: 'A compact indoor body that sits neatly on a shelf or a desk.',
    places: ['On a shelf', 'On a desk'],
  }
  if (t.includes('ptz')) return camera(p,
    [{ icon: Move3d, label: '355° pan / 90° tilt' }, { icon: Crosshair, label: 'AI auto-tracking' }],
    { value: '355°', label: 'Pan coverage', title: 'One camera, the whole space', text: 'Pan 355° and tilt 90° to follow movement and cover every corner from a single device.' },
    ['On a shelf', 'On an outside wall'])
  if (t.includes('solar')) return camera(p,
    [{ icon: Sun, label: 'Solar powered' }, { icon: BatteryFull, label: '6400mAh battery' }],
    { value: '180', label: 'Days without sun', title: 'Power that keeps going', text: 'The built-in solar panel tops up the 6400mAh battery, which lasts up to 180 days in standby without sun.' },
    ['Outdoors', 'On any wall'])
  if (t.includes('doorbell')) return camera(p,
    [{ icon: Mic, label: 'Two-way audio' }, { icon: Bell, label: 'Instant alerts' }],
    { value: '180°', label: 'Fisheye view', title: 'See the whole doorstep', text: 'A 180° fisheye lens shows visitors head to toe, and parcels left at the door.' },
    ['By the front door', 'On a shelf'],
    ['See visitors at night', 'Answer from anywhere', 'Know who’s at the door'])

  if (t.includes('fan')) return {
    introTitle: 'Cool air, without the blades',
    features: [
      { icon: Wind, label: 'Bladeless air loop' },
      { icon: ShieldCheck, label: 'No exposed blades' },
      { icon: Hand, label: spec(p, 'Controls') ?? 'Touch controls' },
      { icon: Sparkles, label: 'Easy to wipe clean' },
      { icon: Fan, label: spec(p, 'Air Intake') ?? 'Air intake in the base' },
      { icon: Palette, label: spec(p, 'Color') ?? 'White & silver' },
    ],
    ringTitle: 'Made for every room',
    ringText: 'A slim footprint that fits beside the sofa, the bed or the desk.',
    ring: ROOMS,
    usesTitle: 'Comfort wherever you are',
    usesText: p.description,
    uses: ['By the bed', 'Next to your desk', 'In the living room'],
    stats: [
      { value: '0', label: 'Exposed blades', title: 'Safer by design', text: 'Air flows through the loop, so there are no blades to catch little fingers or gather dust.' },
      { value: 'Touch', label: 'Controls', title: 'Simple to use', text: `${spec(p, 'Controls') ?? 'Touch controls'}, right where you reach for them.` },
    ],
    placeTitle: 'Easy to place',
    placeText: 'Stand it on the floor wherever you need a breeze.',
    places: ['Living room', 'Bedroom'],
  }

  if (t.includes('humidifier')) return {
    introTitle: 'Two mists. One calm room.',
    features: [
      { icon: Droplets, label: 'Two mist outlets' },
      { icon: SlidersHorizontal, label: 'Separate left / right control' },
      { icon: Lamp, label: 'Ambient night light' },
      { icon: Hand, label: 'Front touch panel' },
      { icon: Palette, label: 'Cream with champagne trim' },
    ],
    ringTitle: 'Made for every room',
    ringText: 'Run one side for a small room or both for a bigger space.',
    ring: ROOMS,
    usesTitle: 'Comfortable air, day and night',
    usesText: p.description,
    uses: ['A soft glow at night', 'In the living room', 'At your desk'],
    stats: [
      { value: '2', label: 'Mist outlets', title: 'Twice the mist', text: 'Two independent outlets on top let you run one side or both.' },
      { value: 'L / R', label: 'Independent control', title: 'Your mist, your way', text: 'The front touch panel controls the left and right sides separately.' },
    ],
    placeTitle: 'Easy to place',
    placeText: 'Set it on a nightstand, side table or the floor.',
    places: ['Bedside', 'Living room'],
  }

  if (t.includes('portable')) return {
    introTitle: 'Your favourite scent, wherever you go',
    features: [
      { icon: Package, label: 'Compact portable cylinder' },
      { icon: CircleDot, label: 'Glowing light ring' },
      { icon: Power, label: 'Single front button' },
      { icon: Palette, label: 'Black or White' },
      { icon: Car, label: 'Desk, car or bedside' },
    ],
    ringTitle: 'Goes where you go',
    ringText: 'Small enough for a cup holder, a desk or a bedside table.',
    ring: [ROOMS[0], ROOMS[1], ROOMS[2], { icon: Car, label: 'Car' }, ROOMS[3], ROOMS[5]],
    usesTitle: 'A little calm, anywhere',
    usesText: p.description,
    uses: ['At your desk', 'On the road', 'By the bed'],
    stats: [
      { value: '1', label: 'Button', title: 'Simple by design', text: 'One front button is all it takes.' },
      { value: '2', label: 'Colours', title: 'Black or White', text: 'Soft-touch finish in two colours to suit your space.' },
    ],
    placeTitle: 'Easy to place',
    placeText: 'Pocket-sized, so it moves with you.',
    places: ['Bedside', 'In the car'],
  }

  if (t.includes('clock')) return {
    introTitle: 'Scent and time, side by side',
    features: [
      { icon: Clock, label: 'LED digital clock' },
      { icon: Sparkles, label: 'Aroma diffuser' },
      { icon: Flame, label: 'Warm amber glow' },
      { icon: Hand, label: 'Top touch controls' },
      { icon: Moon, label: 'Made for the bedside' },
    ],
    ringTitle: 'Made for every room',
    ringText: 'A bedside clock, a desk companion or a calm corner for the living room.',
    ring: ROOMS,
    usesTitle: 'Wind down, wake up',
    usesText: p.description,
    uses: ['A soft glow at night', 'On your desk', 'In the living room'],
    stats: [
      { value: '2-in-1', label: 'Diffuser + clock', title: 'One device, two jobs', text: 'An aroma diffuser and an LED digital clock in one glossy black block.' },
      { value: 'Warm', label: 'Amber glow', title: 'A light that relaxes', text: 'A warm amber glow rises from the base.' },
    ],
    placeTitle: 'Easy to place',
    placeText: 'Compact enough for any nightstand or shelf.',
    places: ['Bedside', 'On a side table'],
  }

  if (t.includes('stand')) return mount(p, ['At your desk', 'In the car', 'By the bed'], ['At your desk', 'On a table'])
  if (spec(p, 'Mounting')?.toLowerCase().includes('vent')) return mount(p, ['Night drives', 'Daily commute', 'Clips onto the vent'], ['On the air vent', 'On the road'])
  return mount(p, ['Night drives', 'Daily commute', 'At home, too'], ['Daytime drives', 'At night'])
}

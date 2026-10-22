import type { LucideIcon } from 'lucide-react'
import {
  Video, Moon, Move3d, ScanFace, Crosshair, Smartphone, ShieldCheck, Wifi, HardDrive, Sun, BatteryFull,
  Cable, Mic, Bell, Scan, Wind, Sparkles, Hand, Fan, Palette, Ruler, Droplets, SlidersHorizontal, Lamp,
  Package, CircleDot, Power, Clock, Flame, Magnet, Zap, RotateCw, MapPin, Gem, Cloud,
} from 'lucide-react'
import type { Product } from '@/types'
import { modelOf } from './smartHomeLayout'

// RH2-style benefit story for each Smart Home product: three feature pillars,
// numbered benefits (01–03), two full-width spotlights, and copy for the
// use-case cards. Every claim comes from the product's specs and description.
// Images are made by scripts/generate-smart-home-scenes.mjs.
const FILES = import.meta.glob('/src/assets/smart home/scenes/*/*.webp', { eager: true, import: 'default' }) as Record<string, string>

type Item = { icon: LucideIcon; label: string }
type Block = { title: string; text: string }

export interface Story {
  tagline: string
  pillars: { title: string; items: Item[] }[]
  steps: (Block & { image?: string })[]
  spotlights: (Block & { image?: string })[]
  useTexts: string[]
}

const spec = (p: Product, label: string) => p.specifications.find((s) => s.label === label)?.value

function base(p: Product): Omit<Story, 'steps' | 'spotlights'> & { steps: Block[]; spotlights: Block[] } {
  const t = p.tags
  const camUses = [
    'Colour night vision reaches up to 10m, so the picture stays clear long after sunset.',
    'Open the aslitec Eva App on iOS or Android and see what’s happening, right now.',
    'AI human detection tells people apart from other movement and alerts you straight away.',
  ]

  if (t.includes('indoor')) return {
    tagline: 'Home, in view.',
    pillars: [
      { title: 'Turns', items: [{ icon: Move3d, label: 'Pan & tilt head' }, { icon: RotateCw, label: 'Rotating lens housing' }] },
      { title: 'Built in', items: [
        { icon: Sparkles, label: spec(p, 'Design') ?? '' },
        { icon: HardDrive, label: spec(p, 'Storage') ?? '' },
        { icon: CircleDot, label: spec(p, 'Controls') ?? '' },
      ].filter((i) => i.label) },
      { title: 'Finish', items: [{ icon: Palette, label: spec(p, 'Color') ?? '' }, { icon: Gem, label: 'Compact indoor body' }].filter((i) => i.label) },
    ],
    steps: [
      { title: 'Turns toward the action', text: 'The head rotates on its base, so one camera can face the doorway, the sofa or the cot.' },
      { title: 'Sits anywhere indoors', text: 'A compact body that fits on a shelf, a desk or a sideboard.' },
      { title: 'Designed for the room', text: p.description },
    ],
    spotlights: [
      { title: 'Every room, in view', text: 'Turn the camera toward whatever matters, from the living room to the nursery.' },
      { title: 'Small enough for any shelf', text: 'A neat indoor design that blends into the room instead of standing out.' },
    ],
    useTexts: ['Check on the living room.', 'Keep an eye on the home office.', 'Look in on the bedroom.'],
  }

  if (t.includes('ptz')) return {
    tagline: 'One camera. Every corner.',
    pillars: [
      { title: 'Clear', items: [{ icon: Video, label: '2K QHD video' }, { icon: Moon, label: 'Colour night vision up to 10m' }, { icon: Move3d, label: '355° pan / 90° tilt' }] },
      { title: 'Smart', items: [{ icon: ScanFace, label: 'AI human & motion detection' }, { icon: Crosshair, label: 'AI auto-tracking' }, { icon: Smartphone, label: 'aslitec Eva App' }] },
      { title: 'Reliable', items: [{ icon: ShieldCheck, label: 'IP66 weatherproof' }, { icon: Wifi, label: 'Dual-band 2.4 / 5GHz Wi-Fi' }, { icon: HardDrive, label: 'MicroSD up to 256GB + cloud' }] },
    ],
    steps: [
      { title: 'Turns to see everything', text: 'Pan 355° and tilt 90° from the aslitec Eva App, so one camera covers the whole space with no blind spots.' },
      { title: 'Follows what matters', text: 'AI auto-tracking locks onto a moving person and keeps them in frame as they cross the garden.' },
      { title: 'Colour, even after dark', text: 'Colour night vision up to 10m keeps the details that black-and-white night footage misses.' },
    ],
    spotlights: [
      { title: 'Every corner, day and night', text: 'Sweep the whole garden from your phone. 2K QHD (2304 × 1296) keeps faces and number plates readable.' },
      { title: 'Built for the outdoors', text: 'An IP66 weatherproof body keeps it watching through rain and dust, season after season.' },
    ],
    useTexts: camUses,
  }

  if (t.includes('solar')) return {
    tagline: 'Powered by the sun. Free of wires.',
    pillars: [
      { title: 'Clear', items: [{ icon: Video, label: '2K QHD video' }, { icon: Moon, label: 'Colour night vision up to 10m' }, { icon: ScanFace, label: 'AI human & motion detection' }] },
      { title: 'Wire-free', items: [{ icon: Sun, label: 'Built-in solar panel' }, { icon: BatteryFull, label: '6400mAh battery' }, { icon: Clock, label: 'Up to 180 days standby without sun' }] },
      { title: 'Reliable', items: [{ icon: ShieldCheck, label: 'IP66 weatherproof' }, { icon: Wifi, label: 'Dual-band 2.4 / 5GHz Wi-Fi' }, { icon: Cloud, label: 'MicroSD up to 256GB + cloud' }] },
    ],
    steps: [
      { title: 'Charged by daylight', text: 'The built-in solar panel keeps the 6400mAh battery topped up year-round.' },
      { title: 'Mount it anywhere', text: 'With no power cable to run, put it where you need coverage: the gate, the driveway, the back of the garden.' },
      { title: 'Colour, even after dark', text: 'Colour night vision up to 10m keeps the details that black-and-white night footage misses.' },
    ],
    spotlights: [
      { title: 'Watching over the whole garden', text: 'AI human detection and 2K QHD video, wherever you mount it, with no wiring.' },
      { title: 'Ready for every season', text: 'IP66 weatherproof, and up to 180 days of standby even without sun.' },
    ],
    useTexts: camUses,
  }

  if (t.includes('doorbell')) return {
    tagline: 'See, hear and speak to every visitor.',
    pillars: [
      { title: 'See', items: [{ icon: Video, label: '2K QHD video' }, { icon: Scan, label: '180° fisheye view' }, { icon: Moon, label: 'Colour night vision up to 10m' }] },
      { title: 'Talk', items: [{ icon: Mic, label: 'Two-way audio' }, { icon: Bell, label: 'Instant phone alerts' }, { icon: Smartphone, label: 'aslitec Eva App' }] },
      { title: 'Reliable', items: [{ icon: Cable, label: 'Wired 8–24V AC power' }, { icon: Wifi, label: 'Dual-band 2.4 / 5GHz Wi-Fi' }, { icon: HardDrive, label: 'MicroSD up to 256GB + cloud' }] },
    ],
    steps: [
      { title: 'The whole doorstep in view', text: 'A 180° fisheye lens shows visitors head to toe, and the parcels left at the door.' },
      { title: 'Talk from anywhere', text: 'Two-way audio lets you see, hear and speak to visitors through the aslitec Eva App, wherever you are.' },
      { title: 'Clear at night, too', text: 'Colour night vision up to 10m keeps late callers in clear view.' },
    ],
    spotlights: [
      { title: 'Answer the door from anywhere', text: 'Instant phone alerts the moment someone arrives, with 2K video of who’s there.' },
      { title: 'Always on, all night', text: 'Wired 8–24V AC power means no battery to recharge, so it keeps watching around the clock.' },
    ],
    useTexts: ['Colour night vision keeps late visitors in clear view.', 'Answer from the aslitec Eva App, wherever you are.', 'Instant alerts the moment someone reaches your door.'],
  }

  if (t.includes('fan')) return {
    tagline: 'Cool air. No blades.',
    pillars: [
      { title: 'Safe', items: [{ icon: ShieldCheck, label: 'No exposed blades' }, { icon: Wind, label: spec(p, 'Design') ?? 'Bladeless air loop' }, { icon: Sparkles, label: 'Smooth, easy-wipe surfaces' }] },
      { title: 'Simple', items: [{ icon: Hand, label: spec(p, 'Controls') ?? 'Touch controls' }, { icon: Fan, label: spec(p, 'Air Intake') ?? 'Air intake in the base' }] },
      { title: 'Stylish', items: [{ icon: Palette, label: spec(p, 'Color') ?? 'White & silver' }, { icon: Ruler, label: 'Slim floor-standing tower' }] },
    ],
    steps: [
      { title: 'Air without blades', text: `Air is drawn in through ${(spec(p, 'Air Intake') ?? 'the base').replace(/^./, (c) => c.toLowerCase())} and pushed out through the loop, with nothing spinning in reach.` },
      { title: 'A quick wipe and it’s clean', text: 'Smooth surfaces and no blade cage to take apart: cleaning takes seconds.' },
      { title: 'Control at a touch', text: `${spec(p, 'Controls') ?? 'Touch controls'}, right where you reach for them.` },
    ],
    spotlights: [
      { title: 'Comfort that fits your space', text: 'A slim tower that stands beside the sofa, the bed or the desk.' },
      { title: 'Designed to be seen', text: `${spec(p, 'Color') ?? 'White and silver'}: a sculpted shape that looks at home in any room.` },
    ],
    useTexts: ['Gentle, blade-free air beside the bed.', 'A slim tower that fits next to your desk.', 'Cool the living room without a bulky fan cage.'],
  }

  if (t.includes('humidifier')) return {
    tagline: 'Two mists. One calm room.',
    pillars: [
      { title: 'Comfort', items: [{ icon: Droplets, label: 'Two mist outlets' }, { icon: SlidersHorizontal, label: 'Separate left / right control' }] },
      { title: 'Calm', items: [{ icon: Lamp, label: 'Ambient night light' }, { icon: Moon, label: 'Made for the bedroom' }] },
      { title: 'Simple', items: [{ icon: Hand, label: 'Front touch panel' }, { icon: Palette, label: 'Cream with champagne trim' }] },
    ],
    steps: [
      { title: 'One side or both', text: 'Two independent mist outlets on top: run one for a small room, or both when you need more.' },
      { title: 'Left and right, separately', text: 'The front touch panel controls each side on its own.' },
      { title: 'A gentle night light', text: 'A soft glow from the base, so you can find it in the dark without a bright lamp.' },
    ],
    spotlights: [
      { title: 'Comfortable air, all night', text: 'Set it on the nightstand and let the mist do its work while you sleep.' },
      { title: 'A soft glow after dark', text: 'The ambient night light in the base keeps the room calm and easy to move around.' },
    ],
    useTexts: ['Mist and a gentle glow for restful nights.', 'Twin outlets for a bigger living space.', 'Comfortable air at your desk all day.'],
  }

  if (t.includes('portable')) return {
    tagline: 'Your favourite scent, wherever you go.',
    pillars: [
      { title: 'Portable', items: [{ icon: Package, label: 'Compact portable cylinder' }, { icon: MapPin, label: 'Desk, car or bedside' }] },
      { title: 'Ambient', items: [{ icon: CircleDot, label: 'Glowing light ring' }, { icon: Sparkles, label: 'Aroma diffuser' }] },
      { title: 'Simple', items: [{ icon: Power, label: 'Single front button' }, { icon: Palette, label: 'Black or White' }] },
    ],
    steps: [
      { title: 'Scent, on the go', text: 'Pocket-sized and soft to the touch, it moves with you from room to room.' },
      { title: 'A ring of light', text: 'The glowing light ring marks it out on a desk, in the car or at the bedside.' },
      { title: 'One button, that’s it', text: 'A single front button keeps it simple.' },
    ],
    spotlights: [
      { title: 'Your desk, refreshed', text: 'A little calm beside the keyboard, all day long.' },
      { title: 'A soft glow by the bed', text: 'The light ring and a gentle scent to help you wind down.' },
    ],
    useTexts: ['A gentle scent while you work.', 'Fits in the car for the drive.', 'A calming glow at the bedside.'],
  }

  if (t.includes('clock')) return {
    tagline: 'Scent and time, side by side.',
    pillars: [
      { title: '2-in-1', items: [{ icon: Sparkles, label: 'Aroma diffuser' }, { icon: Clock, label: 'LED digital clock' }] },
      { title: 'Calm', items: [{ icon: Flame, label: 'Warm amber glow' }, { icon: Moon, label: 'Made for the bedside' }] },
      { title: 'Simple', items: [{ icon: Hand, label: 'Top touch controls' }, { icon: Gem, label: 'Gloss black finish' }] },
    ],
    steps: [
      { title: 'Diffuser and clock in one', text: 'One glossy black block replaces two things on your nightstand.' },
      { title: 'Time at a glance', text: 'The LED time display shows through the front, easy to read from bed.' },
      { title: 'A warm amber glow', text: 'Light rises softly from the base: relaxing at night and never harsh.' },
    ],
    spotlights: [
      { title: 'Wind down with scent', text: 'Mist from the top, the time on the front, a calm glow underneath.' },
      { title: 'Soft light for the night', text: 'The warm amber glow keeps the bedroom gentle after dark.' },
    ],
    useTexts: ['A soft glow and gentle scent at night.', 'Keeps time beside your desk.', 'A calm corner for the living room.'],
  }

  // Magnetic mounts
  const mounting = spec(p, 'Mounting') ?? 'Easy mounting'
  const adjust = spec(p, 'Adjustment') ?? spec(p, 'Arm') ?? 'Adjustable'
  return {
    tagline: 'Snap on. Drive off.',
    pillars: [
      { title: 'Secure', items: [{ icon: Magnet, label: spec(p, 'Holding') ?? 'Magnetic ring' }, { icon: Zap, label: 'One-hand snap on & off' }] },
      { title: 'Flexible', items: [{ icon: RotateCw, label: adjust }, { icon: MapPin, label: mounting }] },
      { title: 'Clean', items: [{ icon: Gem, label: spec(p, 'Finish') ?? spec(p, 'Color') ?? 'Black' }, { icon: Sparkles, label: 'No clamp arms' }] },
    ],
    steps: [
      { title: 'Snap on, snap off', text: 'The magnetic ring catches your phone, so mounting and removing it takes one hand.' },
      { title: 'Set the perfect angle', text: `${adjust} lets you turn the phone exactly where you can see it.` },
      { title: 'Mounts where you want it', text: `${mounting}, quick to set up, with nothing to wire.` },
    ],
    spotlights: [
      { title: 'Maps where you can see them', text: 'Keep navigation at eye level and your hands on the wheel.' },
      { title: 'Ready for the drive home', text: 'Your phone stays in view, from the morning commute to the late drive back.' },
    ],
    useTexts: ['Your phone in view on night drives.', 'Snap on for the daily commute.', p.tags.includes('stand') ? 'Doubles as a desk stand.' : 'Easy to take on and off.'],
  }
}

export function storyOf(p: Product): Story {
  const dir = `/src/assets/smart home/scenes/${modelOf(p)}/`
  const b = base(p)
  return {
    ...b,
    steps: b.steps.map((s, i) => ({ ...s, image: FILES[`${dir}step-${i + 1}.webp`] })),
    spotlights: b.spotlights.map((s, i) => ({ ...s, image: FILES[`${dir}spot-${i + 1}-wide.webp`] })),
  }
}

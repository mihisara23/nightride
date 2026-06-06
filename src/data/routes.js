export const routes = [
  {
    id: 1,
    name: 'Bundoora → Epping via Preston',
    price: 6,
    departure: '9:00 PM',
    seats: 8,
    maxSeats: 8,
    stops: [
      { name: 'Bundoora', time: '9:00 PM' },
      { name: 'Preston', time: '9:15 PM' },
      { name: 'Epping', time: '9:30 PM' },
    ],
    segmentPrices: {
      'Bundoora-Preston': 4,
      'Bundoora-Epping': 6,
      'Preston-Epping': 3,
    },
  },
  {
    id: 2,
    name: 'Bundoora → Craigieburn via Thomastown',
    price: 10,
    departure: '10:00 PM',
    seats: 5,
    maxSeats: 5,
    stops: [
      { name: 'Bundoora', time: '10:00 PM' },
      { name: 'Thomastown', time: '10:20 PM' },
      { name: 'Craigieburn', time: '10:45 PM' },
    ],
    segmentPrices: {
      'Bundoora-Thomastown': 5,
      'Bundoora-Craigieburn': 10,
      'Thomastown-Craigieburn': 6,
    },
  },
  {
    id: 3,
    name: 'Bundoora → Wollert via Epping',
    price: 8,
    departure: '11:00 PM',
    seats: 3,
    maxSeats: 3,
    stops: [
      { name: 'Bundoora', time: '11:00 PM' },
      { name: 'Epping', time: '11:25 PM' },
      { name: 'Wollert', time: '11:50 PM' },
    ],
    segmentPrices: {
      'Bundoora-Epping': 6,
      'Bundoora-Wollert': 8,
      'Epping-Wollert': 3,
    },
  },
]

/* Keep backward compat for any code still importing pickupStops */
export const pickupStops = routes
const photo = (id: string) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=2000&h=1300&fit=crop`;

export const IMAGES = {
  heroAuto: photo('11877375'),
  heroHome: photo('186077'),
  sedanPair: photo('19978403'),
  sedanRoad: photo('32018030'),
  suvFog: photo('27383864'),
  suvDesert: photo('2994133'),
  mechanicLift: photo('8985517'),
  mechanicRepair: photo('8985664'),
  mechanicHands: photo('8478259'),
  engineDetail: photo('3757226'),
  engineBelts: photo('15684925'),
  homeDusk: photo('15369780'),
  homeBrick: photo('18462221'),
  kitchenModern: photo('6527057'),
  kitchenWood: photo('8146322'),
  kitchenRound: photo('7166645'),
  hvacInspect: photo('32497161'),
  hvacRepair: photo('7347538'),
  plumbing: photo('29226620'),
  electrical: photo('32497160'),
  livingRoom: photo('36777507'),
  diningRoom: photo('1327369'),
  tuscanyRoom: photo('38127108'),
} as const;

export type ImageKey = keyof typeof IMAGES;

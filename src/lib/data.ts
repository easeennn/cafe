export const products = [
  { id: '01', name: 'Espresso', description: 'Double shot, dense crema.', price: '$2.50', image: 'iced-1' },
  { id: '02', name: 'Latte', description: 'Silky milk, slow-roast base.', price: '$4.20', image: 'iced-2' },
  { id: '03', name: 'Iced Coffee', description: 'Cold brewed for 18 hours.', price: '$4.50', image: 'iced-3' },
  { id: '04', name: 'Cinnamon Roll', description: 'Baked at six, gone by ten.', price: '$3.70', image: 'iced-4' },
] as const;
export const bagTags = [
  { eyebrow: '// IN THE BAG', name: 'SLOW ROAST', price: '$18.00', meta: '250 G · WHOLE BEAN · SMALL BATCH' },
  { eyebrow: '// ON THE BAR', name: 'HOUSE LATTE', price: '$4.20', meta: '350 ML · OAT OR WHOLE · DAILY' },
];
export const nav = [
  { label: 'Shop', id: 'menu' }, { label: 'Menu', id: 'menu' }, { label: 'Our Story', id: 'philosophy' }, { label: 'Locations', id: 'location' },
];
/** Favorites carousel (photos: public/images/fav-1…6.webp) and the gallery wall behind it (gallery-1…4.webp). */
export const favorites = [
  { name: 'Espresso', image: 'fav-1', shape: 'aspect-[4/5] mt-[5vw] md:mt-[3.5vw]' },
  { name: 'Latte', image: 'fav-2', shape: 'aspect-[3/4] mt-0' },
  { name: 'Iced Coffee', image: 'fav-3', shape: 'aspect-[4/5] mt-[8vw] md:mt-[5vw]' },
  { name: 'Cinnamon Roll', image: 'fav-4', shape: 'aspect-[5/6] mt-[2vw] md:mt-[1vw]' },
  { name: 'Matcha', image: 'fav-5', shape: 'aspect-[3/4] mt-[6vw] md:mt-[4vw]' },
  { name: 'Cold Brew', image: 'fav-6', shape: 'aspect-[4/5] mt-0' },
] as const;
export const gallery = ['gallery-1', 'gallery-2', 'gallery-3', 'gallery-4'] as const;

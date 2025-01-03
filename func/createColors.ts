// R, G, B değerleri için belirli bir aralıkta rastgele bir sayı döndüren yardımcı fonksiyon
const getRandomValueInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Rastgele renk üreten fonksiyon
const generateRandomColor = (
  rRange: [number, number],
  gRange: [number, number],
  bRange: [number, number]
): string => {
  // Renk bileşenlerini belirlenen aralıklar içinde rastgele oluştur
  const r = getRandomValueInRange(rRange[0], rRange[1]);
  const g = getRandomValueInRange(gRange[0], gRange[1]);
  const b = getRandomValueInRange(bRange[0], bRange[1]);

  // HEX formatında renk döndür
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

// Birden fazla rastgele renk üreten fonksiyon
const generateRandomColors = (
  count: number,
  rRange: [number, number] = [0, 255],
  gRange: [number, number] = [0, 255],
  bRange: [number, number] = [0, 255]
): string[] => {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(generateRandomColor(rRange, gRange, bRange));
  }
  return colors;
};

// Test et: Örneğin, 5 adet rastgele mor-pembe tonlarında renk üret
const randomColors = generateRandomColors(
  100,
  [150, 255],
  [0, 150],
  [150, 255]
);
console.log(randomColors); // ["#d48bff", "#c478c3", "#f056ed", ...]

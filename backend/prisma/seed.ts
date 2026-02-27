import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding countries...');

  const countries = [
    {
      code: 'bd',
      name: 'Bangladesh',
      nameNative: 'বাংলাদেশ',
      flag: '🇧🇩',
      language: 'bn',
      currency: 'BDT',
      timezone: 'Asia/Dhaka',
      themeColor: '#006A4E',
    },
    {
      code: 'pk',
      name: 'Pakistan',
      nameNative: 'پاکستان',
      flag: '🇵🇰',
      language: 'ur',
      currency: 'PKR',
      timezone: 'Asia/Karachi',
      themeColor: '#01411C',
    },
    {
      code: 'in',
      name: 'India',
      nameNative: 'भारत',
      flag: '🇮🇳',
      language: 'hi',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      themeColor: '#FF9932',
    },
    {
      code: 'np',
      name: 'Nepal',
      nameNative: 'नेपाल',
      flag: '🇳🇵',
      language: 'ne',
      currency: 'NPR',
      timezone: 'Asia/Kathmandu',
      themeColor: '#DC143C',
    },
    {
      code: 'lk',
      name: 'Sri Lanka',
      nameNative: 'ශ්‍රී ලංකාව',
      flag: '🇱🇰',
      language: 'si',
      currency: 'LKR',
      timezone: 'Asia/Colombo',
      themeColor: '#FFBE29',
    },
    {
      code: 'vn',
      name: 'Vietnam',
      nameNative: 'Việt Nam',
      flag: '🇻🇳',
      language: 'vi',
      currency: 'VND',
      timezone: 'Asia/Ho_Chi_Minh',
      themeColor: '#DA020E',
    },
  ];

  for (const country of countries) {
    await prisma.country.upsert({
      where: { code: country.code },
      update: country,
      create: country,
    });
    console.log(`✅ ${country.name} (${country.nameNative})`);
  }

  console.log('✅ Countries seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

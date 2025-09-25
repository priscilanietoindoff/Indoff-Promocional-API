//Seed que carga los datos para la base de datos de prueba ya si poder probar funcionalidades
import { PrismaClient, Role, CartStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

type SeedSubcat = { name: string; nameEn?: string };
type SeedCat = { name: string; nameEn?: string; subcats: SeedSubcat[] };

const CATALOG: SeedCat[] = [
  {
    name: 'Recruiting',
    nameEn: 'Recruiting',
    subcats: [
      { name: 'Gorras' },
      { name: 'Plumas' },
      { name: 'Mochilas' },
      { name: 'Tazas' },
      { name: 'Libretas' },
      { name: 'Playeras' },
    ],
  },
  {
    name: 'Retention',
    nameEn: 'Retention',
    subcats: [
      { name: 'Termos' },
      { name: 'Sudaderas' },
      { name: 'Mochilas' },
      { name: 'Tazas' },
      { name: 'Libretas' },
      { name: 'Plumas' },
    ],
  },
  {
    name: 'Recognition',
    nameEn: 'Recognition',
    subcats: [
      { name: 'Trofeos' },
      { name: 'Medallas' },
      { name: 'Placas' },
      { name: 'Pins' },
      { name: 'Gafetes' },
      { name: 'Reconocimientos' },
    ],
  },
];

function buildAttributes(subcatName: string) {
  // Atributos de ejemplo; en ropa incluimos tallas, en otros solo color/dimensiones
  const base = {
    colors: ['azul', 'negro', 'blanco'],
    dimensions: { widthMm: 80, heightMm: 120, depthMm: 10 },
    material: 'genérico',
  };
  const wearables = ['Gorras', 'Playeras', 'Sudaderas'];
  if (wearables.includes(subcatName)) {
    return { ...base, sizes: ['S', 'M', 'L'] };
  }
  return base;
}

async function seedCatalog() {
  for (const cat of CATALOG) {
    const catSlug = slugify(cat.name);
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        nameEn: cat.nameEn ?? cat.name,
        slug: catSlug,
        slugEn: slugify(cat.nameEn ?? cat.name),
        imageUrl: `https://picsum.photos/seed/cat-${catSlug}/960/540`,
        imageAlt: cat.name,
        isActive: true,
      },
    });

    for (const sub of cat.subcats) {
      const subSlug = slugify(sub.name);
      const subcategory = await prisma.subcategory.create({
        data: {
          name: sub.name,
          nameEn: sub.nameEn ?? sub.name,
          slug: subSlug,
          slugEn: slugify(sub.nameEn ?? sub.name),
          imageUrl: `https://picsum.photos/seed/sub-${catSlug}-${subSlug}/960/540`,
          imageAlt: sub.name,
          isActive: true,
          categoryId: category.id,
        },
      });

      // 6 productos por subcategoría
      for (let i = 1; i <= 6; i++) {
        const prodName = `${sub.name} ${i}`;
        const prodSlug = slugify(`${sub.name}-${i}`);
        const product = await prisma.product.create({
          data: {
            name: prodName,
            nameEn: prodName,
            slug: prodSlug,
            slugEn: prodSlug,
            description: faker.commerce.productDescription(),
            descriptionEn: faker.commerce.productDescription(),
            attributes: buildAttributes(sub.name),
            isActive: true,
            subcategoryId: subcategory.id,
          },
        });

        // 1 imagen por producto (puedes aumentar a 3 si quieres)
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: `https://picsum.photos/seed/prod-${prodSlug}/800/600`,
            alt: prodName,
            sortOrder: 0,
          },
        });
      }
    }
  }
}

async function seedUsersAndSampleCart() {
  // Admin
  const adminPass = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@indoffpro.com' },
    update: {},
    create: {
      email: 'admin@indoffpro.com',
      passwordHash: adminPass,
      role: Role.ADMIN,
      isVerified: true,
      firstName: 'Admin',
      lastName: 'Indoff',
    },
  });

  // Usuario normal
  const userPass = await bcrypt.hash('User123!', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      passwordHash: userPass,
      role: Role.USER,
      isVerified: true,
      firstName: 'Test',
      lastName: 'User',
    },
  });

  // Crea un carrito OPEN con 2 items para el usuario normal
  const anyTwoProducts = await prisma.product.findMany({ take: 2 });
  if (anyTwoProducts.length === 2) {
    const cart = await prisma.cart.create({
      data: { userId: user.id, status: CartStatus.OPEN },
    });
    for (const p of anyTwoProducts) {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: p.id,
          quantity: 2,
        },
      });
    }
  }

  return { adminEmail: admin.email, adminPass: 'Admin123!' };
}

async function main() {
  console.time('seed');
  await seedCatalog();
  const creds = await seedUsersAndSampleCart();
  console.timeEnd('seed');
  console.log('Admin listo ->', creds);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })

  .finally(async () => {
    await prisma.$disconnect();
  });

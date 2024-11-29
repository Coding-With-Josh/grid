const { PrismaClient } = require('@prisma/client');

// Utility function to create a slug
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

const prisma = new PrismaClient();

async function populateSlugs() {
  console.log('Starting to populate project slugs...');

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { slug: '' },
        { slug: null }
      ]
    }
  });

  console.log(`Found ${projects.length} projects without slugs`);

  for (const project of projects) {
    let baseSlug = slugify(project.title);
    let slug = baseSlug;
    let counter = 1;

    // Keep checking until we find a unique slug
    while (true) {
      const existing = await prisma.project.findUnique({
        where: { slug },
      });
      
      if (!existing) break;
      
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    await prisma.project.update({
      where: { id: project.id },
      data: { slug },
    });

    console.log(`Updated project ${project.id} with slug: ${slug}`);
  }

  console.log('Finished populating slugs');
}

populateSlugs()
  .catch((e) => {
    console.error('Error populating slugs:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

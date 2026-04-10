import prisma from "../../utils/prisma";

const getmosqueDB = async (id: string) => {
  const mosque = await prisma.mosque.findUnique({
    where: { id },
  });
  if (!mosque) throw new Error("Mosque not found");
  return mosque;
};

const updateMosqueDB = async (
  id: string,
  data: { name?: string; address?: string },
) => {
  const existing = await prisma.mosque.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Mosque not found");
  }

  const mosque = await prisma.mosque.update({
    where: { id },
    data: {
      name: data.name,
      address: data.address,
    },
  });

  return mosque;
};

export const mosqueServices = {
  getmosqueDB,
  updateMosqueDB,
};

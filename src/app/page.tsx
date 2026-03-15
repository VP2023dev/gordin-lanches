import { CardapioClient } from "@/components/CardapioClient";
import { getCardapio } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getCardapio();

  return (
    <CardapioClient
      categorias={data.categorias}
      produtos={data.produtos}
      promocoes={data.promocoes}
      acrescimos={data.acrescimos ?? []}
      config={data.config}
    />
  );
}

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';

interface CategoryType {
  slug: {
    current: string;
  };
}

export async function generateStaticParams() {
  // Fetch categories properly
  const categories: CategoryType[] = await client.fetch('*[_type == "category"]{slug}');
  return categories.map((cat) => ({ slug: cat.slug.current }));
}

interface ProductType {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  slug: string;
}

async function getProductsByCategory(slug: string): Promise<ProductType[]> {
  const query = `*[_type == "product" && category->slug.current == $slug]{
    _id,
    name,
    price,
    "imageUrl": image.asset->url,
    slug
  }`;
  const products: ProductType[] = await client.fetch(query, { slug });
  return products;
}

// Fix the type of props for the CategoryPage function
interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Fetch products by category
  const products = await getProductsByCategory(params.slug);

  if (!products.length) return notFound();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#2A254B] capitalize">{params.slug}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded-md shadow-md">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-600">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

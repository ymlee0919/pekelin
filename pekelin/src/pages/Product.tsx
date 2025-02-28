import { useParams } from "react-router-dom";
import db from "../database/db";
import { CategoryInfo, ProductCardInfo, VariantCardInfo } from "../database/database.types";
import VariantCircle from "../components/VariantCircle";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";

const Product = () => {
    const params = useParams();
    const categoryUrl = params.category || '';
    const productUrl = params.product || '';
    const product = db.getProduct(categoryUrl, productUrl);

    return <>
        <div className="hero bg-base-200 pt-20 pb-5">
            <div className="hero-content flex-col lg:flex-row gap-5">
                <div className="relative">
                    <img
                        src={product.remoteUrl}
                        className="w-full lg:max-w-80 rounded-lg shadow-xl" />
                        <p className="price-label">$ {product.price}</p>
                </div>
                <div className="px-8 lg:px-20">
                    <h1 className="text-3xl font-bold text-gray-600">
                        {product.name}
                    </h1>
                    <p className="text-sm text-gray-400 pl-3">
                        {product.category}
                    </p>
                    <p className="py-5 text-gray-500">
                        {product.description}
                    </p>
                </div>
                
            </div>
        </div>
        <div className="py-8 px-7">
            <p className="text-xl my-5 text-sky-900 px-7">Variantes</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 justify-center">
                {
                    db.getProductVariants(product.productId).map((variant: VariantCardInfo) => {
                        return <VariantCircle key={variant.variantId} variant={variant} />
                    })
                }
            </div>
        </div>

        <div className="py-8 px-12">
            <p className="text-xl my-5 text-sky-900 px-7">Otros productos</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-5 justify-center">
                {
                    db.getProductsOf(categoryUrl)
                        .filter((prod : ProductCardInfo) => {
                            return prod.productId != product.productId
                        }).map((product: ProductCardInfo) => {
                            return <ProductCard key={product.productId} product={product} />
                        })
                }
            </div>
        </div>

        <div className="py-8 px-3 lg:px-12">
            <p className="text-xl my-5 text-sky-900 px-7">Más...</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 justify-center">
                {db.Categories
                    .filter((cat: CategoryInfo) => { return cat.url != categoryUrl})
                    .map((cat: CategoryInfo) => {
                        return <CategoryCard key={cat.categoryId} category={cat} />
                    })}
            </div>
        </div>
    </>
}

export default Product;
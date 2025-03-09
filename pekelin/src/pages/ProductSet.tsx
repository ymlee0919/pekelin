import { useParams } from "react-router-dom";
import db from "../database/db";
import { CategoryInfo, ProductCardInfo } from "../database/database.types";
import ProductCard from "../components/cards/ProductCard";
import CategoryCard from "../components/cards/CategoryCard";
// import RequestBtn from "../components/RequestBtn";
import SetBuilder from "../components/SetBuilder";

const ProductSet = () => {
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
                    {/*
                    <div className="pt-4 text-center">
                        <RequestBtn product={product.name} gender={product.gender} />
                    </div>
                    */}
                </div>
                
            </div>
        </div>
        
        <SetBuilder product={product} />
        
        <div className="py-8 px-12">
            <p className="text-xl my-5 text-sky-900 px-7">Otros productos</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-5 justify-center">
                {
                    db.getProductsOf(categoryUrl)
                        .filter((prod : ProductCardInfo) => {
                            return prod.productId != product.productId
                        }).map((product: ProductCardInfo) => {
                            return <ProductCard key={product.productId} product={product} showBestSeller={true} />
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

export default ProductSet;
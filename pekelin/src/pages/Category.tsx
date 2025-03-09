import { useParams } from "react-router-dom";
import db from "../database/db";
import ProductCard from "../components/cards/ProductCard";
import { CategoryInfo, ProductCardInfo } from "../database/database.types";
import CategoryCard from "../components/cards/CategoryCard";

const Category = () => {

    const params = useParams();
    const categoryUrl = params.category || '';
    const category = db.getCategory(categoryUrl);

    return <>
        <div
            className="hero min-h-screen"
            style={{
                backgroundImage: `url(${category.remoteUrl})`,
            }}>
            <div className="hero-overlay bg-opacity-50"></div>
            <div className="hero-content text-neutral-content text-center">
                <div className="max-w-md">
                    <h1 className="mb-5 text-5xl font-bold">{category.category}</h1>
                    <p className="mb-5 text-xl">
                        {category.description}
                    </p>
                </div>
            </div>
        </div>

        <div className="p-5 mt-7 mb-12">
            <p className="text-center text-xl mb-5 text-sky-900">Ofertas</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 justify-center px-5">
            {
                db.getProductsOf(categoryUrl).map((product: ProductCardInfo) => 
                    <ProductCard key={product.productId} product={product} showBestSeller={true} />
                )
            }
            </div>
            <br></br>
            <p className="text-center text-xl mt-10 pt-3 mb-5 text-sky-900">Otras</p>
            <div className="content-center justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 ">
                {db.Categories
                    .filter((cat: CategoryInfo) => { return cat.url != categoryUrl})
                    .map((cat: CategoryInfo) => {
                        return <CategoryCard key={cat.categoryId} category={cat} />
                    })}
                </div>
            </div>
            

        </div>
    </>
}

export default Category;
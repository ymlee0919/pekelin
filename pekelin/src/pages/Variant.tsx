import { useParams } from "react-router-dom";
import db from "../database/db";
import { ProductCardInfo, VariantCardInfo, Feature} from "../database/database.types";
import VariantCircle from "../components/VariantCircle";
import ProductCard from "../components/ProductCard";

const Variant = () => {

    const params = useParams();
    const categoryUrl = params.category || '';
    const productUrl = params.product || '';
    const variantId = parseInt(params.variantId || '0');

    const variant = db.getVariant(categoryUrl, productUrl, variantId);

    return <>
        <div className="pt-20 pb-5 lg:px-32">
            <div className="flex flex-wrap gap-3 pt-2">
                
                <div className="md:w-5/12 sm:w-5/12 lg:px-1 px-8">
                    <img
                        src={variant.remoteUrl}
                        className="w-full lg:max-w-96 rounded-lg shadow-xl p-3" 
                    />
                </div>
                <div className="md:w-6/12 sm:w-5/12 lg:px-1 px-8">
                    <h1 className="text-3xl font-bold text-gray-600">
                        {variant.name}
                    </h1>
                    <p className="text-sm text-gray-400 pl-3">
                        {variant.category}
                    </p>
                    <p className="py-5 text-gray-500">
                        {variant.description}
                    </p>
                    <div className="pl-3">
                        {
                            variant.Features.map((feature: Feature, index: number) => {
                                return <p key={index} className="text-sm text-gray-600 py-1"><strong>{feature.title}</strong>: {feature.content}</p>
                            })
                        }
                    </div>
                    <div className="pt-5">
                        <span className="price">Precio: ${variant.price}</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="py-8 px-7">
            <p className="text-xl my-5 text-sky-900 px-7">Variantes</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 justify-center">
                {
                    db.getProductVariants(variant.productId)
                    .filter((variant: VariantCardInfo) => {
                        return variant.variantId != variantId
                    })
                    .map((variant: VariantCardInfo) => {
                        return <VariantCircle variant={variant} />
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
                            return prod.productId != variant.productId
                        }).map((product: ProductCardInfo) => {
                            return <ProductCard product={product} />
                        })
                }
            </div>
        </div>
    </>
}

export default Variant;
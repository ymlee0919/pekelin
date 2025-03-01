import { useParams } from "react-router-dom";
import db from "../database/db";
import ProductSet from "./ProductSet";
import SingleProduct from "./SingleProduct";

const Product = () => {
    const params = useParams();
    const categoryUrl = params.category || '';
    const productUrl = params.product || '';
    const product = db.getProduct(categoryUrl, productUrl);

    return product.isSet ? <ProductSet /> : <SingleProduct />;
}

export default Product;
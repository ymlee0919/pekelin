import { CategoryIndex, CategoryInfo, DataBase, ProductIndex, ProductInfo, VariantIndex } from "./database.types";

export class LocalDatabase {

    private database: DataBase;

    private categories: CategoryIndex;
    private products: ProductIndex;
    private variants: VariantIndex;

    constructor() {
        this.database = [];
        this.categories = {};
        this.products = {};
        this.variants = {};
    }

    private clean() {
        this.categories = {};
        this.products = {};
        this.variants = {};
    }

    setData(data: DataBase) {
        this.clean();
        this.database = data;
        this.doIndex();
    }

    doIndex() {
        // Build categories index
        for(let c = 0; c < this.database.length; c++) {
            //  categories [categoryUrl] = <Category>
            let category = this.database[c];
            this.categories[category.url] = category;
            
            // Init first level of products index
            this.products[category.url] = {};
            // Init first level of variants index
            this.variants[category.url] = {};

            // Build index for products
            for(let p = 0; p < category.Products.length; p++) {
                //   products[categoryUrl] [productUrl] = <Product>
                let product = category.Products[p];
                this.products[category.url][product.url] = product;

                // Init second level of variants index
                this.variants[category.url][product.url] = {};

                // Build index for variants
                for(let v = 0; v < product.Variants.length; v++) {
                    // variant[ categoryUrl ][ productUrl ] [ variantId] = <Variant>
                    let variant = product.Variants[v];
                    this.variants[category.url][product.url][variant.variantId] = variant;
                }
            }
        }
            
    }

    get Categories() : CategoryInfo[] {

        return this.database.map(category => ({
            categoryId: category.categoryId,
            category: category.category,
            url: category.url,
            description: category.description,
            remoteUrl: category.remoteUrl
        }))

    }

    getProductsOf(categoryUrl: string): ProductInfo[] {

        if(!this.categories.hasOwnProperty(categoryUrl))
            return [];

        return this.categories[categoryUrl].Products.map((product) => {
            let {Features, Variants, expiry, ...obj} = product;
            return obj;
        });
    }
}

const db = new LocalDatabase();

export default db;
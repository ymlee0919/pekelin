import { CategoryIndex, 
    CategoryInfo,
    CategoryList,
    DataBase,
    ProductCardInfo,
    ProductIndex,
    ProductInfo,
    ProductList,
    Variant,
    VariantCardInfo,
    VariantFullInfo,
    VariantIndex,
    VariantList
} from "./database.types";

export class LocalDatabase {

    private database: DataBase;

    private categories: CategoryIndex;
    private products: ProductIndex;
    private variants: VariantIndex;

    private productsList: ProductList;
    private variantsList: VariantList;
    private categoryList: CategoryList;

    constructor() {
        this.database = [];
        this.categories = {};
        this.products = {};
        this.variants = {};
        
        this.categoryList = {};
        this.productsList = {};
        this.variantsList = {};
    }

    private clean() {
        this.categories = {};
        this.products = {};
        this.variants = {};
        this.productsList = {};
        this.variantsList = {};
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
            this.categoryList[category.categoryId] = category;
            
            // Init first level of products index
            this.products[category.url] = {};
            // Init first level of variants index
            this.variants[category.url] = {};

            // Build index for products
            for(let p = 0; p < category.Products.length; p++) {
                //   products[categoryUrl] [productUrl] = <Product>
                let product = category.Products[p];
                this.products[category.url][product.url] = product;
                this.productsList[product.productId] = product;

                // Init second level of variants index
                this.variants[category.url][product.url] = {};

                // Build index for variants
                for(let v = 0; v < product.Variants.length; v++) {
                    // variant[ categoryUrl ][ productUrl ] [ variantId] = <Variant>
                    let variant = product.Variants[v];
                    this.variants[category.url][product.url][variant.variantId] = variant;
                    this.variantsList[variant.variantId] = variant;
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

    getCategory(categoryUrl: string) : CategoryInfo {
        let category = this.categories[categoryUrl];
        let {expiry, Products, ...info} = category;

        return info;
    }

    getProduct(categoryUrl: string, productUrl: string) : ProductInfo {
        let category = this.categories[categoryUrl];
        let product = this.products[categoryUrl][productUrl];

        let {expiry, element1Id, element2Id, Features, ...info} = product;

        return {
            category: category.category,
            categoryUrl: category.url,
            product1: element1Id,
            product2: element2Id,
            ...info
        };
    }

    getProductsOf(categoryUrl: string): ProductCardInfo[] {

        if(!this.categories.hasOwnProperty(categoryUrl))
            return [];

        let category = this.categories[categoryUrl];

        return category.Products.map((product) => {
            let {Features, Variants, expiry, ...obj} = product;
            let result = {
                category: category.category,
                categoryUrl: category.url,
                ...obj
            }
            return result;
        });
    }

    getProductVariants(productId: number) : VariantCardInfo[] {
        let product = this.productsList[productId];
        let category = this.categoryList[product.categoryId];

        return this.productsList[productId].Variants.map((variant: Variant) => {
            let { Features, expiry, ...item } = variant;

            return {
                categoryUrl: category.url,
                productUrl: product.url,
                productName: product.name,
                price: product.price,
                ...item
            }
        });
    }

    getVariant(categoryUrl: string, productUrl: string, variantId: number) : VariantFullInfo {
        let category = this.categories[categoryUrl];
        let product = this.products[categoryUrl][productUrl];
        let variant = this.variantsList[variantId];

        
        let {Features, expiry, description, ...item} = variant;

        return {
            category: category.category,
            categoryUrl: category.url,
            price: product.price,
            productName: product.name,
            productUrl: product.url,
            gender: product.gender,
            Features: product.Features.concat(Features),
            description: description || product.description,
            ...item
        }
    }

    /** Best seller methods */
    get existsBestSeller() : boolean {

        for (const key in this.productsList) {
            if (this.productsList.hasOwnProperty(key)) {
                if(!!this.productsList[key].isBestSeller)
                    return true;
            }
        }

        for (const key in this.variantsList) {
            if (this.variantsList.hasOwnProperty(key)) {
                if(!!this.variantsList[key].isBestSeller)
                    return true;
            }
        }

        return false;
    }

    get bestSellerProductsId() : number[] {
        return Object.values(this.productsList).filter((product) => {
            return !!product.isBestSeller;
        }).map(product => product.productId);
    }

    get bestSellerVariantsId() : number[] {
        return Object.values(this.variantsList).filter((variant) => {
            return !!variant.isBestSeller;
        }).map(variant => variant.variantId);
    }

    getProductCardInfoById(productId: number) : ProductCardInfo {
        
        let product = this.productsList[productId];

        let {categoryId, expiry, Variants, Features, ...view} = product;

        return {...view, 
            categoryUrl:  this.categoryList[product.categoryId].url,
            category : this.categoryList[product.categoryId].category
        };
    }

    getVariantCardInfoById(variantId: number) : VariantCardInfo {
        let variant = this.variantsList[variantId];

        let {productId, expiry, Features, ...view} = variant;
        let categoryId = this.productsList[productId].categoryId;

        return {...view, 
            categoryUrl:  this.categoryList[categoryId].url,
            productUrl : this.productsList[productId].url,
            productName : this.productsList[productId].name,
            price: this.productsList[productId].price,
        };
    }
}

const db = new LocalDatabase();

export default db;
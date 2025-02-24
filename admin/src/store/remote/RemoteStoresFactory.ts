import AccountsStore from "./accounts/Accounts.Store";
import DashboarStore from "./dashboard/Dashboard.Store";
import CategoryStore from "./categories/Categories.Store";

import {ProductsStore, SingleProductStore} from "./products/Products.Store";
import {VariantsStore, SingleVariantStore} from "./variants/Variants.Store";


/**
 * Class to provide all stores
 */
export default class RemoteStoresFactory {

    // Private fields
    private _accountsStore: AccountsStore | null = null;

    private _productsStore: ProductsStore | null = null;

    private _singleProductsStore: SingleProductStore | null = null;

    private _dashboardStore: DashboarStore | null = null;

    private _servicesStore: CategoryStore | null = null;

    private _variantsStore: VariantsStore | null = null;

    private _singleVariantStore: SingleVariantStore | null = null;
    
    // Public properties
    public get accountsStore() : AccountsStore {
        if(this._accountsStore == null)
            this._accountsStore = new AccountsStore();

        return this._accountsStore;
    }

    public get productsStore() : ProductsStore {
        if(this._productsStore == null)
            this._productsStore = new ProductsStore();

        return this._productsStore;
    }

    public get singleProductsStore() : SingleProductStore {
        if(this._singleProductsStore == null)
            this._singleProductsStore = new SingleProductStore();

        return this._singleProductsStore;
    }

    public get dashboardStore() : DashboarStore {
        if(this._dashboardStore == null)
            this._dashboardStore = new DashboarStore();

        return this._dashboardStore;
    }

    public get categoryStore(): CategoryStore {
         if(this._servicesStore == null)
            this._servicesStore = new CategoryStore();
        return this._servicesStore;
    }

    public get variantsStore() : VariantsStore {
        if(this._variantsStore == null)
            this._variantsStore = new VariantsStore();

        return this._variantsStore;
    }

    public get singleVariantStore() : SingleVariantStore {
        if(this._singleVariantStore == null)
            this._singleVariantStore = new SingleVariantStore();

        return this._singleVariantStore;
    }
}
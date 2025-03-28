import AccountsStore from "./accounts/Accounts.Store";
import DashboarStore from "./dashboard/Dashboard.Store";
import CategoryStore from "./categories/Categories.Store";

import {ProductsStore, SingleProductStore} from "./products/Products.Store";
import {VariantsStore, SingleVariantStore} from "./variants/Variants.Store";
import SetsStore from "./sets/Sets.Store";
import SetSourceStore from "./sets/SetSource.Store";

import ReviewLinksStore from "./reviews/Reviews.Store";
import { PermissionsStore, RolesStore } from "./roles/Roles.Store";
import ClientsStore from "./clients/Clients.Store";

/**
 * Class to provide all stores
 */
export default class RemoteStoresFactory {

    // Private fields
    private _accountsStore: AccountsStore | null = null;

    private _productsStore: ProductsStore | null = null;

    private _setsStore: SetsStore | null = null;

    private _setSourceStore: SetSourceStore | null = null;

    private _singleProductsStore: SingleProductStore | null = null;

    private _dashboardStore: DashboarStore | null = null;

    private _servicesStore: CategoryStore | null = null;

    private _variantsStore: VariantsStore | null = null;

    private _singleVariantStore: SingleVariantStore | null = null;

    private _reviewLinksStore: ReviewLinksStore | null = null;

    private _rolesStore: RolesStore | null = null;
    
    private _permissionsStore: PermissionsStore | null = null;

    private _clientsStore: ClientsStore | null = null;
    
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

    public get setsStore() : SetsStore {
        if(this._setsStore == null)
            this._setsStore = new SetsStore();

        return this._setsStore;
    }

    public get setSourceStore() : SetSourceStore {
        if(this._setSourceStore == null)
            this._setSourceStore = new SetSourceStore();

        return this._setSourceStore;
    }

    public get reviewLinksStore() : ReviewLinksStore {
        if(this._reviewLinksStore == null)
            this._reviewLinksStore = new ReviewLinksStore();

        return this._reviewLinksStore;
    }

    public get rolesStore() : RolesStore {
        if(this._rolesStore == null)
            this._rolesStore = new RolesStore();

        return this._rolesStore;
    }

    public get permissionsStore() : PermissionsStore {
        if(this._permissionsStore == null)
            this._permissionsStore = new PermissionsStore();

        return this._permissionsStore;
    }

    public get clientsStore() : ClientsStore {
        if(this._clientsStore == null)
            this._clientsStore = new ClientsStore();

        return this._clientsStore;
    }
}
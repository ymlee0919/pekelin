import AccountsStore from "./accounts/Accounts.Store";
import DashboarStore from "./dashboard/Dashboard.Store";
import {OffersStore, SingleOfferStore} from "./offers/Offers.Store";
import CategoryStore from "./categories/Categories.Store";

/**
 * Class to provide all stores
 */
export default class RemoteStoresFactory {

    // Private fields
    private _accountsStore: AccountsStore | null = null;

    private _offersStore: OffersStore | null = null;

    private _singleOffersStore: SingleOfferStore | null = null;

    private _dashboardStore: DashboarStore | null = null;

    private _servicesStore: CategoryStore | null = null;
    
    // Public properties
    public get accountsStore() : AccountsStore {
        if(this._accountsStore == null)
            this._accountsStore = new AccountsStore();

        return this._accountsStore;
    }

    public get offersStore() : OffersStore {
        if(this._offersStore == null)
            this._offersStore = new OffersStore();

        return this._offersStore;
    }

    public get singleOffersStore() : SingleOfferStore {
        if(this._singleOffersStore == null)
            this._singleOffersStore = new SingleOfferStore();

        return this._singleOffersStore;
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
}
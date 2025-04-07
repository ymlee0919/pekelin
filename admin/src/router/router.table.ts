const RouterTable = {
    accounts : {
        root: '/accounts',

        new: '/accounts/new',

        edit: (accountId:string|number) => `/accounts/${accountId}/edit`,

        credentials: (accountId:string|number) => `/accounts/${accountId}/credentials`
    },

    roles : {
        root: '/roles',

        new: '/roles/new',

        edit: (roleId:string|number) => `/roles/${roleId}/edit`,
    },

    categories : {
        root: 'categories',

        new: '/categories/new',

        edit: (categoryId:string|number) => `/categories/${categoryId}/edit`,
    },

    products : {
        root: 'products',

        new: '/products/new',

        newSet: '/products/new-set',

        info: (productId:string|number) => `/products/${productId}`,

        edit: (productId:string|number) => `/products/${productId}/edit`,

        editSet: (productId:string|number) => `/products/${productId}/edit-set`,
    },

    variants : {
        root: (productId:string|number) => `/products/${productId}/variants`,

        new: (productId:string|number) => `/products/${productId}/variants/new`,

        edit: (productId:string|number, variantId:string|number) => `/variants/${productId}/variants/${variantId}/edit`,
    },

    links: {
        root: '/links',

        edit: (linkId:string|number) => `/links/${linkId}/edit`,
    },

    clients : {
        root: '/clients',

        new: '/clients/new',

        edit: (clientId:string|number) => `/clients/${clientId}/edit`,
    },

    orders : {
        root: '/orders',

        new: '/orders/new',

        newForClient: (clientId:string|number) => `/orders/new?client=${clientId}`,

        edit: (orderId:string|number) => `/orders/${orderId}/edit`,
    },

    production : {
        root: '/production',
        
        edit: (orderId:string|number) => `/orders/${orderId}/edit`,
    },
}

export default RouterTable;
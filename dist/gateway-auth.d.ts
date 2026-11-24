declare function gateway_auth(this: any, options: any): {
    exports: {};
};
declare namespace gateway_auth {
    var defaults: ({ valid }: {
        valid: any;
    }) => {
        spec: {
            azure_cookie: any;
            express_cookie: any;
            lambda_cookie: any;
            lambda_cognito: any;
        };
        debug: boolean;
    };
}
export default gateway_auth;

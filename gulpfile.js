'use strict';

const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);
var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
    var result = getTasks.call(build.rig);

    result.set('serve', result.get('serve-deprecated'));

    return result;
};

build.initialize(require('gulp'));

build.configureWebpack.mergeConfig({
    additionalConfiguration: (generatedConfig) => {
        // find the Define plugins  
        let plugin, pluginDefine;
        
        for (var i = 0; i < generatedConfig.plugins.length; i++) {
            plugin = generatedConfig.plugins[i];
            if (plugin.definitions) {
                pluginDefine = plugin;
            }
        }
              
        // determine if in debug build
        const isDebugMode = pluginDefine.definitions.DEBUG;
        // set env replacements values
        if (isDebugMode) {
            console.log("Applying DEV configuration");
            
            // STAGE
            pluginDefine.definitions.CLIENT_ID = JSON.stringify('710d1c63-4647-4065-a805-a019d734c9de');
            pluginDefine.definitions.TENANT_ID = JSON.stringify('f3211d0e-125b-42c3-86db-322b19a65a22');
            pluginDefine.definitions.SCOPES = JSON.stringify('710d1c63-4647-4065-a805-a019d734c9de/user_impersonation');
            pluginDefine.definitions.REDIRECT_URI = JSON.stringify('SiteAssets/viva-auth-end.aspx');
            pluginDefine.definitions.AUTH_URL = JSON.stringify('SiteAssets/viva-auth-start.aspx');
            pluginDefine.definitions.PORTAL_API = JSON.stringify('https://api.portalhome.ciostage.accenture.com');
            pluginDefine.definitions.SITE_URL = JSON.stringify('https://accentureaadsyncstage.sharepoint.com/sites/VivaConnection');
            pluginDefine.definitions.MY_HOLDINGS_API = JSON.stringify('https://myholdings-api.ciostage.accenture.com/stage/portal');
            
            // PROD
            /*
            pluginDefine.definitions.CLIENT_ID = JSON.stringify('b9ee44c8-b48f-4430-845e-79c079135a0d');
            pluginDefine.definitions.TENANT_ID = JSON.stringify('e0793d39-0939-496d-b129-198edd916feb');
            pluginDefine.definitions.SCOPES = JSON.stringify('b9ee44c8-b48f-4430-845e-79c079135a0d/user_impersonation');
            pluginDefine.definitions.REDIRECT_URI = JSON.stringify('SiteAssets/viva-auth-end.aspx');
            pluginDefine.definitions.AUTH_URL = JSON.stringify('SiteAssets/viva-auth-start.aspx');
            pluginDefine.definitions.PORTAL_API = JSON.stringify('https://api.portalhome.accenture.com');
            pluginDefine.definitions.SITE_URL = JSON.stringify('https://ts.accenture.com/sites/AccentureConnections');
            pluginDefine.definitions.MY_HOLDINGS_API = JSON.stringify('https://myholdings-api.accenture.com/prod/portal');
            */
           
        } else {
            /*
            pluginDefine.definitions.CLIENT_ID = JSON.stringify('b9ee44c8-b48f-4430-845e-79c079135a0d');
            pluginDefine.definitions.TENANT_ID = JSON.stringify('e0793d39-0939-496d-b129-198edd916feb');
            pluginDefine.definitions.SCOPES = JSON.stringify('b9ee44c8-b48f-4430-845e-79c079135a0d/user_impersonation');
            pluginDefine.definitions.REDIRECT_URI = JSON.stringify('SiteAssets/viva-auth-end.aspx');
            pluginDefine.definitions.AUTH_URL = JSON.stringify('SiteAssets/viva-auth-start.aspx');
            pluginDefine.definitions.PORTAL_API = JSON.stringify('https://api.portalhome.accenture.com');
            pluginDefine.definitions.SITE_URL = JSON.stringify('https://ts.accenture.com/sites/AccentureConnections');
            pluginDefine.definitions.MY_HOLDINGS_API = JSON.stringify('https://myholdings-api.accenture.com/prod/portal');
            */
            pluginDefine.definitions.CLIENT_ID = JSON.stringify(process.env.CLIENT_ID);
            pluginDefine.definitions.TENANT_ID = JSON.stringify(process.env.TENANT_ID);
            pluginDefine.definitions.SCOPES = JSON.stringify(process.env.SCOPES);
            pluginDefine.definitions.REDIRECT_URI = JSON.stringify(process.env.REDIRECT_URI);
            pluginDefine.definitions.AUTH_URL = JSON.stringify(process.env.AUTH_URL);
            pluginDefine.definitions.PORTAL_API = JSON.stringify(process.env.PORTAL_API);
            pluginDefine.definitions.SITE_URL = JSON.stringify(process.env.SITE_URL);
            pluginDefine.definitions.MY_HOLDINGS_API = JSON.stringify(process.env.MY_HOLDINGS_API);              
            
        }
        
        return generatedConfig;
    }
});



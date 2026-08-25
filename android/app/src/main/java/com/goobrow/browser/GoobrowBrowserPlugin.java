package com.goobrow.browser;

import android.net.Uri;

import androidx.browser.customtabs.CustomTabsIntent;

import com.getcapacitor.Plugin;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginMethod;

@CapacitorPlugin(name = "GoobrowBrowser")
public class GoobrowBrowserPlugin extends Plugin {

    @PluginMethod
    public void openBrowser(PluginCall call) {

        String url = call.getString(
                "url",
                "https://www.google.com/"
        );

        if (url == null || url.trim().isEmpty()) {
            url = "https://www.google.com/";
        }

        try {

            CustomTabsIntent.Builder builder =
                    new CustomTabsIntent.Builder();

            builder.setShowTitle(true);

            CustomTabsIntent customTabsIntent =
                    builder.build();

            customTabsIntent.launchUrl(
                    getActivity(),
                    Uri.parse(url)
            );

            JSObject result = new JSObject();
            result.put("opened", true);
            result.put("mode", "custom-tab");

            call.resolve(result);

        } catch (Exception e) {

            call.reject(
                    "Unable to open browser: " + e.getMessage()
            );
        }
    }
}

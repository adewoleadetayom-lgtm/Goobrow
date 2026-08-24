package com.goobrow.browser;

import android.content.Intent;
import com.getcapacitor.Plugin;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginMethod;

@CapacitorPlugin(name = "GoobrowBrowser")
public class GoobrowBrowserPlugin extends Plugin {

    @PluginMethod
    public void openBrowser(PluginCall call) {
        String url = call.getString("url", "https://www.google.com/");

        if (url == null || url.trim().isEmpty()) {
            url = "https://www.google.com/";
        }

        Intent intent = new Intent(getActivity(), GoobrowBrowserActivity.class);
        intent.putExtra("url", url);

        getActivity().startActivity(intent);

        JSObject result = new JSObject();
        result.put("opened", true);
        call.resolve(result);
    }
}

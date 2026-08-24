package com.goobrow.browser;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(GoobrowBrowserPlugin.class);
        super.onCreate(savedInstanceState);
    }
}

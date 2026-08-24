package com.goobrow.browser;

import android.app.Activity;
import android.os.Bundle;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.content.Intent;
import android.net.Uri;

public class GoobrowBrowserActivity extends Activity {

    private WebView webView;
    private EditText addressBar;

    private int dp(float value) {
        return (int)(value * getResources().getDisplayMetrics().density + 0.5f);
    }

    private GradientDrawable rounded(int color, int radius) {
        GradientDrawable g = new GradientDrawable();
        g.setColor(color);
        g.setCornerRadius(dp(radius));
        return g;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().setStatusBarColor(Color.WHITE);
        getWindow().setNavigationBarColor(Color.WHITE);

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(Color.WHITE);

        /* ===== MODERN GOOGLE-STYLE TOOLBAR ===== */

        LinearLayout toolbar = new LinearLayout(this);
        toolbar.setOrientation(LinearLayout.HORIZONTAL);
        toolbar.setGravity(Gravity.CENTER_VERTICAL);
        toolbar.setPadding(dp(6), dp(6), dp(6), dp(6));
        toolbar.setBackgroundColor(Color.WHITE);

        Button back = tool("‹");
        Button forward = tool("›");

        addressBar = new EditText(this);
        addressBar.setSingleLine(true);
        addressBar.setTextSize(15);
        addressBar.setHint("Search Google or enter address");
        addressBar.setTextColor(Color.rgb(32,33,36));
        addressBar.setHintTextColor(Color.rgb(95,99,104));
        addressBar.setPadding(dp(16), 0, dp(16), 0);
        addressBar.setBackground(rounded(Color.rgb(241,243,244), 24));

        LinearLayout.LayoutParams addressParams =
                new LinearLayout.LayoutParams(0, dp(44), 1);

        Button reload = tool("↻");
        Button menu = tool("⋮");

        toolbar.addView(back);
        toolbar.addView(forward);
        toolbar.addView(addressBar, addressParams);
        toolbar.addView(reload);
        toolbar.addView(menu);

        root.addView(toolbar);

        /* ===== WEBVIEW ===== */

        webView = new WebView(this);

        root.addView(
                webView,
                new LinearLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        0,
                        1
                )
        );

        setContentView(root);

        WebSettings settings = webView.getSettings();

        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setSupportMultipleWindows(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setSupportZoom(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadsImagesAutomatically(true);

        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance()
                .setAcceptThirdPartyCookies(webView, true);

        webView.setWebChromeClient(new WebChromeClient());

        webView.setWebViewClient(new WebViewClient() {

            @Override
            public boolean shouldOverrideUrlLoading(
                    WebView view,
                    WebResourceRequest request) {
                return false;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);

                addressBar.setText(url);
                addressBar.setSelection(addressBar.length());
            }
        });

        webView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(
                    String url,
                    String userAgent,
                    String contentDisposition,
                    String mimetype,
                    long contentLength) {

                try {
                    Intent intent = new Intent(
                            Intent.ACTION_VIEW,
                            Uri.parse(url)
                    );
                    startActivity(intent);
                } catch (Exception ignored) {
                }
            }
        });

        /* ===== ADDRESS BAR ===== */

        addressBar.setOnEditorActionListener((v, actionId, event) -> {
            navigate();
            return true;
        });

        addressBar.setOnKeyListener((v, keyCode, event) -> {

            if (keyCode == KeyEvent.KEYCODE_ENTER &&
                    event.getAction() == KeyEvent.ACTION_DOWN) {

                navigate();
                return true;
            }

            return false;
        });

        /* ===== NAVIGATION ===== */

        back.setOnClickListener(v -> {

            if (webView.canGoBack()) {
                webView.goBack();
            }
        });

        forward.setOnClickListener(v -> {

            if (webView.canGoForward()) {
                webView.goForward();
            }
        });

        reload.setOnClickListener(v -> webView.reload());

        menu.setOnClickListener(v -> {

            String[] items = {
                    "Google Home",
                    "Google News",
                    "Google Images",
                    "Google Videos",
                    "Google Maps",
                    "Bookmarks"
            };

            new android.app.AlertDialog.Builder(this)
                    .setTitle("Goobrow")
                    .setItems(items, (dialog, which) -> {

                        switch (which) {

                            case 0:
                                webView.loadUrl(
                                        "https://www.google.com/"
                                );
                                break;

                            case 1:
                                webView.loadUrl(
                                        "https://news.google.com/"
                                );
                                break;

                            case 2:
                                webView.loadUrl(
                                        "https://images.google.com/"
                                );
                                break;

                            case 3:
                                webView.loadUrl(
                                        "https://www.google.com/search?tbm=vid"
                                );
                                break;

                            case 4:
                                webView.loadUrl(
                                        "https://maps.google.com/"
                                );
                                break;

                            case 5:
                                showBookmarks();
                                break;
                        }
                    })
                    .show();
        });

        /* ===== INITIAL PAGE ===== */

        String startUrl =
                getIntent().getStringExtra("url");

        if (startUrl == null ||
                startUrl.trim().isEmpty()) {

            startUrl = "https://www.google.com/";
        }

        webView.loadUrl(startUrl);
    }

    private Button tool(String text) {

        Button b = new Button(this);

        b.setText(text);
        b.setTextSize(21);
        b.setTextColor(Color.rgb(60,64,67));
        b.setBackgroundColor(Color.TRANSPARENT);

        b.setMinWidth(0);
        b.setMinimumWidth(0);

        b.setPadding(0, 0, 0, 0);

        b.setLayoutParams(
                new LinearLayout.LayoutParams(
                        dp(42),
                        dp(44)
                )
        );

        return b;
    }

    private void navigate() {

        String value =
                addressBar.getText()
                        .toString()
                        .trim();

        if (value.isEmpty()) {
            return;
        }

        String target;

        if (value.matches("(?i)^https?://.*")) {

            target = value;

        } else if (
                value.matches(
                        "^[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}(/.*)?$"
                )
        ) {

            target = "https://" + value;

        } else {

            target =
                    "https://www.google.com/search?q=" +
                    Uri.encode(value);
        }

        webView.loadUrl(target);
    }

    private void showBookmarks() {

        android.content.SharedPreferences prefs =
                getSharedPreferences(
                        "goobrow",
                        MODE_PRIVATE
                );

        String bookmarks =
                prefs.getString("bookmarks", "");

        if (bookmarks.isEmpty()) {

            new android.app.AlertDialog.Builder(this)
                    .setTitle("Bookmarks")
                    .setMessage("No bookmarks saved yet.")
                    .setPositiveButton("OK", null)
                    .show();

            return;
        }

        new android.app.AlertDialog.Builder(this)
                .setTitle("Bookmarks")
                .setMessage(bookmarks)
                .setPositiveButton("OK", null)
                .show();
    }

    @Override
    public void onBackPressed() {

        if (webView != null &&
                webView.canGoBack()) {

            webView.goBack();

        } else {

            super.onBackPressed();
        }
    }
}

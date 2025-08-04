package com.riko.dojon.filament;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

public class FilamentViewManager extends SimpleViewManager<FilamentView> {
    @Override
    public String getName() {
        return FilamentView.REACT_CLASS;
    }

    @Override
    protected FilamentView createViewInstance(ThemedReactContext reactContext) {
        return new FilamentView(reactContext);
    }
}

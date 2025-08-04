package com.riko.dojon.filament;

import android.content.Context;
import android.view.SurfaceView;
import android.widget.FrameLayout;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

import com.google.android.filament.Engine;
import com.google.android.filament.Scene;
import com.google.android.filament.Renderer;
import com.google.android.filament.View;

public class FilamentView extends SimpleViewManager<FrameLayout> {

    public static final String REACT_CLASS = "FilamentView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected FrameLayout createViewInstance(ThemedReactContext reactContext) {
        Context context = reactContext.getCurrentActivity();
        FrameLayout container = new FrameLayout(context);

        SurfaceView surfaceView = new SurfaceView(context);
        container.addView(surfaceView);

        initFilament(surfaceView);

        return container;
    }

    private void initFilament(SurfaceView surfaceView) {
        Engine engine = Engine.create();
        Renderer renderer = engine.createRenderer();
        Scene scene = engine.createScene();
        View view = engine.createView();
        view.setScreenWindow(surfaceView.getWidth(), surfaceView.getHeight());
        view.setScene(scene);
        // Aquí luego cargarás tus modelos y cámaras
    }
}

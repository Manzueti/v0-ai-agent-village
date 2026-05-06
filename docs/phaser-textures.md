# Phaser 3 Textures Reference

Textures have a key, a first frame name, a map of frames, one or more source images (canvas, image, or video), and zero or more data source images (normal maps). There are three texture classes, CanvasTexture, DynamicTexture, and Texture.

The maximum texture dimensions depend on the device; you can check renderer.getMaxTextureSize(). 2048px for mobile and 4096px for desktop should be safe.

## Default textures
- Default : '__DEFAULT'
- Missing : '__MISSING'
- 4x4 white : '__WHITE'

## Get texture keys in the manager
```javascript
const keys = this.textures.getTextureKeys(); // → ['mummy', 'bat', 'torch', …]
```

## Get a texture from the manager
`textures.get()` always returns a texture; it will be the `__MISSING` texture if no such key exists. So you should use `textures.exists()` first.

```javascript
const texture = this.textures.exists("mummy")
  ? this.textures.get("mummy")
  : null;
```

## Generate texture from array
```javascript
var config = {
  data: data,
  // 3x3:
  // [ '...',
  //   '...',
  //   '...' ]
  pixelWidth: 1, // pixel width of each data
  pixelHeight: 1, // pixel height of each data
  preRender: null, // callback, function(canvas, ctx) {}
  postRender: null, // callback, function(canvas, ctx) {}

  canvas: null, // create a canvas if null
  resizeCanvas: true,
  clearCanvas: true,
};
var texture = this.textures.generate(key, config);
```

## Verify existing texture
```javascript
var hasKey = this.textures.exists(key);
```

## Get base64
```javascript
var s = this.textures.getBase64(key); // type= 'image/png', encoderOptions= 0.92
// var s = this.textures.getBase64(key, frame, type, encoderOptions);
```

## Get pixel color
```javascript
var color = this.textures.getPixel(x, y, key);
// var color = this.textures.getPixel(x, y, key, frame);
```

### Properties of color
- r : 0 ~ 255
- g : 0 ~ 255
- b : 0 ~ 255
- a : 0 ~ 255

```javascript
var alpha = this.textures.getPixelAlpha(x, y, key);
// var alpha = this.textures.getPixelAlpha(x, y, key, frame);
```
alpha : 0 ~ 255. Returns null if the coordinates were out of bounds.

## Remove texture
Remove texture stored in texture cache.
```javascript
this.textures.remove(key);
```

## Loading images for textures
Usually you won't be creating textures directly. Phaser creates textures for you when you load images.

- `load.image()` creates a texture with the single frame `__BASE`.
- `load.spritesheet()` creates a texture with frames named as integers starting from 0, plus `__BASE`.
- `load.atlas()` or `load.unityAtlas()` creates a texture with frames named in the atlas data, plus `__BASE`.
- `load.multiatlas()` creates the same, with multiple source images

In Phaser terms a "spritesheet" has uniform cells in rows or columns and an "atlas" has frames in any size and position. Phaser can load atlases created by Texture Packer (any "Phaser 3" format) or Unity.

Phaser can use any image format that the browser can display. SVGs are rasterized (by the browser) when a texture is created. Phaser v3.60 supports WebGL compressed textures.

## Usage
### Load image texture
```javascript
this.load.image(key, url);
```

### Load image texture via base64 string
```javascript
this.textures.addBase64(key, data);
```

### Get image texture
```javascript
var texture = this.textures.get(key);
var image = texture.getSourceImage();
// var width = image.width;
// var height = image.height;
```

### Get image texture from frame object
```javascript
var texture = this.textures.get(frameObject);
```

## Textures from complete images
If you already have a complete image or canvas somehow, you can add it to the Texture Manager directly using methods such as `addImage()`, `addSpriteSheet()`, `addAtlas()`. These methods are very similar to the corresponding load methods, but they take a `sourceImage` argument (the image or canvas) instead of an URL.

You can make a second texture from the same source this way, maybe if you wanted to create a different frame set:
```javascript
this.textures.addImage(
  "mummyCopy",
  this.textures.get("mummy").getSourceImage()
);
```

## Canvas Texture
A Canvas Texture has a canvas with a 2d rendering context as its source. You can use any of the Canvas API on it. You can draw texture frames on it, but not game objects (cf. Dynamic Texture).

### Create canvas texture
```javascript
const texture = this.textures.createCanvas('key', width, height);
// Or use an existing canvas:
const texture = this.textures.addCanvas('key', canvas);
```

### Drawing
Use `drawFrame()` to draw another texture frame onto the Canvas Texture:
```javascript
texture.drawFrame('mummy', 1, x, y);
```
or `draw()` if you have a source image (unusual):
```javascript
texture.draw(sourceImage, x, y);
```

### Refresh
If you work on the canvas context directly, refresh the texture when finished:
```javascript
const ctx = texture.getContext();
const { width, height } = texture;
ctx.fillStyle = "ghostwhite";
ctx.fillRect(0, 0, width, height);
texture.refresh();
```
`refresh()` is required to update the texture for display in WebGL rendering mode. Don't call `refresh()` after `draw()` or `drawFrame()`; it's already included.

If you need to use `getPixel()` or `getPixels()` after drawing, call `update()` instead of `refresh()`.

## Dynamic Texture
A Dynamic Texture is a special texture that allows you to draw textures, frames and most kind of Game Objects directly to it.

### Usage
```javascript
var texture = scene.textures.addDynamicTexture(key, width, height);
// Disable texture.isSpriteTexture if this texture is not a base texture for Sprite Game Objects.
texture.setIsSpriteTexture(false);
```

### Drawing Game Objects
```javascript
texture.draw(entries, x, y, alpha, tint);
```
`entries` can be:
- Any renderable Game Object (Sprite, Text, Graphics, TileSprite, etc.)
- Tilemap Layers.
- A Group or Container.
- A Scene Display List (`Scene.children`).
- Another Dynamic Texture or Render Texture.
- A Texture Frame instance or key string.

### Erase
```javascript
texture.erase(entries, x, y);
```

### Draw Frame / Stamp
```javascript
texture.stamp(key, frame, x, y, config);
// or
texture.drawFrame(key, frame, x, y, alpha, tint);
```

### Batch Drawing
```javascript
texture.beginDraw();
texture.batchDraw(entries, x, y, alpha, tint);
texture.batchDrawFrame(key, frame, x, y, alpha, tint);
texture.endDraw();
```

## Render Texture
A Render Texture is essentially an Image holding a Dynamic Texture.

## Events
```javascript
this.textures.on("ready", function () {});
this.textures.on("addtexture", function (key) {});
this.textures.on("onerror", function (key) {});
this.textures.on("removetexture", function (key) {});
```

## Frames
Frames are rectangular areas on a texture. All textures have a special frame, named `__BASE`, that represents the entire texture.

### Get frame names
```javascript
const frameNames = this.textures.get("mummy").getFrameNames(); // → [0, 1, 2, …]
```

### Get a frame
```javascript
var frame = this.textures.getFrame(key, frame);
// or
const mummyFrame1 = this.textures.get("mummy").get(1);
```

### Set filter mode
```javascript
this.textures.get("mummy").setFilterMode(Phaser.Textures.FilterMode.NEAREST); // Nearest-neighbor (pixelated)
this.textures.get("mummy").setFilterMode(Phaser.Textures.FilterMode.LINEAR); // Linear (antialiased)
```

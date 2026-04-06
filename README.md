# eigenfaces

*a live face generator using PCA decomposition & binary rendering*

![HTML + Canvas](https://img.shields.io/badge/HTML-Canvas-b117e8) ![sklearn PCA](https://img.shields.io/badge/sklearn-PCA-4cea15) ![LFW dataset](https://img.shields.io/badge/dataset-LFW-gray)

---

## Overview

A single-page web app that continuously generates and morphs synthetic human faces — rendered in two colors: **purple** and **green**. Faces are never stored; they are computed on the fly in the browser from a small set of PCA weights trained on real photographs.

- Pixel value `0` → purple (`#b117e8`)
- Pixel value `1` → green (`#4cea15`)

---

## How it works

### Python notebook — training

1. Fetches the [LFW (Labeled Faces in the Wild)](http://vis-www.cs.umass.edu/lfw/) dataset via scikit-learn
2. Each grayscale face is binarized at a threshold of `0.5`
3. A PCA model with 20 components is fitted on the binary data, extracting the dominant patterns ("eigenfaces")
4. The mean weights, standard deviations, and component matrix are exported as raw `float32` binary files

### JavaScript — rendering

1. On load, the three `.bin` files are fetched and parsed into `Float32Array`s
2. To generate a face, 20 random weights are sampled (`mean ± std`)
3. Weights are multiplied against the component matrix to reconstruct a 94×125 flat feature vector
4. Each value is thresholded: negative → purple, positive → green
5. Faces transition smoothly via linear interpolation over 10 frames

---

## Project structure 

project/
├── index.html                        # single page entry point
├── script.js                         # face generation + canvas rendering
├── notebook.ipynb                    # PCA training pipeline
└── assets/face_pca/
├── weights_mean.bin              # PCA weight means (20 floats)
├── weights_std.bin               # PCA weight std devs (20 floats)
└── eigenfaces_components.bin     # component matrix (20 × 11750 floats)

---

## Key parameters

| Parameter | Value | Description |
|---|---|---|
| `N_COMPONENTS` | 20 | PCA components used to describe each face |
| Face size | 94 × 125 px | 11,750 features per face |
| `face_swap_speed` | 100ms | interval between transition frames |
| Transition frames | 10 | linear interpolation steps per morph |
| Threshold | 0.5 | binarization cutoff applied during training |
| Dataset | LFW | min 70 faces/person, full resolution |

---

## Running the project

The browser fetches binary assets via relative paths, so the page must be served over HTTP — opening `index.html` as a `file://` URL will fail.
```bash
# any static server works, e.g.:
python -m http.server 8080
# then open http://localhost:8080
```

To regenerate the `.bin` files, run the notebook end-to-end. The final cells export `weights_mean.bin`, `weights_std.bin`, and `eigenfaces_components.bin` — place them in `assets/face_pca/`.

---

## Customization

Colors are defined in a two-element array at the top of `script.js`:
```js
const color_matching = ["#b117e8", "#4cea15"]
//                       pixel=0 ↑   pixel=1 ↑
```

Swap either hex value to change the palette. Increase `N_COMPONENTS` in both the notebook and `script.js` for more facial detail at the cost of larger `.bin` files.

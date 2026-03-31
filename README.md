
---

# 🛠️ PixelForge Pro | Ultimate Image Editor

**PixelForge Pro** is a sleek, responsive web application designed for quick and efficient image manipulation. It provides a professional-grade interface for applying filters, transforming dimensions, and managing image quality without the need for heavy desktop software.

## 🚀 Key Features

* **Advanced Filter Suite:** Adjust Brightness, Saturation, Contrast, Hue, Blur, Sepia, Grayscale, and Inversion in real-time.
* **Precision Cropping:** An interactive, draggable, and resizable crop overlay with a dimmed background for focus.
* **Smart Resizing:** Change image dimensions with an optional **Aspect Ratio Lock** to prevent distortion.
* **Transform Tools:** Rotate (clockwise/counter-clockwise) and Flip (horizontal/vertical) functionality.
* **Workflow History:** Robust **Undo** and **Redo** system (up to 20 steps) to experiment without risk.
* **Compare Mode:** Hold down the "Compare" button to instantly toggle between your edited version and the original.
* **Export Control:** * Choose between **JPG, PNG,** and **WebP** formats.
    * Adjustable **Quality Slider** to optimize file size vs. visual fidelity.
* **Dark Mode:** A built-in theme engine that saves your preference locally.

---

## 🎨 Interface Overview

### 1. Editor Panel (Left)
* **Filters & Tools:** Select a filter to reveal its dedicated slider.
* **Resize Panel:** Contains presets (1:1, 16:9, etc.) and manual width/height inputs.
* **Crop Controls:** Activates the interactive cropping box on the preview image.
* **Rotate & Flip:** Quick-action buttons for orientation changes.

### 2. Preview Window (Center)
* Displays real-time updates of all filters and transformations.
* Hosts the **Crop Box** with 8-point handles for precise selection.

### 3. Workflow Controls (Bottom)
* **Undo/Redo:** Navigate your edit history.
* **Reset:** Revert all filters and transformations to default.
* **Save/Upload:** Core file management buttons.

---

## 🛠️ Technical Stack

* **Frontend:** HTML5, CSS3 (Flexbox/Grid), JavaScript (ES6+).
* **Icons:** Boxicons & FontAwesome.
* **Processing:** HTML5 Canvas API for high-quality image rendering and exports.
* **Storage:** LocalStorage for theme persistence.

---

## 📖 How to Use

1.  **Upload:** Click the **Upload** button and select an image from your device.
2.  **Edit:** * Select a filter (e.g., Brightness) and move the slider.
    * Use the **Rotate** buttons to change orientation.
    * Click **Crop** to drag the handles over the area you wish to keep, then click **Apply Crop**.
3.  **Compare:** Press and hold the **Compare** button to see your progress against the original.
4.  **Save:** Choose your preferred format (JPG, PNG, or WebP), adjust the quality slider, and click **Save**.

---

## 📝 Development Notes

* The editor uses a non-destructive previewing method via CSS filters, only applying the final state to a Canvas element during the **Crop** or **Save** actions to ensure maximum performance.
* The `historyStack` manages state snapshots as JSON objects, allowing for a seamless Undo/Redo experience.
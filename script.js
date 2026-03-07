const fileInput = document.querySelector(".file-input"),
    filterOptions = document.querySelectorAll(".filter button"),
    filterName = document.querySelector(".filter-info .name"),
    filterValue = document.querySelector(".filter-info .value"),
    filterSlider = document.querySelector(".slider input"),
    sliderContainer = document.querySelector(".slider"),
    previewImg = document.querySelector(".preview-img img"),
    resetFilterBtn = document.querySelector(".reset-filter"),
    chooseImgBtn = document.querySelector(".choose-img"),
    saveImgBtn = document.querySelector(".save-img"),
    themeToggle = document.querySelector("#theme-toggle"),
    resizePanel = document.querySelector(".resize-panel"),
    cropControls = document.querySelector(".crop-controls"),
    cropBox = document.querySelector("#cropBox"),
    widthInput = document.querySelector("#width-input"),
    heightInput = document.querySelector("#height-input"),
    aspectCheck = document.querySelector("#aspect-ratio-check"),
    qualitySlider = document.querySelector(".quality-slider"),
    qualityValue = document.querySelector(".quality-value"),
    formatSelect = document.querySelector(".format-select"),
    undoBtn = document.querySelector("#undo-btn"),
    redoBtn = document.querySelector("#redo-btn"),
    compareBtn = document.querySelector(".compare-btn"),
    rotateOptions = document.querySelectorAll(".rotate button");

    let brightness = 100, saturation = 100, contrast = 100, hue = 0, blur = 0, sepia = 0, grayscale = 0, inversion = 0;
let rotate = 0, flipH = 1, flipV = 1;
let historyStack = [], redoStack = [], ogAspectRatio = 1, isCropping = false;

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeToggle.innerHTML = isDark ? "<i class='bx bxs-sun'></i>" : "<i class='bx bxs-moon'></i>";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

const captureState = () => {
    return JSON.stringify({
        src: previewImg.src,
        f: { brightness, saturation, contrast, hue, blur, sepia, grayscale, inversion },
        t: { rotate, flipH, flipV },
        d: { w: widthInput.value, h: heightInput.value }
    });
};
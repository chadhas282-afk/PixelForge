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

const saveState = () => {
    historyStack.push(captureState());
    if(historyStack.length > 20) historyStack.shift();
    redoStack = []; 
};

undoBtn.onclick = () => {
    if (!historyStack.length) return;
    redoStack.push(captureState());
    applyState(JSON.parse(historyStack.pop()));
};

redoBtn.onclick = () => {
    if (!redoStack.length) return;
    historyStack.push(captureState());
    applyState(JSON.parse(redoStack.pop()));
};

const applyState = (s) => {
    previewImg.src = s.src;
    ({brightness, saturation, contrast, hue, blur, sepia, grayscale, inversion} = s.f);
    ({rotate, flipH, flipV} = s.t);
    widthInput.value = s.d.w; heightInput.value = s.d.h;
    updateFilters();
};

let activeDragging = false, activeResizing = false, currentHandle = "";
let startX, startY, startW, startH, startL, startT;

cropBox.addEventListener("mousedown", (e) => {
    startX = e.clientX; startY = e.clientY;
    startW = cropBox.offsetWidth; startH = cropBox.offsetHeight;
    startL = cropBox.offsetLeft; startT = cropBox.offsetTop;
    
    if(e.target.classList.contains("handle")) {
        activeResizing = true;
        currentHandle = e.target.classList[1];
    } else {
        activeDragging = true;
    }
    e.preventDefault();
});

window.addEventListener("mousemove", (e) => {
    if(!isCropping) return;
    const rect = document.querySelector(".preview-img").getBoundingClientRect();
    const dx = e.clientX - startX, dy = e.clientY - startY;

    if(activeDragging) {
        let l = Math.max(0, Math.min(startL + dx, rect.width - cropBox.offsetWidth));
        let t = Math.max(0, Math.min(startT + dy, rect.height - cropBox.offsetHeight));
        cropBox.style.left = l + "px"; cropBox.style.top = t + "px";
    }

    if(activeResizing) {
        if(currentHandle.includes("e")) cropBox.style.width = Math.min(startW + dx, rect.width - cropBox.offsetLeft) + "px";
        if(currentHandle.includes("s")) cropBox.style.height = Math.min(startH + dy, rect.height - cropBox.offsetTop) + "px";
        if(currentHandle.includes("w")) {
            let nw = Math.max(50, startW - dx);
            cropBox.style.width = nw + "px"; cropBox.style.left = (startL + (startW - nw)) + "px";
        }
        if(currentHandle.includes("n")) {
            let nh = Math.max(50, startH - dy);
            cropBox.style.height = nh + "px"; cropBox.style.top = (startT + (startH - nh)) + "px";
        }
    }
});

window.addEventListener("mouseup", () => { activeDragging = activeResizing = false; });

document.querySelector(".apply-crop").addEventListener("click", () => {
    saveState();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const sX = previewImg.naturalWidth / previewImg.offsetWidth;
const sY = previewImg.naturalHeight / previewImg.offsetHeight;

    canvas.width = cropBox.offsetWidth * sX;
    canvas.height = cropBox.offsetHeight * sY;
    ctx.filter = getComputedStyle(previewImg).filter;
    ctx.drawImage(previewImg, (cropBox.offsetLeft - previewImg.offsetLeft) * sX, (cropBox.offsetTop - previewImg.offsetTop) * sY, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    
    previewImg.src = canvas.toDataURL();
    isCropping = false; 
    cropBox.style.display = "none";
    document.querySelector(".crop-controls").style.display = "none";
    brightness = 100; saturation = 100; contrast = 100; hue = 0; blur = 0; sepia = 0; grayscale = 0; inversion = 0;
    updateFilters();
});

const updateFilters = () => {
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) contrast(${contrast}%) blur(${blur}px) hue-rotate(${hue}deg) sepia(${sepia}%) grayscale(${grayscale}%) invert(${inversion}%)`;
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipH}, ${flipV})`;
    const activeBtn = document.querySelector(".filter .active");
    if (activeBtn) {
        const id = activeBtn.id;
        const valMap = { brightness, saturation, contrast, "hue-rotate": hue, blur, sepia, grayscale, inversion };
        if (valMap[id] !== undefined) {
            filterSlider.value = valMap[id];
            filterValue.innerText = `${filterSlider.value}${id === "blur" ? "px" : (id === "hue-rotate" ? "deg" : "%")}`;
        }
    }
};

filterOptions.forEach(btn => {
    btn.onclick = () => {
        document.querySelector(".active").classList.remove("active");
        btn.classList.add("active");
        filterName.innerText = btn.innerText;
        const isSpecial = ["resize", "crop"].includes(btn.id);
        sliderContainer.style.display = isSpecial ? "none" : "block";
        resizePanel.style.display = btn.id === "resize" ? "block" : "none";
        cropControls.style.display = btn.id === "crop" ? "block" : "none";
        cropBox.style.display = btn.id === "crop" ? "block" : "none";
        isCropping = btn.id === "crop";
        updateFilters();
    };
});

rotateOptions.forEach(btn => {
    btn.onclick = () => {
        saveState();
        if(btn.id === "left") rotate -= 90;
        else if(btn.id === "right") rotate += 90;
        else if(btn.id === "horizontal") flipH *= -1;
        else flipV *= -1;
        updateFilters();
    };
});

filterSlider.addEventListener("change", saveState);
filterSlider.addEventListener("input", () => {
    const id = document.querySelector(".filter .active").id;
    const val = filterSlider.value;
    if(id === "brightness") brightness = val;
    else if(id === "saturation") saturation = val;
    else if(id === "contrast") contrast = val;
    else if(id === "hue-rotate") hue = val;
    else if(id === "blur") blur = val;
    else if(id === "sepia") sepia = val;
    else if(id === "grayscale") grayscale = val;
    else if(id === "inversion") inversion = val;
    updateFilters();
});

resetFilterBtn.onclick = () => {
    saveState();
    brightness = 100; saturation = 100; contrast = 100; hue = 0; blur = 0; sepia = 0; grayscale = 0; inversion = 0;
    rotate = 0; flipH = 1; flipV = 1;
    widthInput.value = previewImg.naturalWidth; heightInput.value = previewImg.naturalHeight;
    updateFilters();
};

compareBtn.onmousedown = () => { previewImg.style.filter = "none"; previewImg.style.transform = "none"; };
compareBtn.onmouseup = updateFilters;
compareBtn.onmouseleave = updateFilters;
chooseImgBtn.onclick = () => fileInput.click();

fileInput.onchange = () => {
    const file = fileInput.files[0];
     if(!file) return;
     previewImg.src = URL.createObjectURL(file);
     previewImg.onload = () => {
        document.querySelector(".container").classList.remove("disable");
        widthInput.value = previewImg.naturalWidth; heightInput.value = previewImg.naturalHeight;
        ogAspectRatio = previewImg.naturalWidth / previewImg.naturalHeight;
        updateFilters();
    }
}

saveImgBtn.onclick = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = widthInput.value; canvas.height = heightInput.value;
    ctx.filter = previewImg.style.filter;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotate * Math.PI / 180);
    ctx.scale(flipH, flipV);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    const link = document.createElement("a");
    link.download = `pixel-forge-export.${formatSelect.value.split('/')[1]}`;
    link.href = canvas.toDataURL(formatSelect.value, qualitySlider.value / 100);
    link.click();
}

widthInput.addEventListener("input", () => {
    if (aspectCheck.checked && ogAspectRatio){
        
    }

})
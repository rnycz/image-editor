const imageInput = document.querySelector("#image-input");
const imageSource = document.querySelector('#source-image');
const imageDisplay = document.querySelector("#image-display");
const context = imageDisplay.getContext('2d');

const background = new Image();
background.src = "images/empty.png";
background.onload = () => {
	imageDisplay.width = background.width;
	imageDisplay.height = background.height;
	context.drawImage(background, 0, 0);
}

document.querySelectorAll(".slider").forEach(element => {
	element.disabled = true;
});
document.querySelectorAll(".button").forEach(element => {
	element.disabled = true;
});

imageInput.addEventListener("change", (event) => {
	const [file] = imageInput.files;
	if(file) {
		imageSource.src = URL.createObjectURL(file);
	}
	imageSource.onload = function() {
		imageDisplay.width = this.width;
		imageDisplay.height = this.height;
		imageDisplay.crossOrigin = "anonymous";
		applyEffects();
		document.querySelectorAll(".slider").forEach(element => {
			element.disabled = false;
		});
		document.querySelectorAll(".button").forEach(element => {
			element.disabled = false;
		});
		document.querySelector("#edit-info").style.display = "none";
	};
});

const setValueInfo = (slider, output) => {
	const value = slider.value;
	const min = slider.min ? slider.min : 0;
	const max = slider.max ? slider.max : 100;
	const newValue = Number(((value - min) * 100) / (max - min));
	output.innerHTML = value;

	output.style.left = `calc(${newValue}% + (${14 - newValue * 0.25}px))`;
}
document.querySelectorAll(".slider-content").forEach(element => {
	const slider = element.querySelector(".slider");
	const output = element.querySelector(".output");
	slider.addEventListener("input", () => {
		setValueInfo(slider, output);
	});
	setValueInfo(slider, output);
});

const dropdown = document.querySelectorAll(".dropdown-btn");
dropdown.forEach((button) =>{
	button.addEventListener("click", function() {
		this.classList.toggle("active-dropdown");
		const dropdownContent = this.nextElementSibling;
		if (dropdownContent.style.display === "block") {
			dropdownContent.animate([
				{opacity: 1},
				{opacity: 0}
			],{
				duration: 500
			});
			setTimeout(()=>{
				dropdownContent.style.display = "none";
			}, 450)
		} else {
			dropdownContent.style.display = "block";
		  	dropdownContent.animate([
				{opacity: 0},
				{opacity: 1}
			],{
				duration: 600
			});
		}
	});
})

//drawing
let mouse = {
	x:0,
	y:0,
	paint: false,
	drawWidth: 10,
	drawCap: "round",
	drawColor: "green",
	inputWidth: document.querySelector("#line-width"),
	inputCap: document.querySelector("#line-cap"),
	inputColor: document.querySelector("#line-color")
}
mouse.inputWidth.value = mouse.drawWidth;
const getPosition = (canvas, event) =>{
	const rect = canvas.getBoundingClientRect();
	mouse.x = (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
	mouse.y = (event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
}
const startPaint = (event) =>{
	mouse.paint = true;
	getPosition(imageDisplay, event);
}
const stopPaint = (event) =>{
	mouse.paint = false;
}
const sketch = (event) =>{
	if(!mouse.paint) return;
	context.beginPath();
	context.lineWidth = mouse.drawWidth;
	context.lineCap = mouse.drawCap;
	context.strokeStyle = mouse.drawColor;
	context.moveTo(mouse.x, mouse.y);
	getPosition(imageDisplay, event);
	context.lineTo(mouse.x, mouse.y);
	context.stroke();
}
document.querySelector("#painting").addEventListener("click", () =>{
	mouse.drawWidth = mouse.inputWidth.value;
	mouse.drawCap = mouse.inputCap.options[mouse.inputCap.selectedIndex].value;
	mouse.drawColor = mouse.inputColor.value;
	document.addEventListener("mousedown", startPaint);
	document.addEventListener("mouseup", stopPaint);
	document.addEventListener("mousemove", sketch);
})

document.querySelector("#line-minus").addEventListener("click", function(){
	this.parentNode.querySelector('input[type=number]').stepDown();
	mouse.inputWidth.animate([
		{opacity: 0},
		{opacity: 1}
	],{
		duration: 300
	});
});
document.querySelector("#line-plus").addEventListener("click", function(){
	this.parentNode.querySelector('input[type=number]').stepUp();
	mouse.inputWidth.animate([
		{opacity: 0},
		{opacity: 1}
	],{
		duration: 300
	});
})
//blur effect
const blurInput = document.querySelector("#blur-input");
const blurValue = document.querySelector("#blur-value");
blurValue.innerHTML = blurInput.value;
blurInput.oninput = function() {
	blurValue.innerHTML = this.value;
	applyEffects();
};

//brightness effect
const brightnessInput = document.querySelector("#brightness-input");
const brightnessValue = document.querySelector("#brightness-value");
brightnessValue.innerHTML = brightnessInput.value;
brightnessInput.oninput = function() {
	brightnessValue.innerHTML = brightnessInput.value;
	applyEffects();
}

//contrast effect
const contrastInput = document.querySelector("#contrast-input");
const contrastValue = document.querySelector("#contrast-value");
contrastValue.innerHTML = contrastInput.value;
contrastInput.oninput = function() {
	contrastValue.innerHTML = contrastInput.value;
	applyEffects();
}

//grayscale effect
const grayscaleInput = document.querySelector("#grayscale-input");
const grayscaleValue = document.querySelector("#grayscale-value");
grayscaleValue.innerHTML = grayscaleInput.value;
grayscaleInput.oninput = function() {
	grayscaleValue.innerHTML = grayscaleInput.value;
	applyEffects();
}

//hue-rotate effect
const rotateInput = document.querySelector("#rotate-input");
const rotateValue = document.querySelector("#rotate-value");
rotateValue.innerHTML = rotateInput.value;
rotateInput.oninput = function() {
	rotateValue.innerHTML = rotateInput.value;
	applyEffects();
}

//invert effect
const invertInput = document.querySelector("#invert-input");
let toggleInput = false;
let invertValue = 0;
invertInput.onclick = function() {
	toggleInput = !toggleInput;
	invertValue = toggleInput ? 1 : 0;
	applyEffects();
}

//saturate effect
const saturateInput = document.querySelector("#saturate-input");
const saturateValue = document.querySelector("#saturate-value");
saturateValue.innerHTML = saturateInput.value;
saturateInput.oninput = function() {
	saturateValue.innerHTML = saturateInput.value;
	applyEffects();
}

//sepia effect
const sepiaInput = document.querySelector("#sepia-input");
const sepiaValue = document.querySelector("#sepia-value");
sepiaValue.innerHTML = sepiaInput.value;
sepiaInput.oninput = function() {
	sepiaValue.innerHTML = sepiaInput.value;
	applyEffects();
}

const applyEffects = () => {
	let filterString =
		`blur(${blurInput.value}px)
        brightness(${brightnessInput.value}%)
        contrast(${contrastInput.value}%)
        grayscale(${grayscaleInput.value}%)
        hue-rotate(${rotateInput.value}deg)
        invert(${invertValue})
        saturate(${saturateInput.value}%)
        sepia(${sepiaInput.value}%)`;

	context.filter = filterString;
	context.drawImage(imageSource, 0, 0);
}

const resetChanges = () => {
	blurInput.value = 0;
	brightnessInput.value = 100;
	contrastInput.value = 100;
	grayscaleInput.value = 0;
	rotateInput.value = 0;
	invertValue = 0;
	saturateInput.value = 100;
	sepiaInput.value = 0;
	applyEffects();
	document.querySelectorAll(".slider-content").forEach(element => {
		const slider = element.querySelector(".slider");
		const output = element.querySelector(".output");
		slider.addEventListener("input", () => {
			setValueInfo(slider, output);
		});
		setValueInfo(slider, output);
	});
}
document.querySelector("#reset").onclick = resetChanges;

const downloadImg = () => {
	const linkElement = document.querySelector('#link');
	linkElement.setAttribute('download', 'image_from_editor.png');

	const canvasData = imageDisplay.toDataURL("image/png");
	canvasData.replace("image/png", "image/octet-stream");

	linkElement.setAttribute('href', canvasData);
	linkElement.click();
}
document.querySelector("#download").onclick = downloadImg;
import {
    classifyImgs,
    classifyLocations,
    getTextEmbeds,
} from "./utils_clip.js";
import { plotScatter } from "./utils_echarts.js";
import { plotResultsN } from "./utils_leaflet.js";

// Load panos.json
var geoDB = await fetch("./public/Madrid_openai.json")
    .then((response) => response.json())
    .then((data) => {
        for (const loc of data) {
            loc["CLIP_embeddings"] = loc["CLIP_embeddings"]
                .split(",")
                .map(Number);
        }
        return data;
    });

// Load laion.json
var imgDB = await fetch("./public/MadridLAION_clip.json")
    .then((response) => response.json())
    .then((data) => {
        const clean_db = [];
        for (const img of data) {
            try {
                img["CLIP_embeddings"] = img["CLIP_embeddings"]
                    .split(",")
                    .map(Number);
                clean_db.push(img);
            } catch (error) {}
        }
        return clean_db;
    });

// Initialize the Leaflet map
var map;

var map = L.map("map")
    .setView([40.418478372299504, -3.7033373803886738], 13)
    .setMaxBounds([
        [40.3798620183651025, -3.7543515107773482],
        [40.4570947262338976, -3.6523232499999994],
    ]);

// Create layer groups for positive and negative results and add them to contorllayers
const posGroup = L.layerGroup().addTo(map);
const negGroup = L.layerGroup().addTo(map);

// Add CartoDB Positron tile layer
L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> contributors',
}).addTo(map);

// Add controlpanel
var controlLayers = L.control.layers().addTo(map);

controlLayers.addOverlay(posGroup, "Positive Results");
controlLayers.addOverlay(negGroup, "Negative Results");

// Function to handle the button click event
function onRunButtonClick() {
    console.log("run sim");

    const inputField = document.getElementById("textInput");
    const inputText = inputField.value;

    console.log("Input text:", inputText);
    if (inputText != "") {
        const textEmbeds = getTextEmbeds(inputText).catch((err) =>
            console.error(err)
        );
        textEmbeds.then((text) => {
            const geoResults = classifyLocations(text, shuffle(geoDB));
            geoResults.then((res) => {
                console.log(res);
                // Clean layers
                posGroup.clearLayers();
                negGroup.clearLayers();

                // Plot the results
                plotResultsN(res, posGroup, negGroup, 500, map);
            });

            const imgResults = classifyImgs(text, shuffle(imgDB));
            imgResults.then((res) => {
                plotScatter(res);
            });
        });
    } else {
        alert("Please enter an input text to run the analysis");
    }
}

document.getElementById("runBtn").addEventListener("click", onRunButtonClick);

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

document.getElementById("closePanoBtn").addEventListener("click", closePano);

function closePano() {
    document.getElementById("panoViewport").style.display = "none";
}

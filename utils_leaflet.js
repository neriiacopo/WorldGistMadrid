export function plotResultsN(r, posGroup, negGroup, n, map) {
    // Sort results by similarity in ascending order
    const results = [...r];
    results.sort((a, b) => a.similarity - b.similarity);

    // Separate the lowest and top N entries
    const lastN = results.slice(0, n);
    const topN = results.slice(-n * 2).reverse();
    // .slice(-n * 2 + 10);

    // Calculate bounds for normalization

    const lastNMin = Math.min(...lastN.map((r) => r.similarity));
    const lastNMax = Math.max(...lastN.map((r) => r.similarity));

    const topNMin = Math.min(...topN.map((r) => r.similarity));
    const topNMax = Math.max(...topN.map((r) => r.similarity));

    highlightPano(topN[0], map);

    // Folder URL where the images are stored, ensure it is accessible from the frontend
    const imageFolderUrl = "/public/panos";
    const popupOptions = {
        maxWidth: 220,
        minWidth: 220,
        maxHeight: 160,
        className: "custom-popup",
    };

    // Normalize and create circles for the lowest N results with popups
    lastN.forEach((loc) => {
        const normalizedSimilarity =
            (loc.similarity - lastNMin) / (lastNMax - lastNMin);
        const marker = L.circle([loc.location.Y, loc.location.X], {
            color: "#f43a6c",
            fillColor: "#f43a6c",
            fillOpacity: 0,
            weight: 1,
            radius: 50 * normalizedSimilarity, // Radius based on normalized similarity
        }).addTo(negGroup);

        // Add popup with image based on pano_id
        const imageUrl = `${imageFolderUrl}/${loc.pano_id}.png`;
        marker.bindPopup(
            `<img src="${imageUrl}" alt="Image for ${
                loc.pano_id
            }" style="width:200px; height:auto;">
            <p>Similarity: ${loc.similarity.toFixed(2)}</p>`,
            popupOptions
        );
    });

    // Normalize and create circles for the top N results with popups
    topN.forEach((loc) => {
        const normalizedSimilarity =
            (loc.similarity - topNMin) / (topNMax - topNMin);
        const marker = L.circle([loc.location.Y, loc.location.X], {
            color: "white",
            fillColor: "#3A82F6",
            fillOpacity: 1,
            weight: 1,
            radius: 100 * normalizedSimilarity, // Radius based on normalized similarity
        }).addTo(posGroup);

        // Add popup with image based on pano_id
        const imageUrl = `${imageFolderUrl}/${loc.pano_id}.png`;
        marker.bindPopup(
            `<img src="${imageUrl}" alt="Image for ${
                loc.pano_id
            }" style="width:200px; height:auto;">
            <p>Similarity: ${loc.similarity.toFixed(2)}</p>`,
            popupOptions
        );
    });

    console.log("Top N:", topN, "Last N:", lastN, "Bounds:", {
        lastNMin,
        lastNMax,
        topNMin,
        topNMax,
    });
}

function highlightPano(pano, map) {
    // Display the pano viewport
    const panoViewport = document.getElementById("panoViewport");
    panoViewport.style.display = "block";

    // Update the pano image
    const panoImg = document.getElementById("panoImg");
    panoImg.src = `/public/panos/${pano.pano_id}.png`;

    // zoom to the pano
    const panoLatLng = L.latLng(pano.location.Y, pano.location.X);
    map.flyTo(panoLatLng, 16);
}

function closePano() {
    document.getElementById("panoViewport").style.display = "none";
}

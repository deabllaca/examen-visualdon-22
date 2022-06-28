import * as d3 from 'd3'

// Import des données
import data from '../data/cantons_data.geojson'

/*
========================================================================================================================
1. Dessin SVG (15 points)
========================================================================================================================
Vous pouvez dessiner la figure soit à partir d'ici ou directement dans l'HTML (public/index.html).
*/

// Définition des dimensions SVG
const svgWidth = 100;
const svgHeight = 100;

// Création du SVG
const svg = d3.select('.ex-1')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);


// Dessin du trait nhoir
svg.append('path')
    .attr('d', 'M 20 20 H 80 V 80 H 50 V 40 H 60 V 70 H 70 V 40 H 80')
    .attr('stroke', '#000')
    .attr('fill', 'none')

// Dessin du cercle rouge au centre
svg.append('circle')
    .attr('cx', 20)
    .attr('cy', 20)
    .attr('r', 5)
    .attr('fill', 'red')


/*
========================================================================================================================
2. Manipulation des données (20 points)
========================================================================================================================
*/

// Le nom du canton avec le plus d'ensoleillement (maximum radiation)

// radiations de tous cantons
const radiation = data.features.filter(canton => canton.properties.radiation);
console.log(radiation);

// radiation maximale
const maxRadiationValue = radiation.reduce((acc, canton) => {
    return canton.properties.radiation > acc ? canton.properties.radiation : acc;
}
    , 0);
console.log(maxRadiationValue);

// nom du canton avec le plus d'ensoleillement
const maxRadiationCanton = radiation.find(canton => canton.properties.radiation === maxRadiationValue);
console.log(maxRadiationCanton);

d3.select('.ex-2')
    .append('p')
    .text(`Le canton avec le plus de radiation est: ${maxRadiationCanton.properties.name}`)



// Les noms des cantons avec le moins de précipitation (minimum precipitation)

// précipitations des cantons
const minPrecipitationValue = radiation.reduce((acc, canton) => {
    return canton.properties.precipitation < acc ? canton.properties.precipitation : acc;
}
    , Infinity);
console.log(minPrecipitationValue);

// nom du canton avec le moins de précipitation
const minPrecipitationCanton = radiation.find(canton => canton.properties.precipitation === minPrecipitationValue);
console.log(minPrecipitationCanton);

d3.select('.ex-2')
    .append('p')
    .text(`Le canton avec le moins de precipitation est: ${minPrecipitationCanton.properties.name}`)


// Récupérer la moyenne des précipitations des cantons
const moyennePrecipitation = radiation.reduce((acc, canton) => {
    return acc + canton.properties.precipitation;
}
    , 0) / radiation.length;
console.log(moyennePrecipitation);

d3.select('.ex-2')
    .append('p')
    .text(`La moyenne des précipitations est de ${moyennePrecipitation}`)





/*
========================================================================================================================
3. Visualisations (45 points)
========================================================================================================================
*/

// Constantes
const margin = { top: 10, right: 40, bottom: 20, left: 40 },
    width = 0.8 * window.innerWidth - margin.left - margin.right,
    height = 0.5 * window.innerHeight + margin.top + margin.bottom;


// --- 3.1 Carte ---
const mapSvg = d3.select('#map')
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


const projection = d3.geoMercator()
    .translate([width / 2, height / 2])
    .rotate([-7.43864, -46.95108, 0])
    .center([0.54, -0.1])
    .scale(8000);

// Définir l'échelle des couleurs
// const colorScale = d3.scaleThreshold()
//     .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
//     .range(d3.schemeBlues[7]);
let colorScale = d3.scaleSequentialPow(d3.interpolateMagma)
    .domain([10000, 0])
    .exponent(0.2)

// Charger les données externes (carte)
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(mapData => {

    // Crée un tooltip qui est caché par défaut
    const tooltip = d3.select("#map")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("position", "fixed") // important si on veut pas qu'il se foute n'importe où
        .style("display", "block")
        .style("z-index", "9999")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")


    // Crée 3 fonctions qui affiche/cache le tooltip
    const mouseover = (event, d) => {
        tooltip.style("opacity", 1)
    }

    const mousemove = (event, d) => {
        tooltip
            .html(`${d.properties.name}<br>${(d.properties.precipitation)}`)
            .style("left", (event.x) - 70 + "px")
            .style("top", (event.y) - 70 + "px")
    }

    const mouseleave = (event, d) => {
        tooltip.style("opacity", 0)
    }

    // Dessine la carte
    mapSvg.append("g")
        .selectAll("path")
        .data(data.features)
        .join("path")

        // Dessine chaque cantons
        .attr("d", d3.geoPath()
            .projection(projection)
        )

        // Dessine les couleurs des cantons en fonction de leur précipitation
        .attr("fill", d => {
            const canton = data.features.find(canton => canton.properties.name === d.properties.precipitation);
            return colorScale(d.properties.precipitation);
            // const canton = data.features.find(canton => canton.properties.name === d.properties.name);
            // return colorScale(canton.precipitation);
            // return colorScale(d.properties.precipitation);
        })

        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)


});

//--------------------------------------------------------

// --- 3.2 Bubble chart ---
const bubbleFigureSvg = d3.select('#scatter-plot')
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Les domaines des axes (x et y)
// valeur de la précipitation la plus haute
const maxPrecipitation = radiation.reduce((acc, canton) => {
    return canton.properties.precipitation > acc ? canton.properties.precipitation : acc;
}, 0);

// valeur des radiations minimales 
const minRadiation = radiation.reduce((acc, canton) => {
    return canton.properties.radiation < acc ? canton.properties.radiation : acc;
}, Infinity);

// les latitudes minimum et maximum
const minLatitude = radiation.reduce((acc, canton) => {
    return canton.properties.latitude < acc ? canton.properties.latitude : acc;
}, Infinity);

const maxLatitude = radiation.reduce((acc, canton) => {
    return canton.properties.latitude > acc ? canton.properties.latitude : acc;
}, -Infinity);


// Axes des abscisses et des ordonnées
const x = d3.scalePow()
    .exponent(0.8)
    .domain([minPrecipitationValue, maxPrecipitation * 1.1])
    .range([0, width])
    .nice();

const y = d3.scalePow()
    .exponent(0.5)
    .domain([minRadiation, maxRadiationValue * 1.05])
    .range([height, 0])
    .nice();

// Fonction échelle pour la taille des cercles
let sqrtScale = d3.scaleSqrt() //la racine carré 
    .domain([minLatitude, maxLatitude])
    .range([4, 30]);

// **************** Dessin des axes ********************

// X axis
bubbleFigureSvg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .call(d3.axisBottom(x)) // petits traits
// Y axis
bubbleFigureSvg.append("g")
    .call(d3.axisLeft(y))
    .call(d3.axisLeft(y)) // petits traits


// Lignes
svg.selectAll(".tick line")
    .attr("stroke", "white")
    .attr("opacity", "0.6")

// Description axe X 
bubbleFigureSvg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("Précipitation");

// Description axe Y
bubbleFigureSvg.append("text")
    .attr("text-anchor", "end")
    .attr("y", -margin.left)
    .attr("x", -margin.top / 2)
    .attr("dy", "1.5em")
    .attr("transform", "rotate(-90)")
    .text("Radiations");


// **************** Cercles ********************

// Ajout de cercles
bubbleFigureSvg.append('g')
    .selectAll("dot") //c'est une balise inexistante, quand on veut illsutrer des données on est obligé de faire genre qu'on sélectionne une div qui n'existe pas
    .data(radiation)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.properties.precipitation))
    .attr("cy", d => y(d.properties.radiation))
    .attr("r", d => sqrtScale(d.properties.latitude))
    .attr("fill", "blue")
    .attr("opacity", "0.5")
    .attr("stroke", "white")
    .attr("stroke-width", "1")

// Animation pour les cercles 
bubbleFigureSvg.selectAll("circle")
    .transition()
    .duration(1000)
    .attr("r", d => sqrtScale(d.properties.latitude))
    .on("end", animate)


// Réponse à la question sur l'échelle pour la precipitation
bubbleFigureSvg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
    .text("L'échelle la plus adéquate pour illustrer les précipitations est une échelle logarithmique nommé ScalePow, car elle permet d'étaler les données si elles ne sont pas linéaires. ");


//--------------------------------------------------------




// URL: https://beta.observablehq.com/@dersteppenwolf/a-visual-tool-for-data-quality-checking-of-geomagnetic-data
// Title: A Visual tool for Data Quality Checking of  Geomagnetic Data
// Author: Juan Carlos (@dersteppenwolf)
// Version: 860
// Runtime version: 1

const m0 = {
  id: "e7cc7a2094faa56c@860",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# A Visual tool for Data Quality Checking of  Geomagnetic Data



## About the Author

**Author**: Juan Carlos Méndez.   

**Email**: jc.mendez[~at~]uniandes.edu.co , juan[~at~]gkudos.com

**Twitter**: @dersteppen

**Github**: https://github.com/dersteppenwolf

**Class**: ISIS 4822: Visual Analytics ,  Fall 2018 http://johnguerra.co/classes/visual_analytics_fall_2018/

**Homework #2**

**Github Repository**: https://github.com/dersteppenwolf/isis4822/tree/master/hw2

**Slides**: (pdf) https://github.com/dersteppenwolf/isis4822/blob/master/hw2/slides.hw2.jc.mendez_fall_2018.pdf 

## Dataset Description

**Nombre del Dataset** : Componentes Geomagnéticas del Observatorio de Fúquene entre 1955 y 2014 

**Dataset Title** : Geomagnetic Components of the Fúquene Observatory between 1955 and 2014

**Url** : http://geoportal.igac.gov.co/es/contenido/datos-abiertos-geodesia    https://www.datos.gov.co/browse?anonymous=true&q=Instituto+Geogr%C3%A1fico+Agust%C3%ADn+Codazzi+&sortBy=newest&tags=campo+magn%C3%A9tico&utf8=%E2%9C%93

**Institution** : Instituto Geográfico Agustín Codazzi - IGAC ( https://www.igac.gov.co/ ) 

**Number of Rows** : 525.960

**Data Types** : Quantitative, temporal


## Context

***¿Qué es el geomagnetismo?***

*Tomado de (3)*

El geomagnetismo es la ciencia que estudia el origen, las propiedades y las variaciones del campo magnético terrestre. El campo magnético que se observa en un punto de la Tierra tiene dos orígenes, uno interno y otro externo. El campo de origen externo es debido principalmente a la actividad del Sol sobre la ionosfera y la magnetosfera. Este campo externo presenta variaciones periódicas siendo la más importante la variación diaria con período de 24 horas

El campo magnético terrestre es una magnitud de carácter vectorial, por lo que para estudiar sus componentes se toma como referencia en un punto de la superficie de la Tierra un sistema cartesiano de coordenadas XYZ de ejes en dirección N-S, E-O y vertical. De esta forma, la intensidad total del campo (F) y sus proyecciones horizontal (H) y vertical (Z) están relacionadas a través del ángulo de declinación (D) que forma H con el norte geográfico, y del ángulo de inclinación magnética (I) que forman F y H.

![alt text](https://raw.githubusercontent.com/dersteppenwolf/isis4822/master/hw2/campo.png "Descomposición vectorial del Campo Magnético")


*** What is geomagnetism? ***

Geomagnetism is the science that studies the origin, properties and variations of the earth's magnetic field. The magnetic field that is observed in a point of the Earth has two origins, one internal and the other external. The field of external origin is mainly due to the activity of the Sun over the ionosphere and the magnetosphere. This external field presents periodic variations, the most important being the daily variation with a 24-hour period

The terrestrial magnetic field is a magnitude of vector character, so to study its components is taken as a reference point on the surface of the Earth a Cartesian system of XYZ coordinates of axes in direction N-S, E-O and vertical. In this way, the total intensity of the field (F) and its horizontal (H) and vertical (Z) projections are related through the declination angle (D) that forms H with the geographic north, and the angle of magnetic inclination ( I) that form F and H.



## The Problem

The dataset has a huge number of rows (525.960). The owner of data doesn't have a visual tool that let him easily check data quality  .

## The Solution

* Se creó una visualización interactiva utilizando d3 y observablehq que permite al usuario explorar los componentes geomagnéticos horizontal, vertical, declinación e intensidad total tanto de forma resumida por agregación por año, mes o día, así como también la exploración del detalle de la serie de tiempo para un día específico.

* An interactive visualization was created using d3 and observablehq that allows the user to explore the horizontal, vertical, declination and total intensity geomagnetic components in a summarized way by aggregation per year, month or day, as well as the exploration of the detail of the time series for a specific day.


## Insights

1. The user discovered some anomalies in the data using the interactive visualization. 
2. According to the owner of the data,  those anomalies were caused by errors during the process of the extraction and transformation  of  the original data.
3. The owner of the data will publish in the following days a new corrected version of the dataset 
4. The owner of data is considering to include visual tools like this in his daily work.




`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `# Visualization`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `## Data Selection / Filtering`
)})
    },
    {
      name: "viewof agg_type",
      inputs: ["radio"],
      value: (function(radio){return(
radio({
  options: [
    { label: 'Year', value: 'Year' },
    { label: 'Month', value: 'Month' },
    { label: 'Day', value: 'Day' },
  ],
  value: 'Year'
})
)})
    },
    {
      name: "agg_type",
      inputs: ["Generators","viewof agg_type"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof from_year",
      inputs: ["html"],
      value: (function(html){return(
html`<input type=range min=1955 max=2014 value=1954 step=1>`
)})
    },
    {
      name: "from_year",
      inputs: ["Generators","viewof from_year"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof to_year",
      inputs: ["html"],
      value: (function(html){return(
html`<input type=range min=1955 max=2014 value=2014 step=1>`
)})
    },
    {
      name: "to_year",
      inputs: ["Generators","viewof to_year"],
      value: (G, _) => G.input(_)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `# Summarization `
)})
    },
    {
      inputs: ["md","agg_type","from_year","to_year"],
      value: (function(md,agg_type,from_year,to_year){return(
md `## Aggregation Type :  ${agg_type}  -  Filter  Between ${from_year} and ${to_year}`
)})
    },
    {
      inputs: ["lineChart","height","filtered_data","tooltip_formatter"],
      value: (function(lineChart,height,filtered_data,tooltip_formatter)
{
const xAxisColumn = "date_time"
const yAxisColumn = "HORIZONTAL"
return lineChart(height, filtered_data  , xAxisColumn, yAxisColumn, tooltip_formatter,  "#91bfdb")
}
)
    },
    {
      inputs: ["lineChart","height","filtered_data","tooltip_formatter"],
      value: (function(lineChart,height,filtered_data,tooltip_formatter)
{
const xAxisColumn = "date_time"
const yAxisColumn = "VERTICAL"
return lineChart(height, filtered_data  , xAxisColumn, yAxisColumn, tooltip_formatter,  "#abdda4")
}
)
    },
    {
      inputs: ["lineChart","height","filtered_data","tooltip_formatter"],
      value: (function(lineChart,height,filtered_data,tooltip_formatter)
{
const xAxisColumn = "date_time"
const yAxisColumn = "DECLINACION"
return lineChart(height, filtered_data  , xAxisColumn, yAxisColumn, tooltip_formatter,  "#fdae61")
}
)
    },
    {
      inputs: ["lineChart","height","filtered_data","tooltip_formatter"],
      value: (function(lineChart,height,filtered_data,tooltip_formatter)
{
const xAxisColumn = "date_time"
const yAxisColumn = "INTENSIDAD_TOTAL"
return lineChart(height, filtered_data  , xAxisColumn, yAxisColumn, tooltip_formatter,  "#d53e4f")
}
)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `# Detail`
)})
    },
    {
      name: "viewof detail_from",
      inputs: ["date"],
      value: (function(date){return(
date({
  title: "Date Detail For", 
  min: "1955-01-01",
  max: "2014-12-31",
  value: `2013-01-01` 
})
)})
    },
    {
      name: "detail_from",
      inputs: ["Generators","viewof detail_from"],
      value: (G, _) => G.input(_)
    },
    {
      inputs: ["lineChart","height","filtered_data_detail","dateHourFormat"],
      value: (function(lineChart,height,filtered_data_detail,dateHourFormat)
{
const xAxisColumn = "date_time"
const yAxisColumn = "HORIZONTAL"
return lineChart(height, filtered_data_detail  , xAxisColumn, yAxisColumn, dateHourFormat,  "#91bfdb")
}
)
    },
    {
      inputs: ["lineChart","height","filtered_data_detail","dateHourFormat"],
      value: (function(lineChart,height,filtered_data_detail,dateHourFormat)
{
const xAxisColumn = "date_time"
const yAxisColumn = "VERTICAL"
return lineChart(height, filtered_data_detail  , xAxisColumn, yAxisColumn, dateHourFormat,  "#abdda4")
}
)
    },
    {
      inputs: ["lineChart","height","filtered_data_detail","dateHourFormat"],
      value: (function(lineChart,height,filtered_data_detail,dateHourFormat)
{
const xAxisColumn = "date_time"
const yAxisColumn = "DECLINACION"
return lineChart(height, filtered_data_detail  , xAxisColumn, yAxisColumn, dateHourFormat,  "#fdae61")
}
)
    },
    {
      inputs: ["lineChart","height","filtered_data_detail","dateHourFormat"],
      value: (function(lineChart,height,filtered_data_detail,dateHourFormat)


{
const xAxisColumn = "date_time"
const yAxisColumn = "INTENSIDAD_TOTAL"
return lineChart(height, filtered_data_detail  , xAxisColumn, yAxisColumn, dateHourFormat,  "#d53e4f")
}
)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `## Line Chart Code`
)})
    },
    {
      name: "lineChart",
      inputs: ["d3","DOM","width","numberFormat"],
      value: (function(d3,DOM,width,numberFormat){return(
(height, data, xAxisColumn, yAxisColumn, dateFormatter, lineColor ) =>  {
  const margin = ({top: 10, right: 40, bottom: 20, left: 40})
  
  const svg = d3.select(DOM.svg(width, height));
  
  const x = d3.scaleTime()
    .domain(d3.extent(data, d => d[xAxisColumn]))
    .range([margin.left, width - margin.right])
  
  // It doesn't starts at 0.... 
  const y = d3.scaleLinear()
    .domain(  [d3.min(data, d => d[yAxisColumn]), d3.max(data, d => d[yAxisColumn])     ]  ).nice()
    .range([height - margin.bottom, margin.top])
  
  const xAxis = g => g
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(x).ticks(width / 45).tickSizeOuter(0))
  
  const yAxis = g => g
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y).ticks(8, ".0f"))
  .call(g => g.select(".domain").remove())
  .call(g => g.select(".tick:last-of-type text").clone()
      .attr("x", 3)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text(data.y))
  
  // line generator
  const line = d3.line()
    .defined(d => !isNaN(d[yAxisColumn] ) )
    //.defined(d => ( d[yAxisColumn] > 20000 ) )
    .x(d => x(d[xAxisColumn]))
    .y(d => y(d[yAxisColumn]))
  
  svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", margin.top + 5)
        .attr("text-anchor", "middle")  
        .style("font-size", "12px") 
        .style("text-decoration", "none")  
        .style("font-family",  "Arial, Helvetica, sans-serif") 
        .style("text-transform",  "lowercase") 
        .text(yAxisColumn);

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);
  
  svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke",lineColor)
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);
  
  
    ///////////////////////////////////////////////////////
    var focusColor = "#2874A6"
    var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height)
        .style("stroke", focusColor)
        .style("stroke-width", "0.5px")
        .style("stroke-dasharray", "3,3");

    focus.append("circle")
        .attr("r", 3.0)
        .attr("fill", focusColor);

    focus.append("text")
        .attr("x", 10)
      	.attr("dy", ".45em")
        .attr("fill", focusColor)
        .style("font-size",  "12px")
        .style("font-family",  "Arial, Helvetica, sans-serif")
        .style("text-shadow",  "2px 2px 1px #E5E8E8");
 

    svg.append("rect")
        .attr("transform", "translate(" +0 + "," + 0+ ")")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", () => { focus.style("display", null); })
        .on("mouseout", () => { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    const bisectDate = d3.bisector(function(d) { return d[xAxisColumn]; }).left
    
    function mousemove() {
      var x0 = x.invert(d3.mouse(this)[0]),
          i = bisectDate(data, x0, 1),
          d0 = data[i - 1],
          d1 = data[i],
          d = x0 - d0[xAxisColumn] > d1[xAxisColumn] - x0 ? d1 : d0;
      focus.attr("transform", "translate(" + x(d[xAxisColumn]) + "," + y(d[yAxisColumn]) + ")");
      focus.select("text").text( () => { return dateFormatter(d1[xAxisColumn]) + " : "+ numberFormat(d[yAxisColumn]) ; });
      focus.select(".x-hover-line").attr("y2", height - y(d[yAxisColumn]) - margin.bottom  );
    }

  
  return svg.node();
}
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `## tooltip format / data Filters
`
)})
    },
    {
      name: "filtered_data",
      inputs: ["data_year","agg_type","data_year_month","data_year_month_day","from_year","to_year"],
      value: (function(data_year,agg_type,data_year_month,data_year_month_day,from_year,to_year)
{
  let data = data_year
  if(agg_type == "Month"){
    data = data_year_month
  }else if(agg_type == "Day"){
    data = data_year_month_day
  } 
  data = data.filter(d => ( 
  d["date_time"] >= new Date( from_year, 1, 1 ) ) && 
  d["date_time"] <= new Date( to_year, 1, 1 ) )
  return data
}
)
    },
    {
      name: "filtered_data_detail",
      inputs: ["detail_from","data_year_month_day_hour"],
      value: (function(detail_from,data_year_month_day_hour)
{
  var selectedDay = new Date( detail_from )
  var nextDay = new Date( detail_from );
  nextDay.setDate(nextDay.getDate() + 1);
  //console.log(selectedDay)
  //console.log(nextDay)
  let data = data_year_month_day_hour
  data = data.filter(d =>  ( 
      d["date_time"] >= new Date( selectedDay )   && 
      d["date_time"] <= new Date( nextDay )    
  ))
  return data
}
)
    },
    {
      name: "tooltip_formatter",
      inputs: ["dateYearFormat","agg_type","dateMonthFormat","dateDayFormat"],
      value: (function(dateYearFormat,agg_type,dateMonthFormat,dateDayFormat)
{
  let fmt = dateYearFormat
  if(agg_type == "Month"){
    fmt = dateMonthFormat
  }else if(agg_type == "Day"){
    fmt = dateDayFormat
  } 
  return fmt
}
)
    },
    {
      name: "parseDate",
      inputs: ["d3"],
      value: (function(d3){return(
d3.timeParse("%Y-%m-%d")
)})
    },
    {
      name: "parseDateHour",
      inputs: ["d3"],
      value: (function(d3){return(
d3.timeParse("%Y-%m-%d %H:00:00")
)})
    },
    {
      name: "dateHourFormat",
      inputs: ["d3"],
      value: (function(d3){return(
d3.timeFormat("%H")
)})
    },
    {
      name: "dateDayFormat",
      inputs: ["d3"],
      value: (function(d3){return(
d3.timeFormat("%Y-%m-%d")
)})
    },
    {
      name: "dateMonthFormat",
      inputs: ["d3"],
      value: (function(d3){return(
d3.timeFormat("%Y-%m")
)})
    },
    {
      name: "dateYearFormat",
      inputs: ["d3"],
      value: (function(d3){return(
d3.timeFormat("%Y")
)})
    },
    {
      name: "numberFormat",
      inputs: ["d3"],
      value: (function(d3){return(
d3.format(".0f")
)})
    },
    {
      name: "parseData",
      inputs: ["parseDate"],
      value: (function(parseDate){return(
(d) => { 
  //console.log(value)
  d.forEach(function(v) {
    v.date_time = parseDate(v.date_time)
    v.HORIZONTAL = +v.HORIZONTAL
    v.VERTICAL = +v.VERTICAL
    v.DECLINACION = +v.DECLINACION
    v.INTENSIDAD_TOTAL = +v.INTENSIDAD_TOTAL
    //console.log(v);
  }); 
  return d
 }
)})
    },
    {
      name: "parseData2",
      inputs: ["parseDateHour"],
      value: (function(parseDateHour){return(
(d) => { 
  //console.log(value)
  d.forEach(function(v) {
    v.date_time = parseDateHour(v.date_time)
    v.HORIZONTAL = +v.HORIZONTAL
    v.VERTICAL = +v.VERTICAL
    v.DECLINACION = +v.DECLINACION
    v.INTENSIDAD_TOTAL = +v.INTENSIDAD_TOTAL
    //console.log(v);
  }); 
  return d
 }
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `## Load Data`
)})
    },
    {
      name: "data_year",
      inputs: ["d3","parseData"],
      value: (function(d3,parseData){return(
d3.tsv("https://raw.githubusercontent.com/dersteppenwolf/isis4822/master/hw2/data/geomagnetismo_year.TSV")
.then(parseData)
)})
    },
    {
      inputs: ["data_year"],
      value: (function(data_year){return(
data_year
)})
    },
    {
      name: "data_year_month",
      inputs: ["d3","parseData"],
      value: (function(d3,parseData){return(
d3.tsv("https://raw.githubusercontent.com/dersteppenwolf/isis4822/master/hw2/data/geomagnetismo_year_month.TSV")
.then(parseData)
)})
    },
    {
      name: "data_year_month_day",
      inputs: ["d3","parseData"],
      value: (function(d3,parseData){return(
d3.tsv("https://raw.githubusercontent.com/dersteppenwolf/isis4822/master/hw2/data/geomagnetismo_year_month_day.TSV")
.then(parseData)
)})
    },
    {
      name: "data_year_month_day_hour",
      inputs: ["d3","parseData2"],
      value: (function(d3,parseData2){return(
d3.tsv("https://raw.githubusercontent.com/dersteppenwolf/isis4822/master/hw2/data/geomagnetismo_year_month_day_hour.TSV")
.then(parseData2)
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `## Imports `
)})
    },
    {
      name: "d3",
      inputs: ["require"],
      value: (function(require){return(
require("d3")
)})
    },
    {
      from: "@jashkenas/inputs",
      name: "radio",
      remote: "radio"
    },
    {
      from: "@jashkenas/inputs",
      name: "date",
      remote: "date"
    },
    {
      name: "height",
      value: (function(){return(
180
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`# References

1. D3 Line Chart by @mbostock  https://beta.observablehq.com/@mbostock/d3-line-chart 

2. Line Chart with Circle Tooltip D3 V4 by @alandunning https://bl.ocks.org/alandunning/cfb7dcd7951826b9eacd54f0647f48d3

3. Teoría de Geomagnetismo http://www.ign.es/web/resources/docs/IGNCnig/GMT-Teoria-Geomagnetismo.pdf

4. Automated Hardware and Software System for Monitoring the Earth’s Magnetic Environment https://datascience.codata.org/articles/10.5334/dsj-2016-018/

`
)})
    }
  ]
};

const m1 = {
  id: "@jashkenas/inputs",
  variables: [
    {
      name: "radio",
      inputs: ["input","html"],
      value: (function(input,html){return(
function radio(config = {}) {
  let {value: formValue, title, description, submit, options} = config;
  if (Array.isArray(config)) options = config;
  options = options.map(o => typeof o === "string" ? {value: o, label: o} : o);
  const form = input({
    type: "radio", title, description, submit, 
    getValue: input => {
      const checked = Array.prototype.find.call(input, radio => radio.checked);
      return checked ? checked.value : undefined;
    }, 
    form: html`
      <form>
        ${options.map(({value, label}) => `
          <label style="display: inline-block; margin: 5px 10px 3px 0; font-size: 0.85em;">
           <input type=radio name=input value="${value}" ${value === formValue ? 'checked' : ''} style="vertical-align: baseline;" />
           ${label}
          </label>
        `)}
      </form>
    `
  });
  form.output.remove();
  return form;
}
)})
    },
    {
      name: "input",
      inputs: ["html","d3format"],
      value: (function(html,d3format){return(
function input(config) {
  let {form, type = "text", attributes = {}, action, getValue, title, description, format, submit, options} = config;
  if (!form) form = html`<form>
	<input name=input type=${type} />
  </form>`;
  const input = form.input;
  Object.keys(attributes).forEach(key => {
    const val = attributes[key];
    if (val != null) input.setAttribute(key, val);
  });
  if (submit) form.append(html`<input name=submit type=submit style="margin: 0 0.75em" value="${typeof submit == 'string' ? submit : 'Submit'}" />`);
  form.append(html`<output name=output style="font: 14px Menlo, Consolas, monospace; margin-left: 0.5em;"></output>`);
  if (title) form.prepend(html`<div style="font: 700 0.9rem sans-serif;">${title}</div>`);
  if (description) form.append(html`<div style="font-size: 0.85rem; font-style: italic;">${description}</div>`);
  if (format) format = d3format.format(format);
  if (action) {
    action(form);
  } else {
    const verb = submit ? "onsubmit" : type == "button" ? "onclick" : type == "checkbox" || type == "radio" ? "onchange" : "oninput";
    form[verb] = (e) => {
      e && e.preventDefault();
      const value = getValue ? getValue(input) : input.value;
      if (form.output) form.output.value = format ? format(value) : value;
      form.value = value;
      if (verb !== "oninput") form.dispatchEvent(new CustomEvent("input"));
    };
    if (verb !== "oninput") input.oninput = e => e && e.stopPropagation() && e.preventDefault();
    if (verb !== "onsubmit") form.onsubmit = (e) => e && e.preventDefault();
    form[verb]();
  }
  return form;
}
)})
    },
    {
      name: "d3format",
      inputs: ["require"],
      value: (function(require){return(
require("d3-format")
)})
    },
    {
      name: "date",
      inputs: ["input"],
      value: (function(input){return(
function date(config = {}) {
  let {min, max, value, title, description} = config;
  if (typeof config == "string") value = config;
  return input({
    type: "date", title, description,
    attributes: {min, max, value}
  });
}
)})
    },
    {
      name: "input",
      inputs: ["html","d3format"],
      value: (function(html,d3format){return(
function input(config) {
  let {form, type = "text", attributes = {}, action, getValue, title, description, format, submit, options} = config;
  if (!form) form = html`<form>
	<input name=input type=${type} />
  </form>`;
  const input = form.input;
  Object.keys(attributes).forEach(key => {
    const val = attributes[key];
    if (val != null) input.setAttribute(key, val);
  });
  if (submit) form.append(html`<input name=submit type=submit style="margin: 0 0.75em" value="${typeof submit == 'string' ? submit : 'Submit'}" />`);
  form.append(html`<output name=output style="font: 14px Menlo, Consolas, monospace; margin-left: 0.5em;"></output>`);
  if (title) form.prepend(html`<div style="font: 700 0.9rem sans-serif;">${title}</div>`);
  if (description) form.append(html`<div style="font-size: 0.85rem; font-style: italic;">${description}</div>`);
  if (format) format = d3format.format(format);
  if (action) {
    action(form);
  } else {
    const verb = submit ? "onsubmit" : type == "button" ? "onclick" : type == "checkbox" || type == "radio" ? "onchange" : "oninput";
    form[verb] = (e) => {
      e && e.preventDefault();
      const value = getValue ? getValue(input) : input.value;
      if (form.output) form.output.value = format ? format(value) : value;
      form.value = value;
      if (verb !== "oninput") form.dispatchEvent(new CustomEvent("input"));
    };
    if (verb !== "oninput") input.oninput = e => e && e.stopPropagation() && e.preventDefault();
    if (verb !== "onsubmit") form.onsubmit = (e) => e && e.preventDefault();
    form[verb]();
  }
  return form;
}
)})
    },
    {
      name: "d3format",
      inputs: ["require"],
      value: (function(require){return(
require("d3-format")
)})
    }
  ]
};

const notebook = {
  id: "e7cc7a2094faa56c@860",
  modules: [m0,m1]
};

export default notebook;

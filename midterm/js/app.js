d3.json("../js/mt_heatm.vl.json").then( (data) => {
    // console.log(data );
    vegaEmbed("#vis", data, {theme: 'dark', actions:false});
}); 

d3.json("../js/trend.vl.json").then( (data) => {
    vegaEmbed("#vis_trends", data, {theme: 'dark', actions:false});
}); 

d3.json("../js/decade.vl.json").then( (data) => {
    // console.log(data );
    vegaEmbed("#vis_decade", data, {theme: 'dark', actions:false});
}); 

d3.json("../js/zone_heatm.vl.json").then( (data) => {
    // console.log(data );
    vegaEmbed("#vis_zones", data, {theme: 'dark', actions:false});
}); 

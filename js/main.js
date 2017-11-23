

d3.csv('./data/movies-title-edited.csv',
function(row){
    // This callback formats each row of the data
    return {
        city: row.city,
        country: row.country,
        type_country: row.type_country,
        land_2000: +row.land_2000,
        land_2010: +row.land_2010,
        land_growth: +row.land_growth,
        pop_2000: +row.pop_2000,
        pop_2010: +row.pop_2010,
        pop_growth: +row.pop_growth,
        density_2000: +row.density_2000,
        density_2010: +row.density_2010,
        density_growth: +row.density_growth
    }
},
function(error, dataset){
    if(error) {
        console.error('Error while loading ./data/asia_urbanization.csv dataset.');
        console.error(error);
        return;
    }

    console.log(dataset);

});




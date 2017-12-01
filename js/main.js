//SVG Parameters
var svg = d3.select('svg');
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');
//Padding if needed
var padding = {t: 50, r: 60, b: 40, l: 90};
//chartG set up
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

//Overview Chart Set Up
var overviewHeight = 600;
var overviewWidth = 600;

var fbHeight = 250;
var fbWidth = 750;



//scales
var xScaleOverview = d3.scaleLinear().range([0,overviewWidth]);
var yScaleOverview = d3.scaleLinear().range([overviewHeight,0]);
var radiusScale = d3.scaleLinear().range([0,2]);

var xScaleFB = d3.scaleBand().rangeRound([0, fbWidth], .1);
var yScaleFB = d3.scaleLinear().range([fbHeight, 0]);

var xScaleMoney = d3.scaleBand().rangeRound([0, fbWidth/2], .1);
var yScaleMoney = d3.scaleLinear().range([fbHeight, 0]);
//add more
var hover = d3.select('#hover')
    .attr("class", "tip");
//hover 2
var hover2 = d3.select('#hover2')
    .attr("class", "tip2");
//global variables for bar graph
var likes1 = [];
var max1 = 0;
var likes = [];
var title1 = '';
var likes2 = [];
var likes3 = [];
var max2 = 0;


d3.csv('./data/movies-title-edited.csv',
function(row){
    // This callback formats each row of the data
    return {
        director_name : row.director_name,
        num_critic_for_reviews : +row.num_critic_for_reviews,
        duration : +row.duration,
        director_facebook_likes : +row.director_facebook_likes,
        actor_1_name : row.actor_1_name,
        actor_1_facebook_likes : +row.actor_1_facebook_likes,
        actor_2_name : row.actor_2_name,
        actor_2_facebook_likes: +row.actor_2_facebook_likes,
        actor_3_name: row.actor_3_name,
        actor_3_facebook_likes : +row.actor_3_facebook_likes,
        gross : +row.gross,
        genres : row.genres,
        movie_title : row.movie_title,
        num_voted_users : +row.num_voted_users,
        cast_total_facebook_likes : +row.cast_total_facebook_likes,
        plot_keywords : row.plot_keywords,
        movie_imdb_link : row.movie_imdb_link,
        num_user_for_reviews : +row.num_user_for_reviews,
        language : row.language,
        country : row.country,
        content_rating : row.content_rating,
        budget : +row.budget,
        title_year : +row.title_year,
        imdb_score : +row.imdb_score,
        movie_facebook_likes : +row.movie_facebook_likes

    }
},
function(error, dataset){
    if(error) {
        console.error('Error while loading ./data/movies-title-edited.csv');
        console.error(error);
        return;
    }

    movieData = dataset;

    console.log(dataset);

    //set up background boxes
    chartG.append('rect')
    .style('fill','grey')
    .attr('width', overviewWidth+150)
    .attr('height', overviewHeight+120)
    .attr('y', -50)
    .attr('x', -100)

    chartG.append('rect')
    .style('fill','slategray')
    .attr('width', fbWidth+105)
    .attr('height', fbHeight*2)
    .attr('y', overviewHeight+75)
    .attr('x', -100)

    chartG.append('rect')
    .style('fill','silver')
    .attr('width', fbWidth/2+105)
    .attr('height', fbHeight*2)
    .attr('y', overviewHeight+75)
    .attr('x', fbWidth+5)

    //axis setup for first overview dot plot
    var grossExtent = d3.extent(dataset, function(d) {
        return d['gross'];
        });
    xScaleOverview.domain(grossExtent);
    xAxis = d3.axisBottom(xScaleOverview).ticks(5)
    gX = chartG.append('g')
        .attr('class','x axis')
        .attr('transform', 'translate(' +[0,overviewHeight+1]+' )')
        .call(xAxis);

    var votedExtent = d3.extent(dataset, function(d) {
        return d['num_voted_users'];
        });
    yScaleOverview.domain(votedExtent);

    yAxis = d3.axisLeft(yScaleOverview).ticks(6);
    gY = chartG.append('g')
        .attr('class','y axis')
        .attr('transform', 'translate(' +[-2,0]+' )')
        .call(yAxis);
    chartG.append('text')
        .attr('transform', 'translate(' + [overviewWidth/2-40,overviewHeight+40] + ')')
        .text('Gross (USD)');
    chartG.append('text')
        .attr('transform', 'translate(' + [-60,overviewHeight/2+40] + ')rotate(270)')
        .text('Number of Votes');

    chartG.append('text')
        .attr('transform', 'translate(' + [overviewWidth/2-120,-20] + ')')
        .text('Movies: Gross vs Number of Votes');

    view = chartG.append("g")
        .attr("class", "view")

        .attr('clip-path', 'url(#clip)');

    clip = chartG.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("x", 0)
        .attr("y", -5)
        .attr("width", overviewWidth + 5)
        .attr("height", overviewHeight + 5)
        .on('mouseover', null)
        .on('mouseout', null);

    rect = view.append("rect")
    .style("fill", "white")
    .attr("width", overviewWidth - 1)
    .attr("height", overviewHeight - 1)
        .on('mouseover', null)
        .on('mouseout', null);

    zoom = d3.zoom()
        .scaleExtent([1, 5])
        .translateExtent([[0, 0], [overviewWidth + 1200, overviewHeight + 600]])
        .on("zoom", zoomed);

    view.call(zoom);
    // rect.call(zoom);
    // svg.call(zoom);

    var imdbExtent = d3.extent(dataset,function(d) {
        return d['imdb_score'];
        });
    radiusScale.domain(imdbExtent);

    filterChart("all");

});

function zoomed() {
    // rect.attr("transform", d3.event.transform);
    gX.call(xAxis.scale(d3.event.transform.rescaleX(xScaleOverview)));
    gY.call(yAxis.scale(d3.event.transform.rescaleY(yScaleOverview)));
    movies.merge(moviesEnter).attr("transform", d3.event.transform);

}

function onCategoryChanged() {
    var select = d3.select('#categorySelect').node();
    var category = select.options[select.selectedIndex].value;
    d3.selectAll('.dot').remove();
    if (typeof chartG2 != 'undefined') {
        chartG2.remove();
    }
    if (typeof chartG3 != 'undefined') {
        chartG3.remove();
    }
    // chartG.transition()
    //     .duration(1000)
    //     .call(zoom.transform, d3.zoomIdentity);
    filterChart(category);
    // zoom = d3.zoom()
    //     .scaleExtent([1, 5])
    //     .translateExtent([[0, 0], [overviewWidth + 1200, overviewHeight + 600]])
    //     .on("zoom", zoomed);
    //
    // view.call(zoom);
    // chartG.call(zoom);

    view.transition()
        .duration(500)
        .call(zoom.transform, d3.zoomIdentity);

}

function filterChart(category) {

    var filtered = movieData.filter(function(d) {
        if (category == "low") {
            return d.imdb_score >= 0 && d.imdb_score < 5;
        } else if (category == "middle") {
            return d.imdb_score >= 5 && d.imdb_score < 7;
        } else if (category == "high") {
            return d.imdb_score >= 7 && d.imdb_score <= 10;
        } else {
            return true;
        }
    })
    console.log(filtered);
    // var movies = chartG.selectAll('.dot')

    movies = view.selectAll('.dot')
        .data(filtered, function(d) {
            return d.movie_title;
        });

    moviesEnter = movies.enter()
        .append('circle')
        .attr('class','dot');

    //set up
    var initalized = false;
    var clickCounter = 0;

    moviesEnter
        .attr('cy',function(d) {
            return yScaleOverview(d['num_voted_users']);
        })
        .attr('cx',function(d) {
            return xScaleOverview(d['gross']);
        })
        .attr('fill', function(d) {
            if(d['imdb_score'] <=1 ) {
                return '#660000';
            }
            else if(d['imdb_score'] <= 2 ) {
                return '#990000';
            }
            else if(d['imdb_score'] <= 3 ) {
                return '#CC0000';
            }
            else if(d['imdb_score'] <= 4) {
                return '#FF3300';
            }
            else if(d['imdb_score'] <= 5 ) {
                return '#FF6600';
            }
            else if(d['imdb_score'] <= 6) {
                return '#FFCC00';
            }
            else if(d['imdb_score'] <= 7) {
                return '#FFFF00';
            }
            else if(d['imdb_score'] <= 8) {
                return '#003300';
            }
            else if(d['imdb_score'] <= 9) {
                return '#009900';
            }
            else if(d['imdb_score'] <= 10) {
                return '#00FF00';
            }
        })
        .attr('r',function(d) {
            return 3;
        })
        .on("click", function(d) {

            if (clickCounter == 0) {
                if (initalized == true) {
                    chartG2.remove();
                    chartG3.remove();
                    }
                console.log(clickCounter);
                clickCounter++;
                hover.transition()
                    .duration(1000)
                    .style("visibility", "visible");
                hover.html("<strong>Movie Title: </strong>" + d['movie_title'] +"<br />" +
                    "<strong>Actor 1: </strong>" + d['actor_1_name'] +"<br />" +
                    "<strong>Actor 1 Facebook Likes: </strong>" + d['actor_1_facebook_likes'] +"<br />" +
                    "<strong>Actor 2: </strong>" + d['actor_2_name'] +"<br />" +
                    "<strong>Actor 2 Facebook Likes: </strong>" + d['actor_2_facebook_likes'] +"<br />" +
                    "<strong>Actor 3: </strong>" + d['actor_3_name'] +"<br />" +
                    "<strong>Actor 3 Facebook Likes: </strong>" + d['actor_3_facebook_likes'] +"<br />" +
                    "<strong>Director Name: </strong>" + d['director_name'] +"<br />" +
                    "<strong>Director Facebook Likes: </strong>" + d['director_facebook_likes'] +"<br />" +
                    "<strong>Duration: </strong>" + d['duration'] +"<br />" +
                    "<strong>Gross: </strong>" + d['gross'] +"<br />" +
                    "<strong>Genres: </strong>" + d['genres'] +"<br />" +
                    //"<strong>Cast Total Facebook Likes: </strong>" + d['cast_total_facebook_likes'] +"<br />" +
                    "<strong>Country: </strong>" + d['country'] +"<br />" +
                    // "<strong>Plot Keywords: </strong>" + d['plot_keywords'] +"<br />" +
                    // "<strong>IMDB Link: </strong>" + d['movie_imdb_link'] +"<br />" +
                    "<strong>Content Rating: </strong>" + d['content_rating'] +"<br />" +
                    "<strong>Budget: </strong>" + d['budget'] +"<br />" +
                    "<strong>Title Year: </strong>" + d['title_year'] +"<br />" +
                    "<strong>IMDB Score: </strong>" + d['imdb_score'] +"<br />" +
                    "<strong>Movie Facebook Likes: </strong>" + d['movie_facebook_likes'] +"<br />" +
                    "<strong>Number of Voted Users: </strong>" + d['num_voted_users'] +"<br />" +
                    "<strong>Number of Critics for Reviews: </strong>" + d['num_critic_for_reviews'] +"<br />" +
                    "<strong>Number of Users for Reviews: </strong>" + d['num_user_for_reviews'] +"<br />");
                chartG2 = svg.append('g')
                .attr('transform', 'translate('+[padding.l, overviewHeight + padding.t + 100]+')');
                updateChart(d,clickCounter);
                chartG3 = svg.append('g')
                .attr('transform', 'translate('+[padding.l+fbWidth+100, overviewHeight + padding.t + 100]+')');
                updateChart2(d,clickCounter);
                initalized = true;
                chartG2.style("visibility", "visible");
                chartG3.style("visibility", "visible");

            }
            else if (clickCounter == 1) {
                clickCounter=0;
                updateChart(d,clickCounter);
                updateChart2(d,clickCounter);
                    hover2.transition()
                        .duration(1000)
                        .style("visibility", "visible");
                    hover2.html("<strong>Movie Title: </strong>" + d['movie_title'] +"<br />" +
                        "<strong>Actor 1: </strong>" + d['actor_1_name'] +"<br />" +
                        "<strong>Actor 1 Facebook Likes: </strong>" + d['actor_1_facebook_likes'] +"<br />" +
                        "<strong>Actor 2: </strong>" + d['actor_2_name'] +"<br />" +
                        "<strong>Actor 2 Facebook Likes: </strong>" + d['actor_2_facebook_likes'] +"<br />" +
                        "<strong>Actor 3: </strong>" + d['actor_3_name'] +"<br />" +
                        "<strong>Actor 3 Facebook Likes: </strong>" + d['actor_3_facebook_likes'] +"<br />" +
                        "<strong>Director Name: </strong>" + d['director_name'] +"<br />" +
                        "<strong>Director Facebook Likes: </strong>" + d['director_facebook_likes'] +"<br />" +
                        "<strong>Duration: </strong>" + d['duration'] +"<br />" +
                        "<strong>Gross: </strong>" + d['gross'] +"<br />" +
                        "<strong>Genres: </strong>" + d['genres'] +"<br />" +
                        //"<strong>Cast Total Facebook Likes: </strong>" + d['cast_total_facebook_likes'] +"<br />" +
                        "<strong>Country: </strong>" + d['country'] +"<br />" +
                        // "<strong>Plot Keywords: </strong>" + d['plot_keywords'] +"<br />" +
                        // "<strong>IMDB Link: </strong>" + d['movie_imdb_link'] +"<br />" +
                        "<strong>Content Rating: </strong>" + d['content_rating'] +"<br />" +
                        "<strong>Budget: </strong>" + d['budget'] +"<br />" +
                        "<strong>Title Year: </strong>" + d['title_year'] +"<br />" +
                        "<strong>IMDB Score: </strong>" + d['imdb_score'] +"<br />" +
                        "<strong>Movie Facebook Likes: </strong>" + d['movie_facebook_likes'] +"<br />" +
                        "<strong>Number of Voted Users: </strong>" + d['num_voted_users'] +"<br />" +
                        "<strong>Number of Critics for Reviews: </strong>" + d['num_critic_for_reviews'] +"<br />" +
                        "<strong>Number of Users for Reviews: </strong>" + d['num_user_for_reviews'] +"<br />");

            }
            // .style("left", (d3.event.pageX) + "px")
            // .style("top", (d3.event.pageY - 50) + "px");
        })
        .style('fill-opacity', 0.6)
        .attr('stroke', 'black');


        movies.exit().remove();

};

function zoomed() {
    // view.attr("transform", d3.event.transform);
    moviesEnter.attr("transform", d3.event.transform);
    gX.call(xAxis.scale(d3.event.transform.rescaleX(xScaleOverview)));
    gY.call(yAxis.scale(d3.event.transform.rescaleY(yScaleOverview)));
}



function updateChart(d,count) {
    //xScaleFB.domain([d['actor_1_name'], d['actor_2_name'], d['actor_3_name'], d['director_name']]);
    xScaleFB.domain(['actor_1_name', 'actor_2_name', 'actor_3_name', 'director_name', 'cast_total_facebook_likes']);

    var tickLabels = ['Actor 1', 'Actor 2', 'Actor 3', 'Director'];

    var xAxis2 = d3.axisBottom(xScaleFB);


    if (count == 1) {
        likes1.push(d.actor_1_facebook_likes);
        likes1.push(d.actor_2_facebook_likes);
        likes1.push(d.actor_3_facebook_likes);
        likes1.push(d.director_facebook_likes);
        likes1.push(d.cast_total_facebook_likes);
        title1 = d['movie_title'];
        max1 = d3.max(likes1);
    }



    if (count == 0) {
        likes.push(d.actor_1_facebook_likes);
        likes.push(d.actor_2_facebook_likes);
        likes.push(d.actor_3_facebook_likes);
        likes.push(d.director_facebook_likes);
        likes.push(d.cast_total_facebook_likes);
        if(d3.max(likes) > max1) {
            max1 = d3.max(likes);
            }
    }



    if (count == 0) {
        yScaleFB.domain([0, max1]);
        var yAxis2 = d3.axisLeft(yScaleFB).ticks(5);
        chartG2.append('g')
            .attr('class', 'x axis2')
            .attr('transform', 'translate('+[0, fbHeight]+')')
            .call(xAxis2.tickFormat(function(d) {

                if (d == 'cast_total_facebook_likes') {
                    return 'Cast Total';
                }
                if (d != 'director_name') {
                    return d.charAt(0).toUpperCase() + d.substring(1, 7).replace(/_/, ' ');
                } else {
                    console.log(d.split(1, d.indexOf('_'))[0]);
                    console.log(d);

                    return d.charAt(0).toUpperCase() + d.substring(1, d.indexOf('_'));
                }
            }));

        chartG2.append('g')
            .attr('class', 'y axis2')
            .call(yAxis2);

        chartG2.append('text')
            .attr('transform', 'translate(' + [fbWidth/2 -60, fbHeight+40] + ')')
            .text('Cast');

        chartG2.append('rect')
            .attr('width', 20)
            .attr('height', 20)
            .attr('x', 30)
            .attr('fill', '#D52727')
            .attr('y', fbHeight + 40);

        chartG2.append('rect')
            .attr('width', 20)
            .attr('height', 20)
            .attr('x', 30)
            .attr('fill', 'purple')
            .attr('y', fbHeight + 65);

        chartG2.append('text')
            .attr('transform', 'translate(' + [160, -10] + ')')
            .text('Comparision of Cast Facebook Likes');

        chartG2.append('text')
            .attr('transform', 'translate(' + [60, fbHeight+57] + ')')
            .text(title1);

        chartG2.append('text')
            .attr('transform', 'translate(' + [60, fbHeight+77] + ')')
            .text(function(b) {
                return d['movie_title'];
                });


        chartG2.append('text')
            .attr('transform', 'translate(' + [-60,fbHeight/2 + 40] + ')rotate(270)')
            .text('Facebook Likes');

        likeTypes = ['actor_1_facebook_likes', 'actor_2_facebook_likes', 'actor_3_facebook_likes', 'director_facebook_likes','cast_total_facebook_likes'];
        castNames = ['actor_1_name', 'actor_2_name', 'actor_3_name', 'director_name', 'cast_total_facebook_likes' ];
        indices = [0, 1, 2, 3, 4];
        //scolors = ['#D52727', '#2BA02D', '#2079B5', '#FF800F', 'purple'];

        chartG2.selectAll('.bars')
            .data(indices)
            .enter()
            .append('rect')
            .attr('class', 'bars')
            .attr('x', function(index) {return -20 + xScaleFB(castNames[index]) + xScaleFB.bandwidth()/2 - 15;})
            .attr('y', function(index) {return yScaleFB(likes1[index])})
            .attr('width', 30)
            .attr('height', function(index) {return fbHeight - yScaleFB(likes1[index]);})
            .attr('fill', '#D52727');

        chartG2.selectAll('.bars2')
            .data(indices)
            .enter()
            .append('rect')
            .attr('class', 'bars2')
            .attr('x', function(index) {return 25 + xScaleFB(castNames[index]) + xScaleFB.bandwidth()/2 - 15;})
            .attr('y', function(index) {return yScaleFB(likes[index])})
            .attr('width', 30)
            .attr('height', function(index) {return fbHeight - yScaleFB(likes[index]);})
            .attr('fill', 'purple');

         likes1 = [];
         max1 = 0;
         likes = [];

    }


}

function updateChart2(d,count) {
    //xScaleFB.domain([d['actor_1_name'], d['actor_2_name'], d['actor_3_name'], d['director_name']]);
    xScaleMoney.domain(['budget', 'gross']);

    var tickLabels = ['Budget','Gross'];

    var xAxis3 = d3.axisBottom(xScaleMoney);


    if (count == 1) {
        likes2.push(d.budget);
        likes2.push(d.gross);
        title1 = d['movie_title'];
        max2 = d3.max(likes2);
    }



    if (count == 0) {
        likes3.push(d.budget);
        likes3.push(d.gross);
        if(d3.max(likes3) > max2) {
            max2 = d3.max(likes3);
            }
    }



    if (count == 0) {
        yScaleMoney.domain([0, max2]);
        var yAxis3 = d3.axisLeft(yScaleMoney).ticks(5);
        chartG3.append('g')
            .attr('class', 'x axis3')
            .attr('transform', 'translate('+[0, fbHeight]+')')
            .call(xAxis3.tickFormat(function(d) {

                if (d == 'cast_total_facebook_likes') {
                    return 'Cast Total';
                }
                if (d != 'director_name') {
                    return d.charAt(0).toUpperCase() + d.substring(1, 7).replace(/_/, ' ');
                } else {
                    console.log(d.split(1, d.indexOf('_'))[0]);
                    console.log(d);

                    return d.charAt(0).toUpperCase() + d.substring(1, d.indexOf('_'));
                }
            }));

        chartG3.append('g')
            .attr('class', 'y axis3')
            .call(yAxis3);

        chartG3.append('text')
            .attr('transform', 'translate(' + [fbWidth/2-240, fbHeight+40] + ')')
            .text('Budget + Gross');

        chartG3.append('text')
            .attr('transform', 'translate(' + [fbWidth/2-330, -10] + ')')
            .text('Comparision of Budget and Gross');

        chartG3.append('text')
            .attr('transform', 'translate(' + [-80,fbHeight/2 + 40] + ')rotate(270)')
            .text('Dollars (USD)');

        likeTypes = ['budget','gross'];
        castNames = ['budget','gross'];
        indices = [0, 1];
        //scolors = ['#D52727', '#2BA02D', '#2079B5', '#FF800F', 'purple'];

        chartG3.selectAll('.bars3')
            .data(indices)
            .enter()
            .append('rect')
            .attr('class', 'bars3')
            .attr('x', function(index) {return -20 + xScaleMoney(castNames[index]) + xScaleMoney.bandwidth()/2 - 15;})
            .attr('y', function(index) {return yScaleMoney(likes2[index])})
            .attr('width', 30)
            .attr('height', function(index) {return fbHeight - yScaleMoney(likes2[index]);})
            .attr('fill', '#D52727');

        chartG3.selectAll('.bars4')
            .data(indices)
            .enter()
            .append('rect')
            .attr('class', 'bars4')
            .attr('x', function(index) {return 25 + xScaleMoney(castNames[index]) + xScaleMoney.bandwidth()/2 - 15;})
            .attr('y', function(index) {return yScaleMoney(likes3[index])})
            .attr('width', 30)
            .attr('height', function(index) {return fbHeight - yScaleMoney(likes3[index]);})
            .attr('fill', 'purple');

         likes2 = [];
         max2 = 0;
         likes3 = [];

    }


}



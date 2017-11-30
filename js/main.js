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

    var zoom = d3.zoom()
        .scaleExtent([1, 5])
        .translateExtent([[0, 0], [overviewWidth + 400, overviewHeight + 400]])
        .on("zoom", zoomed);

    rect.call(zoom);


    var imdbExtent = d3.extent(dataset,function(d) {
        return d['imdb_score'];
        });
    radiusScale.domain(imdbExtent);

    filterChart("all");

});

function zoomed() {
    // view.attr("transform", d3.event.transform);
    gX.call(xAxis.scale(d3.event.transform.rescaleX(xScaleOverview)));
    gY.call(yAxis.scale(d3.event.transform.rescaleY(yScaleOverview)));
    moviesEnter.attr("transform", d3.event.transform);

}

function updateChart(d) {
    xScaleFB.domain([d['actor_1_name'], d['actor_2_name'], d['actor_3_name'], d['director_name']]);
    var xAxis2 = d3.axisBottom(xScaleFB);

    chartG2.append('g')
        .attr('class', 'x axis2')
        .attr('transform', 'translate('+[0, fbHeight]+')')
        .call(xAxis2);

    var likes = [];
    likes.push(d.actor_1_facebook_likes);
    likes.push(d.actor_2_facebook_likes);
    likes.push(d.actor_3_facebook_likes);
    likes.push(d.director_facebook_likes);

    var maxLikes = d3.max(likes);

    yScaleFB.domain([0, maxLikes]);
    var yAxis2 = d3.axisLeft(yScaleFB).ticks(4);

    chartG2.append('g')
        .attr('class', 'y axis2')
        .call(yAxis2);

    chartG2.append('text')
        .attr('transform', 'translate(' + [fbWidth/2 -40, fbHeight+40] + ')')
        .text('Actors and Director');

    chartG2.append('text')
        .attr('transform', 'translate(' + [-60,fbHeight/2 + 40] + ')rotate(270)')
        .text('Facebook Likes');

    likeTypes = ['actor_1_facebook_likes', 'actor_2_facebook_likes', 'actor_3_facebook_likes', 'director_facebook_likes'];
    castNames = ['actor_1_name', 'actor_2_name', 'actor_3_name', 'director_name'];
    indices = [0, 1, 2, 3];
    colors = ['#D52727', '#2BA02D', '#2079B5', '#FF800F'];

    chartG2.selectAll('.bar')
        .data(indices)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', function(index) {return xScaleFB(d[castNames[index]]) + xScaleFB.bandwidth()/2 - 15;})
        .attr('y', function(index) {return yScaleFB(d[likeTypes[index]])})
        .attr('width', 30)
        .attr('height', function(index) {return fbHeight - yScaleFB(d[likeTypes[index]]);})
        .attr('fill', function(index) {return colors[index];});
}

function onCategoryChanged() {
    var select = d3.select('#categorySelect').node();
    var category = select.options[select.selectedIndex].value;
    filterChart(category);
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
    // var movies = chartG.selectAll('.dot')

    var movies = view.selectAll('.dot')
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
                    "<strong>Cast Total Facebook Likes: </strong>" + d['cast_total_facebook_likes'] +"<br />" +
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
                initalized = true;
                chartG2.style("visibility", "visible");
            }
            else if (clickCounter == 1) {
                clickCounter=0;
                updateChart(d,clickCounter);
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
                        "<strong>Cast Total Facebook Likes: </strong>" + d['cast_total_facebook_likes'] +"<br />" +
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
    xScaleFB.domain(['actor_1_name', 'actor_2_name', 'actor_3_name', 'director_name']);

    var xAxis2 = d3.axisBottom(xScaleFB);


    if (count == 1) {
        likes1.push(d.actor_1_facebook_likes);
        likes1.push(d.actor_2_facebook_likes);
        likes1.push(d.actor_3_facebook_likes);
        likes1.push(d.director_facebook_likes);
        max1 = d3.max(likes1);
    }



    if (count == 0) {
        likes.push(d.actor_1_facebook_likes);
        likes.push(d.actor_2_facebook_likes);
        likes.push(d.actor_3_facebook_likes);
        likes.push(d.director_facebook_likes);
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
            .call(xAxis2);

        chartG2.append('g')
            .attr('class', 'y axis2')
            .call(yAxis2);

        chartG2.append('text')
            .attr('transform', 'translate(' + [fbWidth/2 -40, fbHeight+40] + ')')
            .text('Actors and Director');

        chartG2.append('text')
            .attr('transform', 'translate(' + [-60,fbHeight/2 + 40] + ')rotate(270)')
            .text('Facebook Likes');

        likeTypes = ['actor_1_facebook_likes', 'actor_2_facebook_likes', 'actor_3_facebook_likes', 'director_facebook_likes'];
        castNames = ['actor_1_name', 'actor_2_name', 'actor_3_name', 'director_name'];
        indices = [0, 1, 2, 3];
        colors = ['#D52727', '#2BA02D', '#2079B5', '#FF800F'];

        chartG2.selectAll('.bars')
            .data(indices)
            .enter()
            .append('rect')
            .attr('class', 'bars')
            .attr('x', function(index) {return -20 + xScaleFB(castNames[index]) + xScaleFB.bandwidth()/2 - 15;})
            .attr('y', function(index) {return yScaleFB(likes1[index])})
            .attr('width', 30)
            .attr('height', function(index) {return fbHeight - yScaleFB(likes1[index]);})
            .attr('fill', function(index) {return colors[index];});

        chartG2.selectAll('.bars2')
            .data(indices)
            .enter()
            .append('rect')
            .attr('class', 'bars2')
            .attr('x', function(index) {return 25 + xScaleFB(castNames[index]) + xScaleFB.bandwidth()/2 - 15;})
            .attr('y', function(index) {return yScaleFB(likes[index])})
            .attr('width', 30)
            .attr('height', function(index) {return fbHeight - yScaleFB(likes[index]);})
            .attr('fill', function(index) {return colors[index];});

         likes1 = [];
         max1 = 0;
         likes = [];

    }


}




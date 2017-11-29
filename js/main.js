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
var overviewHeight =400;
var overviewWidth = 400;
//scales
var xScaleOverview = d3.scaleLinear().range([0,overviewWidth]);
var yScaleOverview = d3.scaleLinear().range([overviewHeight,0]);
var radiusScale = d3.scaleLinear().range([0,2]);
//add more
var hover = d3.select('#hover')
    .attr("class", "tip");

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

    yAxis = d3.axisLeft(yScaleOverview).ticks(6)
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
    
    // var movies = chartG.selectAll('.dot')

    var movies = view.selectAll('.dot')

        .data(dataset);
    moviesEnter = movies.enter()
        .append('circle')
        .attr('class','dots');
        // .attr('clip-path', 'url(#clip)');

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

        .on("mouseover", function(d) {
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


                // .style("left", (d3.event.pageX) + "px")
                // .style("top", (d3.event.pageY - 50) + "px");
        })
        .on("mouseout", function(d) {
            hover.transition()
                .duration(1000)
                .style("visibility", "hidden");
        })
        .style('fill-opacity', 0.6)
        .attr('stroke', 'black');









});

function zoomed() {
    // view.attr("transform", d3.event.transform);
    moviesEnter.attr("transform", d3.event.transform);
    gX.call(xAxis.scale(d3.event.transform.rescaleX(xScaleOverview)));
    gY.call(yAxis.scale(d3.event.transform.rescaleY(yScaleOverview)));
}




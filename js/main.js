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
        console.error('Error while loading ./data/asia_urbanization.csv dataset.');
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


    clip = chartG.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", overviewWidth)
        .attr("height", overviewHeight);

    view = chartG.append("g")
        .attr("class", "view")

        .attr('clip-path', 'url(#clip)');

    rect = view.append("rect")
    .style("fill", "white")
    .attr("width", overviewWidth - 1)
    .attr("height", overviewHeight - 1);




    var imdbExtent = d3.extent(dataset,function(d) {
        return d['imdb_score'];
        });
    radiusScale.domain(imdbExtent);
    
//     var movies = chartG.selectAll('.dot')

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
        .style('fill-opacity', 0.6)
        .attr('stroke', 'black');



    var zoom = d3.zoom()
        .scaleExtent([1, 5])
        .translateExtent([[0, 0], [overviewWidth + 400, overviewHeight + 400]])
        .on("zoom", zoomed);

    rect.call(zoom);





});

function zoomed() {
    // view.attr("transform", d3.event.transform);
    moviesEnter.attr("transform", d3.event.transform);
    gX.call(xAxis.scale(d3.event.transform.rescaleX(xScaleOverview)));
    gY.call(yAxis.scale(d3.event.transform.rescaleY(yScaleOverview)));
}




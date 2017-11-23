

d3.csv('./data/movies-title-edited.csv',
function(row){
    // This callback formats each row of the data
    return {
        director_name : row.director_name,
        num_critic_for_reviews : row.num_critic_for_reviews,
        duration : row.duration,
        director_facebook_likes : row.director_facebook_likes,
        actor_1_name : row.actor_1_name,
        actor_1_facebook_likes : row.actor_1_facebook_likes,
        actor_2_name : row.actor_2_name,
        actor_2_facebook_likes: row.actor_2_facebook_likes,
        actor_3_name: row.actor_3_name,
        actor_3_facebook_likes : row.actor_3_facebook_likes,
        gross : row.gross,
        genres : row.genres,
        movie_title : row.movie_title,
        num_voted_users : row.num_voted_users,
        cast_total_facebook_likes : row.cast_total_facebook_likes,
        plot_keywords : row.plot_keywords,
        movie_imdb_link : row.movie_imdb_link,
        num_user_for_reviews : row.num_user_for_reviews,
        language : row.language,
        country : row.country,
        content_rating : row.content_rating,
        budget : row.budget,
        title_year : row.title_year,
        imdb_score : row.imdb_score,
        movie_facebook_likes : row.movie_facebook_likes

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




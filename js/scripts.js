// API: b0ea9e8719ded276503143740ee7613b

var apiKet = 'b0ea9e8719ded276503143740ee7613b',
    resultElem = document.getElementById('result'),
    searchMovie = document.getElementById('searchMovie'),
    modalMovies = document.getElementById('modalMovies'),
    data = "{}",
    xhr = new XMLHttpRequest();

searchMovie.oninput = function () {
    getMovieList(this.value)
};

getStartMovieList();

function apiRequest(query) {
    xhr.open("GET", `https://api.themoviedb.org/3/search/movie?page=1&query=${query}&api_key=${apiKet}`, false);
    xhr.send(data);
    return xhr;
}

function getMovieList(value) {
    if(value.length > 2) {
        var result = apiRequest(value),
            resultJson = JSON.parse(result.response);

        resultElem.innerHTML = "";

        if (resultJson.results.length >= 1) {
            var sortResultJson = resultJson.results.sort(function (a, b) {
                if (a.vote_average < b.vote_average) {
                    return 1;
                }
                if (a.vote_average > b.vote_average) {
                    return -1;
                }
                return 0;
            });

            resultJson.results.forEach(function (item, i, arr) {
                buildListMovies(item);
            });
        } else {
            resultElem.innerHTML = '<div class="col-12 text-center">Not found movies</div>';
        }
    } else if (value.length == 0) {
        getStartMovieList();
    }
}

function getStartMovieList() {
    xhr.open("GET", `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKet}&language=en-US&page=1`, false);
    xhr.send(data);
    var resultJson = JSON.parse(xhr.response);

    resultElem.innerHTML = "";
    resultJson.results.forEach(function (item, i, arr) {
        buildListMovies(item);
    });
}

function buildListMovies(item) {
    console.log(item);
    let resultCard = `
    <div class="col-4 result-card">
        <div class="result-card__poster">
            <img src="${(item.poster_path)? 'https://image.tmdb.org/t/p/w300_and_h450_bestv2/'+item.poster_path : 'img/notfound.jpg'}" alt="${item.title}">
        </div>
        <div class="result-card__title">
                <h4>${item.title}</h4>
        </div>
        <div class="result-card__overview">
                ${item.overview.substring(0,240)}
        </div>
        <div class="row">
            <div class="col-6">
                <div class="result-card__popularity">
                    <b>Popularity: </b> ${item.popularity}
                </div>
            </div>
            <div class="col-6">
                <div class="result-card__vote-average">
                    <b>Vote average: </b> ${item.vote_average}
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-info result-card__button" onclick="buildItemMovie(${item.id})" data-toggle="modal" data-target="#modalMovies">
            More Info
        </button>
    </div>`;
    resultElem.innerHTML += resultCard;
}

function buildItemMovie(id) {
    xhr.open("GET", `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKet}&language=en-US`, false);
    xhr.send(data);
    let resultJson = JSON.parse(xhr.response);

    modalMovies.innerHTML =
    `<div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                    ${resultJson.title}
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-4 modal-dialog__poster">
                        <img src="${(resultJson.poster_path)? 'https://image.tmdb.org/t/p/w300_and_h450_bestv2/'+resultJson.poster_path : 'img/notfound.jpg'}" alt="${resultJson.title}">
                    </div>
                    <div class="col-8">
                        ${resultJson.overview}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>`;
}


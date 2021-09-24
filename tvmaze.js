/* Using a search term, the program queries the TVMaze api and popluates the page with show and episode info
*
*/

// Return a list of objects. Each object representing a matching show and containing id, name, summary, and image 
async function searchShows(query) {
    res = await axios.get('http://api.tvmaze.com/search/shows', {params: {q :query}})
    return res.data
}

// Given a list of show objects add the shows to the DOM
function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  let image;
  for (let show of shows) {

    // Handle no image returned
    try {
        image = show.show.image.medium
    } catch {
        image = 'https://tinyurl.com/tv-missing'
    }

    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.show.id}">
         <div class="card" data-show-id="${show.show.id}">
           <div class="card-body">
           <img class="card-img-top" src="${image}">
             <h5 class="card-title">${show.show.name}</h5>
             <p class="card-text">${show.show.summary}</p>
             <button id="episodes">Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}

// Given a list of episode objects, add the episode name, season and show number to the DOM
function populateEpisodes(episodes) {
    const $episodesList = $("#episodes-list");
    $episodesList.empty();

    for (let episode of episodes) {
        let $item = $(
            `<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>
        `);
    //   $episodesList.append($item) //Vanilla JS way
      $episodesList.after($item)
    }

}

// Get search term from form, hide episode area, get a list of matching shows and populate DOM
$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

$("#shows-list").on("click", "button", async function (e) {
    const episodes = await getEpisodes(e.target.parentElement.parentElement.dataset.showId)
    $("#episodes-area").show();
    populateEpisodes(episodes)
})

// Given a show ID, return a list of episodes conaining id, name, season and number
async function getEpisodes(id) {
  res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  return res.data
}
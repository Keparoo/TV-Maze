/* Using a search term, the program queries the TVMaze api and popluates the page with show and episode info
*
*/

const MISSING_IMAGE_URL = 'https://tinyurl.com/tv-missing'

// Return a list of objects. Each object representing a matching show and containing id, name, summary, and image 
async function searchShows(query) {
    res = await axios.get('http://api.tvmaze.com/search/shows', {params: {q :query}})

    let shows = res.data.map(item => {
        return {
            id: item.show.id,
            name: item.show.name,
            summary: item.show.summary,
            // image: item.show.image
            image: item.show.image ? item.show.image.medium : MISSING_IMAGE_URL
        }
    })

    return shows
}

// Given a list of show objects add the shows to the DOM
function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  let image;
  for (let show of shows) {

    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
           <img class="card-img-top" src="${show.image}">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
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
    $("#episodes-area").show();
}

// Given a show ID, return a list of episodes containing id, name, season and episode number
async function getEpisodes(id) {
  res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)

  let episodes = res.data.map(episode => {
      return {
          id: episode.id,
          name: episode.name,
          season: episode.season,
          number: episode.number
      }
  })
  return episodes
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

  // Listen for button click to display episodes
  $("#shows-list").on("click", "button", async function (e) {
    let showId = e.target.parentElement.parentElement.dataset.showId
    const episodes = await getEpisodes(showId)
    populateEpisodes(episodes)
})
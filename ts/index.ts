const API_KEY = 'fd9e262f';
const BASE_URL = 'https://www.omdbapi.com/?apikey=' + API_KEY + '&';

interface Search {
  Poster: string;
  Title: string;
  Type: string;
  Year: string;
  imdbID: string;
}

interface Movie {
  Actors: string;
  Awards: string;
  BoxOffice: string;
  Country: string;
  DVD: string;
  Director: string;
  Genre: string;
  Language: string;
  Metascore: string;
  Plot: string;
  Poster: string;
  Production: string;
  Rated: string;
  Released: string;
  Response: string;
  Runtime: string;
  Title: string;
  Type: string;
  Website: string;
  Writer: string;
  Year: string;
  imdbID: string;
  imdbRating: string;
  imdbVotes: string;
  Ratings: [{ Source: string; Value: string }];
}

let timerId: number;

const searchMovie = async (title: string): Promise<Search[] | undefined> => {
  const response = await fetch(`${BASE_URL}s=${title}`);
  const result = await response.json();

  if (result.Response) {
    return result.Search;
  }
};

const findAll = async (): Promise<Search[] | undefined> => {
  const response = await fetch(`${BASE_URL}s=finding`);
  const result = await response.json();

  if (result.Response) {
    return result.Search;
  }
};

const renderHTML = (data: Search[] | undefined) => {
  const cards = document.getElementById('cards')!;

  if (!data) {
    return (cards.innerHTML = '<p class="text-2xl text-red-500">Movie Not Found!</p>');
  }

  let cHtml = '';

  data.forEach(m => {
    cHtml += `
    <div class="border shadow-sm hover:shadow-lg w-[300px] rounded-lg transition">
      <img
        src="${m.Poster}"
        alt="${m.Title}"
        class="rounded-b-lg h-[400px] w-[300px]"
      />
      <div class="p-5">
        <h2 class="text-xl font-semibold"><button class="hover:underline" onclick="handleDetailMovie('${m.imdbID}')">${m.Title}</button></h2>
        <p class="text-gray-500">${m.Year}</p>
        <p class="text-gray-500">${m.Type}</p>
        <p class="text-orange-500 bg-yellow-100 w-fit ml-auto px-2">${m.imdbID}</p>
      </div>
    </div>
  `;
  });

  cards.innerHTML = cHtml;
};

const renderModal = (movie: Movie) => {
  const modal = document.getElementById('modal')!;
  modal.innerHTML = ` 
    <div class="bg-[rgba(0,0,0,0.5)] fixed top-0 left-0 right-0 bottom-0">
      <div class="rounded shadow bg-black mx-auto mt-24 w-[1000px] relative">
        <div
          class="bg-[url('${movie.Poster}')] bg-cover bg-center h-[300px] w-full relative"
        ></div>
        <div
          class="absolute bg-gradient-to-t from-black via-[rgba(0,0,0,0.8)] to-[rgba(0,0,0,0.1)] top-0 bottom-80 left-0 right-0"
        ></div>
        <div class="ml-20 -mt-10 relative max-w-full w-2/3 pb-10">
          <h3 class="text-white text-4xl font-semibold">${movie.Title}</h3>
          <div class="flex items-center gap-5 mt-4">
            <p class="text-gray-400">${movie.Released}</p>
            <p class="text-green-500 font-semibold w-fit">★ ${movie.imdbRating}</p>
            <p class="border px-1 border-orange-400 text-orange-500 w-fit">${movie.Runtime}</p>
          </div>
          <p class="text-gray-200 mt-4">
            ${movie.Plot.substring(0, 500)}...
          </p>
          <p class="text-gray-400 mt-4">${movie.Genre}</p>
          <p class="text-gray-400">${movie.Director} | ${movie.Actors}</p>
          <p class="text-gray-400">${movie.Country}</p>

          <button class="border border-gray-300 px-3 mt-10 text-gray-300" onclick="handleCloseModal()">close</button>
        </div>
      </div>
    </div>
  `;
};

const handleCloseModal = () => {
  const modal = document.getElementById('modal')!;
  modal.innerHTML = '';
};

const handleDetailMovie = async (imdbID: string) => {
  const response = await fetch(`${BASE_URL}plot=full&i=${imdbID}`);
  const result = (await response.json()) as Movie;

  renderModal(result);
};

const handleSearchInput = (e: Event) => {
  clearTimeout(timerId);
  const inputElement = e.target as HTMLInputElement;

  timerId = setTimeout(async () => {
    const data = await searchMovie(inputElement.value);
    renderHTML(data);
  }, 500);
};

const main = async () => {
  const search = document.getElementById('search')!;
  search.addEventListener('keyup', handleSearchInput);

  const movie = await findAll();

  renderHTML(movie);
};

main();

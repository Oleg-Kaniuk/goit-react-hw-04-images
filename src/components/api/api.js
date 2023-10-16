import axios from "axios";
import { Notify } from "notiflix";

import { styleNotify } from "components/App";

const BASE_URL = "https://pixabay.com/api/";
const KEY = "39168194-caf31c4785fb07e962fbb3d97";

export async function fetchPhoto(search, page, perPage) {
    const url = `${BASE_URL}?key=${KEY}&q=${search}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal`;
    const response = await axios.get(url);
    return response.data;       
};

export function fetchError() {
    Notify.failure('Oops! Something went wrong! Try reloading the page or make another choice!', styleNotify);
};
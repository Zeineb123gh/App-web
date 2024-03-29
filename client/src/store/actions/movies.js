import { GET_MOVIES, SELECT_MOVIE, GET_SUGGESTIONS } from "../types";
import { setAlert } from "./alert";

export const uploadMovieImage = (id, image) => async (dispatch) => {
  try {
    const data = new FormData();
    data.append("file", image);
    const url = "api/movies/movies/photo/" + id;
    const response = await fetch(url, {
      method: "POST",
      body: data,
    });
    const responseData = await response.json();
    if (response.ok) {
      dispatch(setAlert("Image Uploaded", "success", 5000));
    }
    if (responseData.error) {
      dispatch(setAlert(responseData.error.message, "error", 5000));
    }
  } catch (error) {
    dispatch(setAlert(error.message, "error", 5000));
  }
};

export const getMovies = () => async (dispatch) => {
  try {
    const url = "api/movies/movies";
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const movies = await response.json();
    if (response.ok) {
      dispatch({ type: GET_MOVIES, payload: movies });
    }
  } catch (error) {
    dispatch(setAlert(error.message, "error", 5000));
  }
};

export const onSelectMovie = (movie) => ({
  type: SELECT_MOVIE,
  payload: movie,
});

export const getMovie = (id) => async (dispatch) => {
  try {
    const url = "api/movies/movies/" + id;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const movie = await response.json();
    if (response.ok) {
      dispatch({ type: SELECT_MOVIE, payload: movie });
    }
  } catch (error) {
    dispatch(setAlert(error.message, "error", 5000));
    return {
      status: "error",
      message: " Movie have not been geted, try again.",
    };
  }
};

export const getMovieSuggestion = (username) => async (dispatch) => {
  try {
    const url = "api/movies/movies/usermodeling/" + username;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const movies = await response.json();
    if (response.ok) {
      dispatch({ type: GET_SUGGESTIONS, payload: movies });
    }
  } catch (error) {
    dispatch(setAlert(error.message, "error", 5000));
    return {
      status: "error",
      message: " Movie have not been geted, try again.",
    };
  }
};

export const addMovie = (image, newMovie) => async (dispatch) => {
  try {
    const token = localStorage.getItem("jwtToken");
    const url = "api/movies/movies";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMovie),
    });
    const movie = await response.json();
    if (response.ok) {
      dispatch(setAlert("Movie have been saved!", "success", 5000));
      if (image) dispatch(uploadMovieImage(movie._id, image));
      dispatch(getMovies());
      return { status: "success", message: "Movie Created" };
    }
  } catch (error) {
    dispatch(setAlert(error.message, "error", 5000));
    return {
      status: "error",
      message: " Movie have not been saved, try again.",
    };
  }
};

export const updateMovie = (movieId, movie, image) => async (dispatch) => {
  try {
    const token = localStorage.getItem("jwtToken");
    const url = "api/movies/movies/" + movieId;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movie),
    });
    if (response.ok) {
      dispatch(onSelectMovie(null));
      dispatch(setAlert("Movie have been saved!", "success", 5000));
      if (image) dispatch(uploadMovieImage(movieId, image));
      dispatch(getMovies());
    }
  } catch (error) {
    dispatch(setAlert(error.message, "error", 5000));
    return {
      status: "error",
      message: " Movie have not been updated, try again.",
    };
  }
};

export const removeMovie = (movieId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("jwtToken");
    const url = "api/movies/movies/" + movieId;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      dispatch(getMovies());
      dispatch(onSelectMovie(null));
      dispatch(setAlert("Movie have been Deleted!", "success", 5000));
    }
  } catch (error) {
    dispatch(setAlert(error.message, "error", 5000));
    return {
      status: "error",
      message: " Movie have not been delated, try again.",
    };
  }
};

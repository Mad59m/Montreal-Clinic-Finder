import { useState } from "react";
import clinicImage from "../assets/images/clinic.png";
import googleAPIInstance from "../axios/axiosGoogle";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import axios from "axios";
import { useToasts } from "react-toast-notifications";

const columns = [
  { title: "Name", id: 1 },
  { title: "Opening hours", id: 2 },
  { title: "rating", id: 3 },
  { title: "vicinity", id: 4 },
  { title: "Add To Favorite", id: 5 },
  { title: "Location", id: 6 },
];

const HomePage = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nearByPlaces, setNearByPlaces] = useState([]);
  const { addToast } = useToasts();
  const submitForm = async (e) => {
    setQuery(query);

    if (query === "") {
      //if query is empty
      return null;
    } else if (query.toLowerCase()) {
      setLoading(true);
      setError(null);
      setNearByPlaces([]);
      try {
        const { data } = await googleAPIInstance.get(
          `/geocode/json?address=${query}&key=${process.env.REACT_APP_API_KEY}`
        );
        const { location } = data.results[0].geometry;
        const { data: nearByPlaces } = await googleAPIInstance.get(
          `/place/nearbysearch/json?location=${location.lat}%2C${location.lng}&radius=1500&type=hospital&key=${process.env.REACT_APP_API_KEY}`
        );
        setLoading(false);
        const updaedPlaces = nearByPlaces.results.map((place) => {
          return { ...place, isFavorite: false };
        });
        setNearByPlaces(updaedPlaces);
      } catch (error) {
        setLoading(false);
        setNearByPlaces([]);
        setError("some error occured");
      }
    }
  };

  const favoriteHandler = (id) => {
    console.log(id);
    const updatedPlaces = nearByPlaces.map((place) => {
      if (place.place_id === id) {
        return { ...place, isFavorite: !place.isFavorite };
      } else {
        return place;
      }
    });
    setNearByPlaces(updatedPlaces);
    const { id: userId, accessToken } = JSON.parse(
      localStorage.getItem("userData")
    );

    const selectedPlace = updatedPlaces.find((p) => p.place_id == id);
    if (!selectedPlace.isFavorite) {
      addToast("place removed", {
        appearance: "warning",
        autoDismiss: true,
      });
      return;
    }

    axios
      .post(
        "/api/user/favorite",
        { placeId: id, userId },
        {
          headers: {
            authorization: accessToken,
          },
        }
      )
      .then((res) => {
        addToast(res.data.message, {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((err) => {
        addToast(err.response.data.message, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };
  return (
    <div className="mt-4 container">
      <header>
        <div className="flex flex-col md:flex-row md:items-center md:justify-center">
          <div className="flex justify-center md:w-1/3">
            <img src={clinicImage} alt="clinic" className="w-2/3 md:w-72" />
          </div>
          <div>
            <h1 className="font-bold text-xl md:text-4xl">
              Avez-vous besoin d'un médecin?
            </h1>
            <h1 className="font-bold text-xl md:text-4xl mt-2">
              Do you need a doctor?
            </h1>
            <br />
            <h2 className="font-medium text-lg text-gray-700 md:text-2xl mt-2">
              No worries! Its easy and simple just enter your postal code
              bellow.
            </h2>
          </div>
        </div>
      </header>
      <section className="flex justify-center mt-4">
        <div
          className="pt-2 relative mx-auto text-gray-600 flex flex-col space-y-4 
          md:flex-row md:items-center md:space-y-0"
        >
          <input
            onChange={(e) => setQuery(e.target.value)}
            className="border-2 border-gray-300 bg-white h-12 px-5 pr-16 
              rounded-lg text-sm md:text-base focus:outline-none md:w-80"
            type="text"
            name="search"
            value={query}
            placeholder="Search"
          />
          <button
            type="submit"
            className="bg-purple-100 py-2 px-4 md:ml-4 rounded font-bold  text-primary"
            onClick={submitForm}
          >
            find
          </button>
        </div>
      </section>
      <section className="flex justify-center">
        {error && <p className="text-3xl text-red-500 mt-8">{error}</p>}
        {loading && <p className="text-3xl text-green-500 mt-8">Loading ...</p>}
        {nearByPlaces.length ? (
          <table className="mx-auto divide-y divide-gray-200 my-8">
            <thead className=" bg-gray-50">
              <tr>
                {columns.map((col) => {
                  return (
                    <th
                      key={col.id}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {col.title}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 px-4">
              {nearByPlaces.map((place) => {
                return (
                  <tr key={place.name}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {place.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold">
                      {place.opening_hours?.open_now ? (
                        <span className="text-green-500">OPEN</span>
                      ) : (
                        <span className="text-red-500">CLOSE</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {place.rating || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {place.vicinity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => favoriteHandler(place.place_id)}>
                        {place.isFavorite ? (
                          <AiFillHeart />
                        ) : (
                          <AiOutlineHeart />
                        )}
                      </button>
                    </td>
                    <td>
                      <a
                        className="block text-blue-500 mr-2"
                        rel="noreferrer"
                        target="_blank"
                        href={`https://maps.google.com/?q=${place.geometry.location.lat},${place.geometry.location.lng}`}
                      >
                        Check on google Map?
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : null}
      </section>
    </div>
  );
};
export default HomePage;

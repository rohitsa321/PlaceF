import React, { useState, useEffect } from "react";
import "./ShowCard.css";
import { Link } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import { useStateContext } from "./StateProvider";
import imageResize from "./imageresize";

export default function ShowCard({ data, updation }) {
  const [image, setImage] = useState(null);
  const [{ user, userplaces, places }, dispatch] = useStateContext();
  useEffect(() => {
    async function fetchImage() {
      if (data._id) {
        // decoding binary image data
        var buffer = new Buffer.from(data.img, "base64");
        var byteString = atob(buffer);
        // write the bytes of the string to an ArrayBuffer
        var array_buffer = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(array_buffer);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        // write the ArrayBuffer to a blob
        var blob = new Blob([array_buffer]);
        const resizedImage = await imageResize(blob, 280, 260);
        setImage(resizedImage);
      }
    }
    fetchImage();
  }, [data._id, data.img]);

  const deletePlace = async () => {
    await axios
      .delete(`http://localhost:3001/${user._id}`, {
        data: new Object({ _id: data._id }),
      })
      .then((res) => {
        //deleting from userplaces
        const updatedUserplaces = userplaces.filter(
          (item) => item._id !== data._id
        );
        dispatch({
          type: "setuserplaces",
          userplaces: updatedUserplaces,
        });

        //deleting from places
        const updatedPlaces = places.filter((item) => item._id !== data._id);
        dispatch({
          type: "setplaces",
          places: updatedPlaces,
        });

        alert("deleted");
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div>
      {updation ? (
        <button onClick={deletePlace}>
          <AiFillDelete size="25" />{" "}
        </button>
      ) : null}
      <div className="card">
        <Link
          to={{
            pathname: "/info",
            info: { data, updation },
          }}
          style={{ textDecoration: "none" }}
        >
          <div className="card">
            <div className="card_img">
              <img src={image} alt="img" />
            </div>
            <div className="card_info">
              <h5>
                {data.location.length < 25
                  ? data.location
                  : data.location.substring(0, 25)}
              </h5>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

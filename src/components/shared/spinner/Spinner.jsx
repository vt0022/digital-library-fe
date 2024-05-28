import { HashLoader } from "react-spinners";
import "./spinner.css";

const Spinner = ({ loading }) => {
    if (!loading) return null;

    return (
        <div className="overlay">
            <HashLoader size={50} color={"#36d7b7"} loading={loading} speedMultiplier={1} />
        </div>
    );
};

export default Spinner;

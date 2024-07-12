import mongoose from "mongoose";

const connectToDB = async () => {
  const connectionURL =
    "mongodb+srv://anton123:anton123@cluster0.1apgvud.mongodb.net/";

  mongoose
    .connect(connectionURL)
    .then(() => console.log("Connection is successfull"))
    .catch((error) => console.log(error));
};

export default connectToDB;

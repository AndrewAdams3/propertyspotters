import Axios from 'axios';

export const populateData = async () => {
  let d = [], u = [];
  await Axios.get(process.env.REACT_APP_SERVER + "/data/users")
    .then(({ data }) => {
        u = data
    })
    .catch((err) => {
      console.log(err);
    })
  await Axios.get(process.env.REACT_APP_SERVER + "/data/drivebys/all")
    .then(({ data }) => {
        d = data.docs
    })
    .catch((err) => {
      console.log(err);
    })
  
  return ({u: u, d: d});
}
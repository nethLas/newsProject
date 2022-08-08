export default function errorMessage(error, thunkAPI) {
  const message =
    (error.response && error.response.data && error.response.data.message) ||
    error.message ||
    error.toString();
  console.log(message);
  return thunkAPI.rejectWithValue(message);
}

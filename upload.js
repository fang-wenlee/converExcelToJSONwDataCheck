const UploadJson = () => {
  return (
    <form>
      <label htmlFor="upload">Upload File</label>
      <input type="file" name="upload" id="upload" onChange={readUploadFile} />
    </form>
  );
};

export default UploadJson;

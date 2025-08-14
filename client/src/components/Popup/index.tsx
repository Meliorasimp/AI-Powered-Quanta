const Popup = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">This is a popup!</h2>
        <p>You can put anything here.</p>
      </div>
    </div>
  );
};

export default Popup;

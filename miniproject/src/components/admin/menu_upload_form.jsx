import React, { useState } from "react";
import { apiMenuAdd } from "../../api/api";

export default function MenuUploadForm() {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    discount: "",
    descrip: "",
    badge: "",
    imageUrl: "",
    veg: false,
    available: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // IMAGE DROP HANDLER
  const handleImageDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // IMAGE SELECT HANDLER
  const handleImageSelect = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      category: formData.category,
      price: parseInt(formData.price),
      discount: parseInt(formData.discount) || 0,
      descrip: formData.desc, // map frontend desc to backend schema descrip
      image: formData.imageUrl || "", // map URL field
      badge: formData.badge,
      veg: formData.veg,
      available: formData.available,
    };

    try {
      await apiMenuAdd(payload);
      alert("Menu item uploaded successfully!");
      
      // Reset form
      setFormData({
        id: "", name: "", category: "", price: "", discount: "", desc: "", badge: "", imageUrl: "", veg: false, available: true
      });
      setImagePreview(null);
      setImageFile(null);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-[#0f0f0f] border border-cyan-700 rounded-2xl shadow-lg shadow-[#d931ba33] p-8 w-full max-w-3xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-cyan-400 text-center">
          Menu Upload Panel
        </h2>

        {/* IMAGE UPLOAD SECTION */}

        <div
          onDrop={handleImageDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-cyan-600 rounded-xl p-6 text-center hover:border-[#d931ba] transition"
        >
          {imagePreview || formData.imageUrl ? (
            <img
              src={imagePreview || formData.imageUrl}
              className="mx-auto h-40 rounded-lg object-contain"
              alt="preview"
              onError={(e) => e.target.style.display = 'none'}
              onLoad={(e) => e.target.style.display = 'block'}
            />
          ) : (
            <p className="text-gray-400 mb-4">
              Drag & Drop IMAGE here OR select manually
            </p>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="text-white text-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
            <label className="text-cyan-400 text-sm font-semibold">Or enter Image URL (Recomended)</label>
            <input
              name="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="bg-black border border-cyan-600 focus:border-[#d931ba] focus:shadow-[0_0_6px_#d931ba] outline-none rounded-lg px-3 py-2 text-white w-full"
            />
        </div>

        {/* INPUT GRID */}

        <div className="grid grid-cols-2 gap-4">
          {[
            "id",
            "name",
            "category",
            "price",
            "discount",
            "badge",
          ].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field.toUpperCase()}
              onChange={handleInputChange}
              className="bg-black border border-cyan-600 focus:border-[#d931ba] focus:shadow-[0_0_6px_#d931ba] outline-none rounded-lg px-3 py-2 text-white"
            />
          ))}
        </div>

        {/* DESCRIPTION */}

        <textarea
          name="desc"
          placeholder="DESCRIPTION"
          onChange={handleInputChange}
          className="w-full bg-black border border-cyan-600 focus:border-[#d931ba] focus:shadow-[0_0_6px_#d931ba] outline-none rounded-lg px-3 py-2 text-white"
        />

        {/* CHECKBOXES */}

        <div className="flex gap-6 text-white">
          <label className="flex gap-2">
            <input
              type="checkbox"
              name="veg"
              onChange={handleInputChange}
              className="accent-[#d931ba]"
            />
            Veg
          </label>

          <label className="flex gap-2">
            <input
              type="checkbox"
              name="available"
              defaultChecked
              onChange={handleInputChange}
              className="accent-cyan-400"
            />
            Available
          </label>
        </div>

        {/* SUBMIT BUTTON */}

        <button className="w-full bg-[#d931ba] hover:scale-105 transition shadow-[0_0_18px_#d931ba] py-3 rounded-xl border-gray-900 text-white font-semibold">
          Upload Menu Item
        </button>
      </form>
    </div>
  );
}
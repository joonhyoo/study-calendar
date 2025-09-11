import { useState } from 'react';

export const MaterialEditor = ({
  material,
  handleSave,
  handleArchiveMaterial,
}) => {
  const [isExpand, setIsExpand] = useState(false);
  const [title, setTitle] = useState(material.title);
  const [description, setDescription] = useState(material.description);

  const handleCancel = () => {
    setTitle(material.title);
    setDescription(material.description);
    setIsExpand(false);
  };

  return (
    <div className="flex flex-col gap-[16px] p-[16px] bg-[#323334]">
      <div className="flex">
        <input
          className="w-full p-[8px] text-[20px]"
          type="text"
          value={title}
          onChange={(e) => {
            if (e.target.value.length <= 20) setTitle(e.target.value);
          }}
          onClick={() => setIsExpand(true)}
        />
        {isExpand && (
          <button
            className="hover:cursor-pointer hover:brightness-75 px-[16px]"
            onClick={() => handleArchiveMaterial(material.id)}
          >
            archive
          </button>
        )}
      </div>
      {isExpand && (
        <textarea
          className="resize-none h-22 p-[8px] text-[16px] bg-[#404142]"
          value={description}
          onChange={(e) => {
            if (e.target.value.length <= 100) setDescription(e.target.value);
          }}
        />
      )}
      {isExpand && (
        <div className="flex gap-[32px] justify-center">
          <button
            className="hover:cursor-pointer hover:brightness-75"
            onClick={() => {
              handleSave(title, description, material.id);
              setIsExpand(false);
            }}
          >
            save
          </button>
          <button
            className="hover:cursor-pointer hover:brightness-75"
            onClick={handleCancel}
          >
            cancel
          </button>
        </div>
      )}
    </div>
  );
};
